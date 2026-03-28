#!/usr/bin/env python3
"""Deploy Slidev decks to Cloudflare Workers Static Assets.

Single deck (run from the deck directory):
  python tools/deploy-cf.py                         # deploy current deck
  python tools/deploy-cf.py --name my-talk          # custom worker name
  python tools/deploy-cf.py --dry-run               # build only

Collection (run from the project root):
  python tools/deploy-cf.py --collection            # deploy all decks as gallery
  python tools/deploy-cf.py --collection --name slides  # custom worker name

Requirements:
  - Node.js with npx available
  - wrangler authenticated (run `npx wrangler login` first)
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


def get_repo_root() -> Path:
    """Find the git repository root."""
    script_dir = Path(__file__).resolve().parent
    return script_dir.parent


def run(cmd: list[str], cwd: str | Path, check: bool = True) -> subprocess.CompletedProcess:
    """Run a command, printing it first."""
    print(f"  $ {' '.join(cmd)}", flush=True)
    result = subprocess.run(cmd, cwd=str(cwd))
    if check and result.returncode != 0:
        sys.exit(f"Command failed (exit {result.returncode}): {' '.join(cmd)}")
    return result


def find_deck_dir() -> Path:
    """Find the deck directory — the current directory if it has slides.md,
    or walk up to find one."""
    cwd = Path.cwd()
    if (cwd / "slides.md").is_file():
        return cwd
    # Check if we're in a subdirectory of a deck
    for parent in cwd.parents:
        if (parent / "slides.md").is_file():
            return parent
    return cwd


def detect_deck_name(deck_dir: Path) -> str:
    """Extract a worker-friendly name from the deck title or directory."""
    slides = deck_dir / "slides.md"
    if slides.is_file():
        for line in slides.read_text().splitlines():
            m = re.match(r"^title:\s*(.+)$", line)
            if m:
                title = m.group(1).strip().strip("'\"")
                # Slugify: lowercase, replace non-alnum with hyphens
                slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
                if slug:
                    return slug
    return deck_dir.name


def write_wrangler_config(deploy_dir: Path, name: str) -> Path:
    """Write a minimal wrangler.jsonc for Workers Static Assets."""
    config = {
        "name": name,
        "compatibility_date": "2025-04-01",
        "assets": {
            "directory": "./public",
            "html_handling": "auto-trailing-slash",
            "not_found_handling": "single-page-application",
        },
    }
    config_path = deploy_dir / "wrangler.jsonc"
    config_path.write_text(json.dumps(config, indent=2) + "\n")
    return config_path


def build_single_deck(deck_dir: Path, public_dir: Path) -> None:
    """Build a single deck and prepare it for deployment."""
    repo_root = get_repo_root()

    # Install deps if needed
    if not (repo_root / "node_modules").is_dir():
        print("Installing dependencies...")
        run(["npm", "install", "--prefix", str(repo_root)], cwd=repo_root)

    # Build with base / (single deck at root)
    print(f"\nBuilding deck from {deck_dir}...")
    run(
        ["npx", "slidev", "build", "--base", "/", "--out", str(public_dir)],
        cwd=deck_dir,
    )

    # Copy slides.md for programmatic access
    slides_src = deck_dir / "slides.md"
    if slides_src.is_file():
        shutil.copy2(slides_src, public_dir / "slides.md")

    # Split slides into per-slide files
    split_slides(public_dir, deck_dir)

    # Inject <link rel="alternate"> for markdown discovery
    inject_alternate_link(public_dir)

    # Remove Slidev-generated _redirects (Workers handles SPA routing)
    for redir in public_dir.rglob("_redirects"):
        redir.unlink()

    print(f"\nBuild complete: {public_dir}")


def build_collection(public_dir: Path) -> None:
    """Build all decks as a gallery using the existing build system."""
    repo_root = get_repo_root()
    build_py = repo_root / "tools" / "build.py"

    if not build_py.is_file():
        sys.exit(f"Error: build script not found: {build_py}")

    print("\nBuilding all decks...")
    run([sys.executable, str(build_py)], cwd=repo_root)

    # Copy _build contents to public_dir
    build_dir = repo_root / "examples" / "_build"
    if not build_dir.is_dir():
        sys.exit(f"Error: build output not found: {build_dir}")

    if public_dir.exists():
        shutil.rmtree(public_dir)
    shutil.copytree(build_dir, public_dir)

    print(f"\nCollection build complete: {public_dir}")


def parse_slides_md(text: str) -> list[str]:
    """Parse Slidev markdown into individual slides."""
    lines = text.split("\n")
    slides: list[str] = []
    current: list[str] = []
    i = 0

    while i < len(lines) and lines[i].strip() == "":
        i += 1

    if i < len(lines) and re.match(r"^---\s*$", lines[i]):
        current.append(lines[i])
        i += 1

    while i < len(lines):
        if re.match(r"^---\s*$", lines[i]):
            current.append(lines[i])
            i += 1
            break
        current.append(lines[i])
        i += 1

    while i < len(lines):
        if re.match(r"^---\s*$", lines[i]):
            slides.append("\n".join(current))
            current = []
            current.append(lines[i])
            i += 1
            has_fm = False
            peek = i
            while peek < len(lines):
                if re.match(r"^---\s*$", lines[peek]):
                    has_fm = True
                    break
                if (
                    not re.match(r"^[a-zA-Z_][a-zA-Z0-9_-]*\s*:", lines[peek])
                    and lines[peek].strip() != ""
                ):
                    break
                peek += 1
            if has_fm:
                while i <= peek:
                    current.append(lines[i])
                    i += 1
            continue
        current.append(lines[i])
        i += 1

    if current:
        slides.append("\n".join(current))

    return slides


def split_slides(build_dir: Path, source_dir: Path) -> None:
    """Split slides.md into per-slide Markdown files."""
    slides_file = build_dir / "slides.md"
    if not slides_file.is_file():
        return

    out_dir = build_dir / "slides"
    out_dir.mkdir(parents=True, exist_ok=True)

    raw = slides_file.read_text()
    slides = parse_slides_md(raw)

    for idx, slide in enumerate(slides, 1):
        (out_dir / f"{idx}.md").write_text(slide.strip() + "\n")

    (out_dir / "count").write_text(str(len(slides)) + "\n")
    print(f"  -> Split into {len(slides)} slides")


def inject_alternate_link(build_dir: Path) -> None:
    """Inject <link rel='alternate'> into index.html for markdown discovery."""
    index = build_dir / "index.html"
    if not index.is_file():
        return

    html = index.read_text()
    link_tag = '<link rel="alternate" type="text/markdown" href="slides.md">'
    if link_tag in html:
        return

    html = html.replace("</head>", f"  {link_tag}\n</head>", 1)
    index.write_text(html)


def deploy(deploy_dir: Path, name: str) -> None:
    """Run wrangler deploy from the deploy directory."""
    print(f"\nDeploying as '{name}' to Cloudflare Workers...")
    run(["npx", "wrangler", "deploy"], cwd=deploy_dir)


def main():
    parser = argparse.ArgumentParser(
        description="Deploy Slidev decks to Cloudflare Workers Static Assets.",
        epilog="Examples:\n"
               "  python tools/deploy-cf.py                    # deploy current deck\n"
               "  python tools/deploy-cf.py --name my-talk     # custom worker name\n"
               "  python tools/deploy-cf.py --collection       # deploy all decks\n"
               "  python tools/deploy-cf.py --dry-run          # build only\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--name",
        default=None,
        help="Cloudflare Worker name (default: derived from deck title)",
    )
    parser.add_argument(
        "--collection",
        action="store_true",
        help="Build and deploy all decks as a gallery (for project maintainers)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Build only, don't deploy to Cloudflare",
    )
    parser.add_argument(
        "--deck",
        default=None,
        help="Path to deck directory (default: current directory)",
    )
    args = parser.parse_args()

    # Create a temporary deploy workspace
    deploy_dir = Path(tempfile.mkdtemp(prefix="slidev-deploy-"))
    public_dir = deploy_dir / "public"

    try:
        if args.collection:
            # Collection mode: build all decks
            name = args.name or "slides"
            build_collection(public_dir)
        else:
            # Single deck mode
            deck_dir = Path(args.deck) if args.deck else find_deck_dir()
            if not (deck_dir / "slides.md").is_file():
                sys.exit(
                    f"Error: no slides.md found in {deck_dir}\n"
                    "Run this from a deck directory, or pass --deck /path/to/deck"
                )
            name = args.name or detect_deck_name(deck_dir)
            build_single_deck(deck_dir, public_dir)

        # Write wrangler config
        write_wrangler_config(deploy_dir, name)

        if args.dry_run:
            print(f"\n[dry-run] Built to: {public_dir}")
            print(f"[dry-run] Worker name: {name}")
            print("[dry-run] Skipping deploy. Re-run without --dry-run to push to Cloudflare.")
            # Don't clean up on dry-run so user can inspect
            return

        # Deploy
        deploy(deploy_dir, name)

        print(f"\nDeployed to: https://{name}.*.workers.dev/")
        print("To use a custom domain, run: npx wrangler domains attach <domain>")

    finally:
        if not args.dry_run and deploy_dir.exists():
            shutil.rmtree(deploy_dir, ignore_errors=True)


if __name__ == "__main__":
    main()

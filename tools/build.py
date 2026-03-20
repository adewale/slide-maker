#!/usr/bin/env python3
"""Build all Slidev presentation decks.

Python equivalent of examples/build.sh. Produces identical output in
examples/_build/.

Environment variables:
    BASE_PREFIX  — URL prefix for each deck (e.g. "" or "/slides")
    DECKS_DIR    — optional directory containing external decks
    SITE_URL     — base URL for links in llms.txt
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path


# ── Constants ────────────────────────────────────────────────────

# dir:name pairs for core decks living under examples/
CORE_DECKS: list[tuple[str, str]] = [
    ("demo", "slide-maker"),
    ("reference", "reference"),
]


# ── Helpers ──────────────────────────────────────────────────────

def run(cmd: list[str], cwd: str | Path) -> None:
    """Run a command, inheriting stdout/stderr. Abort on failure."""
    print(f"  $ {' '.join(cmd)}", flush=True)
    result = subprocess.run(cmd, cwd=str(cwd))
    if result.returncode != 0:
        sys.exit(f"Command failed (exit {result.returncode}): {' '.join(cmd)}")


def read_file(path: str | Path) -> str:
    with open(path, "r") as f:
        return f.read()


def grep_title(slides_md: Path) -> str:
    """Extract the title from frontmatter, or fall back to the file's parent dir name."""
    try:
        for line in slides_md.read_text().splitlines():
            m = re.match(r"^title:\s*(.+)$", line)
            if m:
                return m.group(1).strip()
    except OSError:
        pass
    return slides_md.parent.name


# ── Sync skill files ────────────────────────────────────────────

def sync_skill_files(deck_dir: Path, skill_dir: Path) -> None:
    """Copy canonical skill files into a deck where matching files exist.

    The skill is the source of truth. Decks keep copies so they work
    standalone, but before building we refresh them from the skill.
    """
    # Components
    comp_dir = deck_dir / "components"
    if comp_dir.is_dir():
        for comp in comp_dir.glob("*.vue"):
            skill_comp = skill_dir / "components" / comp.name
            if skill_comp.is_file():
                shutil.copy2(skill_comp, comp)

    # Composables, setup, styles
    for subdir in ("composables", "setup", "styles"):
        deck_sub = deck_dir / subdir
        if deck_sub.is_dir():
            for file in deck_sub.iterdir():
                if not file.is_file():
                    continue
                skill_file = skill_dir / subdir / file.name
                if skill_file.is_file():
                    shutil.copy2(skill_file, file)


# ── Slide splitting ─────────────────────────────────────────────

def parse_slides(text: str) -> list[str]:
    """Parse Slidev markdown into individual slides.

    Slidev format: the file starts with --- (opening frontmatter).
    Each --- on its own line is a slide separator. A separator may be
    followed by YAML frontmatter (key: value lines) before the next ---.
    The pattern is: slide content, then ---, then optional frontmatter,
    then --- again (which closes frontmatter and starts content).
    """
    lines = text.split("\n")
    slides: list[str] = []
    current: list[str] = []
    i = 0

    # Skip leading blank lines
    while i < len(lines) and lines[i].strip() == "":
        i += 1

    # First line should be ---
    if i < len(lines) and re.match(r"^---\s*$", lines[i]):
        current.append(lines[i])
        i += 1
    else:
        # No frontmatter — treat everything up to first --- as slide 1
        pass

    # Read until we hit the next --- (end of global frontmatter)
    while i < len(lines):
        if re.match(r"^---\s*$", lines[i]):
            current.append(lines[i])
            i += 1
            break
        current.append(lines[i])
        i += 1

    # Read slide 1 content until the next ---
    while i < len(lines):
        if re.match(r"^---\s*$", lines[i]):
            # This --- is a slide separator — start a new slide
            slides.append("\n".join(current))
            current = []
            # Collect the new slide: starts with --- then optional frontmatter
            current.append(lines[i])
            i += 1
            # Check for per-slide frontmatter (key: value lines until ---)
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
                # Read frontmatter lines + closing ---
                while i < len(lines):
                    current.append(lines[i])
                    if re.match(r"^---\s*$", lines[i]) and len(current) > 1:
                        i += 1
                        break
                    i += 1
            continue
        current.append(lines[i])
        i += 1

    if current:
        slides.append("\n".join(current))

    return slides


def resolve_src_slides(slides_list: list[str], base_dir: str | Path) -> list[str]:
    """Expand any ``src:`` import slides into their contents."""
    result: list[str] = []
    for slide in slides_list:
        slide_lines = slide.strip().split("\n")
        src_path = None
        for line in slide_lines:
            m = re.match(r"^src:\s*(.+)$", line.strip())
            if m:
                src_path = m.group(1).strip()
                break
        if src_path:
            full_path = os.path.normpath(os.path.join(str(base_dir), src_path))
            if os.path.exists(full_path):
                imported = read_file(full_path)
                imported_slides = parse_slides(imported)
                result.extend(imported_slides)
            else:
                result.append(slide)
        else:
            result.append(slide)
    return result


def split_slides(deck_build_dir: Path, source_dir: Path) -> None:
    """Split slides.md into per-slide Markdown files (slides/1.md, ...)."""
    slides_file = deck_build_dir / "slides.md"
    if not slides_file.is_file():
        return

    out_dir = deck_build_dir / "slides"
    out_dir.mkdir(parents=True, exist_ok=True)

    raw = read_file(slides_file)
    slides = parse_slides(raw)
    slides = resolve_src_slides(slides, source_dir)

    for idx, slide in enumerate(slides, 1):
        content = slide.strip()
        (out_dir / f"{idx}.md").write_text(content + "\n")

    (out_dir / "count").write_text(str(len(slides)) + "\n")
    print(f"  -> Split into {len(slides)} slides")


# ── Build a single deck ─────────────────────────────────────────

def build_deck(
    name: str,
    deck_src_dir: Path,
    out: Path,
    base_prefix: str,
    label: str = "",
) -> None:
    """Run ``npx slidev build`` for one deck and copy source Markdown."""
    tag = f" ({label})" if label else ""
    print(f"\nBuilding {name}{tag}...")
    deck_out = out / name
    run(
        ["npx", "slidev", "build", "--base", f"{base_prefix}/{name}/", "--out", str(deck_out)],
        cwd=deck_src_dir,
    )
    # Copy slides.md so the site can serve it
    shutil.copy2(deck_src_dir / "slides.md", deck_out / "slides.md")
    # Copy pages/ if present
    pages_dir = deck_src_dir / "pages"
    if pages_dir.is_dir():
        shutil.copytree(pages_dir, deck_out / "pages", dirs_exist_ok=True)


# ── serve.json ──────────────────────────────────────────────────

def generate_serve_json(out: Path, all_deck_names: list[str]) -> None:
    """Write serve.json with SPA rewrite rules for ``npx serve``."""
    rewrites = [
        {"source": f"/{name}/**", "destination": f"/{name}/index.html"}
        for name in all_deck_names
    ]
    (out / "serve.json").write_text(json.dumps({"rewrites": rewrites}, indent=2) + "\n")


# ── Delete _redirects ───────────────────────────────────────────

def delete_redirects(out: Path) -> None:
    """Remove every ``_redirects`` file under *out*.

    Slidev generates per-deck _redirects that conflict with Cloudflare
    Workers' ``not_found_handling: "single-page-application"``. GitHub
    Pages uses 404.html instead. Only ``npx serve`` uses serve.json.
    """
    for redir in out.rglob("_redirects"):
        redir.unlink()


# ── Inject <link rel="alternate"> ───────────────────────────────

def inject_alternate_link(out: Path, all_deck_names: list[str]) -> None:
    """Add ``<link rel="alternate" type="text/markdown">`` to each deck's index.html."""
    link_tag = '<link rel="alternate" type="text/markdown" href="slides.md" title="Slide Markdown">'
    for name in all_deck_names:
        deck_index = out / name / "index.html"
        if deck_index.is_file():
            html = deck_index.read_text()
            html = html.replace("</head>", f"{link_tag}</head>", 1)
            deck_index.write_text(html)


# ── llms.txt ────────────────────────────────────────────────────

def generate_llms_txt(
    out: Path,
    site_url: str,
    core_decks: list[tuple[str, str]],
    local_decks: list[tuple[str, str]],
    generated_deck_names: list[str],
    all_deck_names: list[str],
    examples_root: Path,
    decks_dir: str,
    generated_dir: Path,
) -> None:
    """Write llms.txt conforming to https://llmstxt.org/."""
    lines: list[str] = []

    lines.append("# Slide Maker")
    lines.append("")
    lines.append(
        "> A collection of Slidev presentation decks built with the Slide Maker skill"
        " for Claude Code. Each deck is available as an interactive presentation and"
        " as raw Markdown. Individual slides are available at slides/N.md where N is"
        " the slide number."
    )
    lines.append("")
    lines.append("## Decks")
    lines.append("")

    # Core decks
    for dir_name, name in core_decks:
        title = grep_title(examples_root / dir_name / "slides.md")
        count = _read_count(out / name / "slides" / "count")
        lines.append(f"- [{title}]({site_url}/{name}/slides.md): {count} slides (core project deck)")

    # Local (external) decks
    for dir_name, name in local_decks:
        if decks_dir:
            title = grep_title(Path(decks_dir) / dir_name / "slides.md")
        else:
            title = name
        count = _read_count(out / name / "slides" / "count")
        lines.append(f"- [{title}]({site_url}/{name}/slides.md): {count} slides")

    # Generated decks
    for name in generated_deck_names:
        title = grep_title(generated_dir / name / "slides.md")
        count = _read_count(out / name / "slides" / "count")
        lines.append(
            f"- [{title}]({site_url}/{name}/slides.md): {count} slides"
            " (generated from GitHub project)"
        )

    lines.append("")
    lines.append("## Optional")
    lines.append("")
    lines.append(
        "Per-slide Markdown is available for each deck. Replace slides.md with"
        " slides/N.md to fetch slide N, or slides/count for the total number of slides."
    )
    lines.append("")

    for name in all_deck_names:
        count_str = _read_count(out / name / "slides" / "count")
        try:
            total = int(count_str)
        except ValueError:
            continue
        for n in range(1, total + 1):
            lines.append(f"- [{name} slide {n}]({site_url}/{name}/slides/{n}.md)")

    (out / "llms.txt").write_text("\n".join(lines) + "\n")


def _read_count(path: Path) -> str:
    try:
        return path.read_text().strip()
    except OSError:
        return "?"


# ── 404.html ────────────────────────────────────────────────────

_404_HTML = """\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Redirecting...</title></head>
<body>
<script>
// GitHub Pages SPA redirect: convert path-based slide URLs to hash routes.
// /base/deck-name/3 -> /base/deck-name/#/3
// /base/deck-name/  -> /base/deck-name/ (no change, index.html serves it)
var path = window.location.pathname;
var parts = path.replace(/\\/$/, '').split('/');
var last = parts[parts.length - 1];
if (/^\\d+$/.test(last)) {
  // Last segment is a slide number — redirect to hash route
  parts.pop();
  window.location.replace(parts.join('/') + '/#/' + last);
} else if (path !== '/' && path !== '/index.html') {
  // Non-numeric path — try appending / to hit the deck's index.html
  window.location.replace(path.replace(/\\/?$/, '/'));
} else {
  window.location.replace('/');
}
</script>
</body>
</html>
"""


# ── Main ─────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Build all Slidev presentation decks into examples/_build/",
    )
    parser.add_argument(
        "--base-prefix",
        default=os.environ.get("BASE_PREFIX", ""),
        help="URL prefix for each deck (env: BASE_PREFIX)",
    )
    parser.add_argument(
        "--decks-dir",
        default=os.environ.get("DECKS_DIR", ""),
        help="Optional directory containing external decks (env: DECKS_DIR)",
    )
    parser.add_argument(
        "--site-url",
        default=os.environ.get("SITE_URL", ""),
        help="Base URL for links in llms.txt (env: SITE_URL)",
    )
    args = parser.parse_args()

    base_prefix: str = args.base_prefix
    decks_dir: str = args.decks_dir
    site_url: str = args.site_url

    # Resolve paths relative to the repo
    examples_root = Path(__file__).resolve().parent.parent / "examples"
    repo_root = examples_root.parent
    skill_dir = repo_root / "skills" / "slide-maker"
    generated_dir = repo_root / "generated-decks"
    out = examples_root / "_build"

    # Install deps if needed
    if not (repo_root / "node_modules").is_dir():
        print("Installing dependencies...")
        run(["npm", "install", "--prefix", str(repo_root)], cwd=repo_root)

    # Clean previous build
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    # ── Discover generated decks ─────────────────────────────────
    generated_deck_names: list[str] = []
    if generated_dir.is_dir():
        for entry in sorted(generated_dir.iterdir()):
            if entry.is_dir() and (entry / "slides.md").is_file():
                generated_deck_names.append(entry.name)

    # External decks placeholder (populated when DECKS_DIR is used)
    local_decks: list[tuple[str, str]] = []

    # ── Build core decks ─────────────────────────────────────────
    for dir_name, name in CORE_DECKS:
        deck_src = examples_root / dir_name
        print(f"\nSyncing skill files into {dir_name}...")
        sync_skill_files(deck_src, skill_dir)
        build_deck(name, deck_src, out, base_prefix, label="core")

    # ── Build external decks ─────────────────────────────────────
    if decks_dir and Path(decks_dir).is_dir():
        for dir_name, name in local_decks:
            deck_src = Path(decks_dir) / dir_name
            build_deck(name, deck_src, out, base_prefix)

    # ── Build generated decks ────────────────────────────────────
    for name in generated_deck_names:
        deck_src = generated_dir / name
        build_deck(name, deck_src, out, base_prefix, label="generated")

    # ── Split slides for all built decks ─────────────────────────
    for dir_name, name in CORE_DECKS:
        split_slides(out / name, examples_root / dir_name)

    for dir_name, name in local_decks:
        split_slides(out / name, Path(decks_dir) / dir_name)

    for name in generated_deck_names:
        split_slides(out / name, generated_dir / name)

    # ── Collect all deck names ───────────────────────────────────
    all_deck_names: list[str] = []
    for _, name in CORE_DECKS:
        all_deck_names.append(name)
    for _, name in local_decks:
        all_deck_names.append(name)
    for name in generated_deck_names:
        all_deck_names.append(name)

    # ── Copy menu page, viewer, and prevent Jekyll processing ────
    shutil.copy2(examples_root / "index.html", out / "index.html")
    shutil.copy2(examples_root / "view.html", out / "view.html")
    (out / ".nojekyll").touch()

    # ── Generate serve.json ──────────────────────────────────────
    generate_serve_json(out, all_deck_names)

    # ── Remove _redirects files ──────────────────────────────────
    delete_redirects(out)

    # ── Inject <link rel="alternate"> ────────────────────────────
    inject_alternate_link(out, all_deck_names)

    # ── Generate llms.txt ────────────────────────────────────────
    generate_llms_txt(
        out=out,
        site_url=site_url,
        core_decks=CORE_DECKS,
        local_decks=local_decks,
        generated_deck_names=generated_deck_names,
        all_deck_names=all_deck_names,
        examples_root=examples_root,
        decks_dir=decks_dir,
        generated_dir=generated_dir,
    )

    # ── 404.html ─────────────────────────────────────────────────
    (out / "404.html").write_text(_404_HTML)

    # ── Done ─────────────────────────────────────────────────────
    print()
    print("Done. All decks built to examples/_build/")
    print()
    print("  npx serve examples/_build                    # local preview")
    print("  npx gh-pages -d examples/_build              # deploy to GitHub Pages")
    print("  wrangler pages deploy examples/_build        # deploy to Cloudflare Pages")


if __name__ == "__main__":
    main()

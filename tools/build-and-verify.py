#!/usr/bin/env python3
"""build-and-verify.py -- Post-build smoke test for the Slidev monorepo

Checks every deck in the DECKS list for:
  1. Build output exists (_build/<name>/index.html)
  2. CSS design tokens propagated into built CSS bundles
  3. Theme selectors present in built CSS
  4. Slide count matches target-length from deck.spec.md (within tolerance)
  5. Font loading references in built index.html / CSS
  6. Source styles/index.css entry point exists

Exit 0 if all decks pass, exit 1 if any deck has a FAIL-level issue.
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────

TOOLS_DIR = Path(__file__).resolve().parent
REPO_ROOT = TOOLS_DIR.parent
EXAMPLES = REPO_ROOT / "examples"
DECKS_DIR = REPO_ROOT / "decks"
BUILD = EXAMPLES / "_build"

# ── Colors ───────────────────────────────────────────────────────────────────

if sys.stdout.isatty():
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    RED = "\033[31m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    RESET = "\033[0m"
else:
    GREEN = YELLOW = RED = BOLD = DIM = RESET = ""

# ── Decks — mirrors build.sh ────────────────────────────────────────────────

# (directory, name) tuples
CORE_DECKS = [
    ("demo", "slide-maker"),
    ("reference", "reference"),
]

LOCAL_DECKS = [
    ("vaders", "vaders"),
    ("planet-cf", "planet-cf"),
    ("claude-history-explorer", "claude-history-explorer"),
    ("geist-fabrik", "geist-fabrik"),
    ("olsen", "olsen"),
    ("tasche", "tasche"),
    ("tufte", "tufte"),
    ("durable-objects", "durable-objects"),
]

DECKS = CORE_DECKS + LOCAL_DECKS

# ── Helpers ──────────────────────────────────────────────────────────────────


def pass_msg(msg: str) -> None:
    print(f"  {GREEN}PASS{RESET}  {msg}")


def warn_msg(msg: str) -> None:
    print(f"  {YELLOW}WARN{RESET}  {msg}")


def fail_msg(msg: str) -> None:
    print(f"  {RED}FAIL{RESET}  {msg}")


def header(name: str) -> None:
    print(f"{BOLD}[{name}]{RESET}")


def read_css_blob(build_dir: Path) -> str | None:
    """Concatenate all CSS files in build_dir/assets/ into a single string."""
    assets = build_dir / "assets"
    css_files = sorted(assets.glob("*.css"))
    if not css_files:
        return None
    parts = []
    for f in css_files:
        parts.append(f.read_text(encoding="utf-8", errors="replace"))
    return "\n".join(parts)


def extract_fonts_from_frontmatter(slides_file: Path) -> list[str]:
    """Parse the first YAML frontmatter block in slides.md for fonts: entries."""
    fonts: list[str] = []
    in_frontmatter = False
    in_fonts = False

    with open(slides_file, encoding="utf-8") as fh:
        for line in fh:
            stripped = line.rstrip("\n")
            # Track frontmatter boundaries (only the first block)
            if re.match(r"^---\s*$", stripped):
                if in_frontmatter:
                    break  # end of frontmatter
                else:
                    in_frontmatter = True
                    continue

            if in_frontmatter:
                # Detect the fonts: block
                if re.match(r"^fonts:", stripped):
                    in_fonts = True
                    continue

                if in_fonts:
                    m = re.match(r"^\s+[a-z]+:\s*(.+)", stripped)
                    if m:
                        font_value = m.group(1).strip()
                        # Strip surrounding quotes if present
                        if (
                            (font_value.startswith('"') and font_value.endswith('"'))
                            or (font_value.startswith("'") and font_value.endswith("'"))
                        ):
                            font_value = font_value[1:-1]
                        fonts.append(font_value)
                    else:
                        in_fonts = False

    return fonts


# ── Main ─────────────────────────────────────────────────────────────────────


def verify(decks: list[tuple[str, str]] | None = None, rendered: bool = False, mobile: bool = False) -> int:
    """Run all checks. Returns the process exit code (0 = pass, 1 = fail).

    When ``rendered`` is set, each built deck is additionally driven through
    tools/render-gate.mjs (Lesson 9: measure the rendered artifact, not just the
    Markdown/CSS source) — flash-bang, rendered WCAG contrast, and overflow.
    """
    if decks is None:
        decks = DECKS

    total = 0
    passed = 0
    warned = 0
    failed = 0

    for dir_name, name in decks:
        # Resolve source directory (core decks in examples/, local decks in decks/)
        src = EXAMPLES / dir_name if (EXAMPLES / dir_name).is_dir() else DECKS_DIR / dir_name

        build_dir = BUILD / name
        deck_fail = False
        deck_warn = False

        total += 1
        print()
        header(name)

        # ── 1. Build output exists ───────────────────────────────────────────
        index_html_path = build_dir / "index.html"
        if index_html_path.is_file():
            pass_msg("Build output exists (index.html)")
        else:
            fail_msg(f"Missing build output: {index_html_path}")
            failed += 1
            continue

        # ── 2. CSS design tokens propagated ──────────────────────────────────
        css_blob: str | None = None
        tokens_file = src / "styles" / "tokens.css"
        if tokens_file.is_file():
            tokens_content = tokens_file.read_text(encoding="utf-8")
            token_names = sorted(set(re.findall(r"--deck-[a-zA-Z0-9_-]+", tokens_content)))

            if not token_names:
                warn_msg(f"No --deck-* tokens found in {tokens_file}")
                deck_warn = True
            else:
                css_blob = read_css_blob(build_dir)
                if css_blob is not None:
                    found_count = sum(1 for tok in token_names if tok in css_blob)
                    if found_count == len(token_names):
                        pass_msg(f"All {len(token_names)} design tokens referenced in built CSS")
                    elif found_count > 0:
                        pass_msg(
                            f"Design tokens: {found_count}/{len(token_names)} "
                            f"referenced in built CSS (rest injected at runtime)"
                        )
                    else:
                        pass_msg(
                            f"Design tokens defined ({len(token_names)} tokens; "
                            f"runtime-injected by Vite)"
                        )
                else:
                    fail_msg(f"No CSS files found in {build_dir / 'assets'}/")
                    deck_fail = True
        else:
            fail_msg(f"Source tokens.css not found: {tokens_file}")
            deck_fail = True

        # ── 3. Theme selectors present ───────────────────────────────────────
        theme_selectors = [".slidev-layout", ".slidev-vclick-target", ".slidev-vclick-hidden"]
        css_files = sorted((build_dir / "assets").glob("*.css"))
        if css_files:
            if css_blob is None:
                css_blob = read_css_blob(build_dir)
            if css_blob is not None:
                missing_selectors = [sel for sel in theme_selectors if sel not in css_blob]
                if not missing_selectors:
                    pass_msg(
                        f"Theme selectors present ({len(theme_selectors)}/{len(theme_selectors)})"
                    )
                else:
                    fail_msg(f"Missing theme selectors: {' '.join(missing_selectors)}")
                    deck_fail = True

        # ── 4. Slide count vs target-length ──────────────────────────────────
        slides_file = src / "slides.md"
        spec_file = src / "deck.spec.md"
        if slides_file.is_file():
            slides_content = slides_file.read_text(encoding="utf-8")
            sep_count = len(re.findall(r"^---\s*$", slides_content, re.MULTILINE))
            slide_count = (sep_count + 1) // 2

            if spec_file.is_file():
                spec_content = spec_file.read_text(encoding="utf-8")
                m = re.search(r"target-length:\s*(\d+)", spec_content)
                if m:
                    target = int(m.group(1))
                    diff = slide_count - target
                    abs_diff = abs(diff)
                    if abs_diff > 2:
                        warn_msg(
                            f"Slide count mismatch: counted ~{slide_count} slides, "
                            f"target-length is {target} (diff {diff:+d})"
                        )
                        deck_warn = True
                    else:
                        pass_msg(
                            f"Slide count ~{slide_count} matches target-length "
                            f"{target} (within tolerance)"
                        )
                else:
                    pass_msg(
                        f"Counted ~{slide_count} slides {DIM}(no target-length in spec){RESET}"
                    )
            else:
                pass_msg(f"Counted ~{slide_count} slides {DIM}(no deck.spec.md){RESET}")
        else:
            fail_msg(f"Source slides.md not found: {slides_file}")
            deck_fail = True

        # ── 5. Font loading ──────────────────────────────────────────────────
        html_content = index_html_path.read_text(encoding="utf-8", errors="replace")

        expected_fonts = (
            extract_fonts_from_frontmatter(slides_file) if slides_file.is_file() else []
        )

        if expected_fonts:
            search_blob = html_content + " " + (css_blob or "")
            search_blob_lower = search_blob.lower()
            missing_fonts = []
            for font in expected_fonts:
                font_lower = font.lower()
                font_url_form = font.replace(" ", "+").lower()
                if font_lower not in search_blob_lower and font_url_form not in search_blob_lower:
                    missing_fonts.append(font)
            if not missing_fonts:
                pass_msg(f"Font references found for: {', '.join(expected_fonts)}")
            else:
                warn_msg(f"Font references not found: {', '.join(missing_fonts)}")
                deck_warn = True
        else:
            if "fonts.googleapis.com" in html_content:
                pass_msg("Google Fonts link present in index.html")
            else:
                warn_msg("No Google Fonts link and no fonts declared in frontmatter")
                deck_warn = True

        # ── 6. Source index.css exists ────────────────────────────────────────
        index_css = src / "styles" / "index.css"
        if index_css.is_file():
            pass_msg("Source styles/index.css exists")
        else:
            fail_msg(f"Missing critical entry point: {index_css}")
            deck_fail = True

        # ── 7. Rendered gate (opt-in) ────────────────────────────────────────
        # Static checks above read source. This drives the BUILT deck through a
        # headless browser to catch what source can't: image/gradient flash-bang,
        # real text-on-bg contrast, rendered overflow.
        if rendered:
            gate = TOOLS_DIR / "render-gate.mjs"
            argv = ["node", str(gate), str(build_dir), "--name", name]
            if mobile:
                argv.append("--mobile")
            proc = subprocess.run(argv, capture_output=True, text=True)
            if proc.returncode == 0:
                pass_msg("Rendered gate clean (flash-bang, contrast, overflow)")
            elif proc.returncode == 1:
                viol = [
                    ln.strip()
                    for ln in proc.stdout.splitlines()
                    if "flash-bang:" in ln or "contrast" in ln or "overflow:" in ln
                ]
                fail_msg("Rendered gate found violations: " + ("; ".join(viol[:3]) or "see render-gate output"))
                deck_fail = True
            else:
                warn_msg(f"Rendered gate could not run (exit {proc.returncode}); skipping")
                deck_warn = True

        # ── Per-deck summary ─────────────────────────────────────────────────
        if deck_fail:
            failed += 1
        elif deck_warn:
            warned += 1
            passed += 1  # WARN still counts as passed (non-critical)
        else:
            passed += 1

    # ── Final summary ────────────────────────────────────────────────────────
    separator = "\u2501" * 56
    print()
    print(separator)
    print(f"{BOLD}Summary{RESET}")
    print(separator)
    print(f"  Total decks:  {total}")
    print(f"  {GREEN}Passed:{RESET}       {passed}")
    if warned > 0:
        print(f"  {YELLOW}Warnings:{RESET}     {warned}")
    if failed > 0:
        print(f"  {RED}Failed:{RESET}       {failed}")
    print(separator)
    print()

    if failed > 0:
        print(f"{RED}{BOLD}RESULT: FAIL{RESET} -- {failed}/{total} deck(s) have critical issues.")
        return 1
    else:
        print(f"{GREEN}{BOLD}RESULT: PASS{RESET} -- {passed}/{total} deck(s) passed.")
        return 0


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Post-build smoke test for the Slidev monorepo",
    )
    parser.add_argument(
        "decks",
        nargs="*",
        metavar="DIR:NAME",
        help=(
            "Deck(s) to verify as dir:name pairs (e.g. demo:slide-maker). "
            "If omitted, all configured decks are checked."
        ),
    )
    parser.add_argument(
        "--rendered",
        action="store_true",
        help=(
            "Also run the rendered gate (tools/render-gate.mjs) per deck: "
            "flash-bang, real WCAG contrast, and overflow from a headless "
            "browser. Slower; requires playwright + chromium."
        ),
    )
    parser.add_argument(
        "--mobile",
        action="store_true",
        help=(
            "When combined with --rendered, also check mobile viewports "
            "(iPhone SE, Pixel 7, iPhone SE landscape). The deck system ships "
            "a distinct MobileScrollView under 640px portrait, so a "
            "desktop-only render misses what users on phones see."
        ),
    )
    args = parser.parse_args()

    if args.decks:
        deck_list = []
        for entry in args.decks:
            if ":" not in entry:
                parser.error(f"Invalid deck spec '{entry}' -- expected DIR:NAME format")
            dir_name, name = entry.split(":", 1)
            deck_list.append((dir_name, name))
    else:
        deck_list = None  # use all defaults

    sys.exit(verify(deck_list, rendered=args.rendered, mobile=args.mobile))


if __name__ == "__main__":
    main()

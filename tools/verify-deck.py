#!/usr/bin/env python3
"""Verify a deck is readable: check contrast, build, screenshot, and open.

Combines WCAG contrast checking with visual verification in one command.

Usage:
  python tools/verify-deck.py examples/demo                    # full check
  python tools/verify-deck.py examples/demo --contrast-only    # tokens only
  python tools/verify-deck.py examples/demo --visual-only      # build + screenshot only
  python tools/verify-deck.py examples/demo 3 7 9              # specific slides
  python tools/verify-deck.py examples/demo --width 375 --height 667  # mobile
"""

import argparse
import os
import re
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import time


# ── WCAG Contrast Checking ──────────────────────────────────────────────────

def hex_to_rgb(hex_color):
    """Parse a hex color string to (r, g, b) tuple with values 0-255."""
    color = hex_color.strip().lstrip("#")
    if len(color) == 3:
        color = color[0] * 2 + color[1] * 2 + color[2] * 2
    if len(color) != 6:
        raise ValueError(f"Invalid hex color: {hex_color}")
    return (int(color[0:2], 16), int(color[2:4], 16), int(color[4:6], 16))


def srgb_to_linear(value):
    """Convert sRGB channel (0-255) to linear light (0.0-1.0) per WCAG 2.1."""
    s = value / 255.0
    return s / 12.92 if s <= 0.04045 else ((s + 0.055) / 1.055) ** 2.4


def relative_luminance(r, g, b):
    """Relative luminance per WCAG 2.1."""
    return 0.2126 * srgb_to_linear(r) + 0.7152 * srgb_to_linear(g) + 0.0722 * srgb_to_linear(b)


def contrast_ratio(color1, color2):
    """WCAG 2.1 contrast ratio between two (r,g,b) colors. Returns >= 1.0."""
    l1 = relative_luminance(*color1)
    l2 = relative_luminance(*color2)
    if l1 < l2:
        l1, l2 = l2, l1
    return (l1 + 0.05) / (l2 + 0.05)


def read_tokens(tokens_path):
    """Parse tokens.css and return dict of token-name -> value."""
    tokens = {}
    with open(tokens_path, "r") as f:
        text = f.read()
    for match in re.finditer(r"--(deck-[a-zA-Z0-9_-]+)\s*:\s*([^;]+);", text):
        tokens[match.group(1)] = match.group(2).strip()
    return tokens


def check_contrast(tokens_path):
    """Check all foreground tokens against background. Returns (pass_count, fail_count, results)."""
    tokens = read_tokens(tokens_path)
    if "deck-bg" not in tokens:
        print(f"  ERROR: --deck-bg not found in {tokens_path}")
        return 0, 1, []

    bg = tokens["deck-bg"]
    bg_rgb = hex_to_rgb(bg)
    results = []
    pass_count = 0
    fail_count = 0

    fg_tokens = ["deck-fg", "deck-accent", "deck-muted", "deck-accent-alt"]
    for tok in fg_tokens:
        if tok not in tokens:
            continue
        try:
            fg_rgb = hex_to_rgb(tokens[tok])
        except ValueError:
            continue

        ratio = contrast_ratio(fg_rgb, bg_rgb)
        aa_normal = ratio >= 4.5
        aa_large = ratio >= 3.0

        status = "PASS" if aa_normal else ("WARN" if aa_large else "FAIL")
        if aa_normal:
            pass_count += 1
        else:
            fail_count += 1

        results.append({
            "token": tok,
            "fg": tokens[tok],
            "bg": bg,
            "ratio": ratio,
            "status": status,
        })

    return pass_count, fail_count, results


def print_contrast_results(tokens_path, pass_count, fail_count, results):
    """Print contrast check results."""
    print(f"\n  Contrast check: {tokens_path}")
    print(f"  Background (--deck-bg): {results[0]['bg'] if results else '?'}")
    print()

    for r in results:
        icon = "\033[32mPASS\033[0m" if r["status"] == "PASS" else (
            "\033[33mWARN\033[0m" if r["status"] == "WARN" else "\033[31mFAIL\033[0m"
        )
        print(f"  {icon}  --{r['token']:20s}  {r['fg']:8s}  {r['ratio']:.2f}:1")

    print()
    if fail_count == 0:
        print(f"  \033[32mAll {pass_count} pairs pass WCAG AA for normal text.\033[0m")
    else:
        print(f"  \033[31m{fail_count} pair(s) FAIL WCAG AA for normal text.\033[0m")


# ── Visual Verification ─────────────────────────────────────────────────────

def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def count_slides(slides_md):
    with open(slides_md, "r") as f:
        text = f.read()
    separators = sum(1 for line in text.splitlines() if line.strip() == "---")
    return max(1, (separators + 1) // 2)


def wait_for_server(port, timeout=30):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=1):
                return True
        except (ConnectionRefusedError, OSError):
            time.sleep(0.3)
    return False


def build_playwright_script(port, slide_nums, output_dir, width, height, deck_name):
    slides_json = repr(slide_nums)
    return f'''\
import sys
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Error: playwright not installed. Run: pip install playwright && playwright install chromium", file=sys.stderr)
    sys.exit(1)

import os

def main():
    slide_nums = {slides_json}
    output_dir = {repr(output_dir)}
    deck_name = {repr(deck_name)}
    base_url = "http://127.0.0.1:{port}"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={{"width": {width}, "height": {height}}})

        for n in slide_nums:
            url = f"{{base_url}}/{{n}}"
            page.goto(url, wait_until="networkidle")
            page.wait_for_timeout(800)

            path = os.path.join(output_dir, f"{{deck_name}}-slide-{{n}}.png")
            page.screenshot(path=path, full_page=False)
            print(f"    slide {{n}} -> {{path}}")

        browser.close()

if __name__ == "__main__":
    main()
'''


def visual_verify(deck_dir, slide_nums, output_dir, width, height, no_open):
    """Build deck, screenshot slides, optionally open them."""
    deck_name = os.path.basename(deck_dir)
    slides_md = os.path.join(deck_dir, "slides.md")

    if not slide_nums:
        total = count_slides(slides_md)
        slide_nums = list(range(1, total + 1))

    print(f"\n  Building {deck_dir}...")
    build_dir = tempfile.mkdtemp(prefix="verify-deck-")
    try:
        result = subprocess.run(
            ["npx", "slidev", "build", "--out", build_dir],
            cwd=deck_dir,
            check=False,
            capture_output=True,
        )
        if result.returncode != 0:
            print(f"  ERROR: build failed")
            if result.stderr:
                print(result.stderr.decode()[-500:])
            return False

        port = find_free_port()
        print(f"  Serving on port {port}...")
        server_proc = subprocess.Popen(
            ["npx", "serve", build_dir, "-l", str(port), "--no-clipboard"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            preexec_fn=os.setsid,
        )

        try:
            if not wait_for_server(port):
                print("  ERROR: server did not start")
                return False

            os.makedirs(output_dir, exist_ok=True)

            script = build_playwright_script(
                port=port,
                slide_nums=slide_nums,
                output_dir=output_dir,
                width=width,
                height=height,
                deck_name=deck_name,
            )

            script_file = os.path.join(build_dir, "_screenshot.py")
            with open(script_file, "w") as f:
                f.write(script)

            print(f"  Screenshotting {len(slide_nums)} slide(s) at {width}x{height}...")
            result = subprocess.run(
                [sys.executable, script_file],
                check=False,
            )
            if result.returncode != 0:
                print("  ERROR: screenshot failed (is playwright installed?)")
                return False

            paths = []
            for n in slide_nums:
                p = os.path.join(output_dir, f"{deck_name}-slide-{n}.png")
                if os.path.isfile(p):
                    paths.append(p)

            print(f"\n  {len(paths)} screenshots saved to {output_dir}")

            if not no_open and paths:
                if sys.platform == "darwin":
                    subprocess.run(["open"] + paths, check=False)
                elif sys.platform == "linux":
                    for p in paths:
                        subprocess.Popen(["xdg-open", p], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            return True

        finally:
            try:
                os.killpg(os.getpgid(server_proc.pid), signal.SIGTERM)
            except ProcessLookupError:
                pass
            server_proc.wait(timeout=5)

    finally:
        shutil.rmtree(build_dir, ignore_errors=True)


# ── Main ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Verify a deck is readable: contrast + visual checks.",
        epilog="Examples:\n"
               "  python tools/verify-deck.py examples/demo\n"
               "  python tools/verify-deck.py examples/demo --contrast-only\n"
               "  python tools/verify-deck.py examples/demo 3 7 --width 375 --height 667\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("deck_dir", help="Path to the deck directory")
    parser.add_argument("slides", nargs="*", type=int, help="Slide numbers (default: all)")
    parser.add_argument("--contrast-only", action="store_true", help="Only check token contrast")
    parser.add_argument("--visual-only", action="store_true", help="Only build and screenshot")
    parser.add_argument("--output", "-o", default="/tmp/verify-deck", help="Screenshot output dir")
    parser.add_argument("--width", type=int, default=1280, help="Viewport width (default: 1280)")
    parser.add_argument("--height", type=int, default=720, help="Viewport height (default: 720)")
    parser.add_argument("--no-open", action="store_true", help="Don't open screenshots")
    args = parser.parse_args()

    deck_dir = os.path.abspath(args.deck_dir)
    if not os.path.isdir(deck_dir):
        print(f"Error: {deck_dir} not found")
        sys.exit(1)

    tokens_path = os.path.join(deck_dir, "styles", "tokens.css")
    slides_md = os.path.join(deck_dir, "slides.md")
    all_pass = True

    print(f"\n  verify-deck: {deck_dir}")
    print(f"  {'=' * 50}")

    # Step 1: Contrast check
    if not args.visual_only:
        if os.path.isfile(tokens_path):
            pass_count, fail_count, results = check_contrast(tokens_path)
            print_contrast_results(tokens_path, pass_count, fail_count, results)
            if fail_count > 0:
                all_pass = False
        else:
            print(f"\n  SKIP: no tokens.css found at {tokens_path}")

    # Step 2: Visual verification
    if not args.contrast_only:
        if os.path.isfile(slides_md):
            success = visual_verify(
                deck_dir=deck_dir,
                slide_nums=args.slides,
                output_dir=args.output,
                width=args.width,
                height=args.height,
                no_open=args.no_open,
            )
            if not success:
                all_pass = False
        else:
            print(f"\n  SKIP: no slides.md found at {slides_md}")

    # Summary
    print(f"\n  {'=' * 50}")
    if all_pass:
        print("  \033[32mDeck verified.\033[0m\n")
    else:
        print("  \033[31mIssues found.\033[0m\n")
        sys.exit(1)


if __name__ == "__main__":
    main()

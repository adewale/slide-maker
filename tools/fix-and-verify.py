#!/usr/bin/env python3
"""Rebuild a deck, screenshot specified slides via Playwright, and open them.

Usage:
  python tools/fix-and-verify.py examples/reference 19 23
  python tools/fix-and-verify.py examples/demo          # all slides
"""

import argparse
import os
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import time


def find_free_port():
    """Find a random available TCP port."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def count_slides(slides_md):
    """Count slides in a Slidev markdown file by counting --- separators."""
    with open(slides_md, "r") as f:
        text = f.read()
    separators = sum(1 for line in text.splitlines() if line.strip() == "---")
    return max(1, (separators + 1) // 2)


def wait_for_server(port, timeout=30):
    """Wait until the server responds on the given port."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=1):
                return True
        except (ConnectionRefusedError, OSError):
            time.sleep(0.3)
    return False


def main():
    parser = argparse.ArgumentParser(
        description="Rebuild a Slidev deck, screenshot slides, and open them.",
        epilog="Examples:\n"
               "  python tools/fix-and-verify.py examples/reference 19 23\n"
               "  python tools/fix-and-verify.py examples/demo\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "deck_dir",
        help="Path to the deck directory (e.g. examples/demo)",
    )
    parser.add_argument(
        "slides",
        nargs="*",
        type=int,
        help="Slide numbers to screenshot (default: all)",
    )
    parser.add_argument(
        "--output", "-o",
        default="/tmp/fix-verify",
        help="Directory to save screenshots (default: /tmp/fix-verify)",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=1280,
        help="Viewport width (default: 1280)",
    )
    parser.add_argument(
        "--height",
        type=int,
        default=720,
        help="Viewport height (default: 720)",
    )
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="Don't open the screenshots after capturing",
    )
    args = parser.parse_args()

    deck_dir = os.path.abspath(args.deck_dir)
    if not os.path.isdir(deck_dir):
        print(f"Error: deck directory not found: {deck_dir}", file=sys.stderr)
        sys.exit(1)

    slides_md = os.path.join(deck_dir, "slides.md")
    if not os.path.isfile(slides_md):
        print(f"Error: no slides.md in {deck_dir}", file=sys.stderr)
        sys.exit(1)

    # Determine which slides to screenshot
    total_slides = count_slides(slides_md)
    if args.slides:
        slide_nums = args.slides
        for n in slide_nums:
            if n < 1 or n > total_slides:
                print(f"Warning: slide {n} may be out of range (detected ~{total_slides} slides)")
    else:
        slide_nums = list(range(1, total_slides + 1))

    # Repo root (for npx)
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Step 1: Build the deck
    print(f"Building deck: {deck_dir}")
    build_dir = tempfile.mkdtemp(prefix="fix-verify-build-")
    try:
        result = subprocess.run(
            ["npx", "slidev", "build", "--out", build_dir],
            cwd=deck_dir,
            check=False,
        )
        if result.returncode != 0:
            print("Error: slidev build failed", file=sys.stderr)
            sys.exit(1)

        # Step 2: Start a temporary server
        port = find_free_port()
        print(f"Starting server on port {port}...")
        server_proc = subprocess.Popen(
            ["npx", "serve", build_dir, "-l", str(port), "--no-clipboard"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            preexec_fn=os.setsid,
        )

        try:
            if not wait_for_server(port):
                print("Error: server did not start within 30 seconds", file=sys.stderr)
                sys.exit(1)

            # Step 3: Screenshot slides using Playwright
            os.makedirs(args.output, exist_ok=True)

            # Build a small Playwright script to run
            screenshot_script = _build_playwright_script(
                port=port,
                slide_nums=slide_nums,
                output_dir=args.output,
                width=args.width,
                height=args.height,
                deck_name=os.path.basename(deck_dir),
            )

            script_file = os.path.join(build_dir, "_screenshot.py")
            with open(script_file, "w") as f:
                f.write(screenshot_script)

            print(f"Screenshotting {len(slide_nums)} slide(s)...")
            result = subprocess.run(
                [sys.executable, script_file],
                check=False,
            )
            if result.returncode != 0:
                print("Error: screenshot script failed", file=sys.stderr)
                print("Make sure Playwright is installed: pip install playwright && playwright install chromium")
                sys.exit(1)

            # Step 4: Print paths and optionally open
            print()
            print("Screenshots saved:")
            paths = []
            for n in slide_nums:
                p = os.path.join(args.output, f"{os.path.basename(deck_dir)}-slide-{n}.png")
                if os.path.isfile(p):
                    print(f"  {p}")
                    paths.append(p)

            if not args.no_open and paths:
                print()
                print("Opening screenshots...")
                if sys.platform == "darwin":
                    subprocess.run(["open"] + paths, check=False)
                elif sys.platform == "linux":
                    for p in paths:
                        subprocess.Popen(["xdg-open", p], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                else:
                    subprocess.run(["start"] + paths, check=False, shell=True)

        finally:
            # Kill the server process group
            print("Stopping server...")
            try:
                os.killpg(os.getpgid(server_proc.pid), signal.SIGTERM)
            except ProcessLookupError:
                pass
            server_proc.wait(timeout=5)

    finally:
        # Clean up temp build dir
        shutil.rmtree(build_dir, ignore_errors=True)


def _build_playwright_script(port, slide_nums, output_dir, width, height, deck_name):
    """Generate a self-contained Python script that uses Playwright to screenshot slides."""
    slides_json = repr(slide_nums)
    return f'''\
import sys
try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Error: playwright is not installed.", file=sys.stderr)
    print("Install it with: pip install playwright && playwright install chromium", file=sys.stderr)
    sys.exit(1)

import os
import time

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
            # Wait a bit for animations to settle
            page.wait_for_timeout(500)

            path = os.path.join(output_dir, f"{{deck_name}}-slide-{{n}}.png")
            page.screenshot(path=path, full_page=False)
            print(f"  Captured slide {{n}} -> {{path}}")

        browser.close()

if __name__ == "__main__":
    main()
'''


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Compute WCAG 2.1 contrast ratio between two colors.

Uses proper sRGB linearization per the WCAG 2.1 specification.

Single pair mode:
  python tools/contrast-check.py '#9a6b03' '#ffffff'

Token mode (reads tokens.css, checks --deck-fg and --deck-accent against --deck-bg):
  python tools/contrast-check.py --tokens examples/demo/styles/tokens.css
"""

import argparse
import os
import re
import sys


def hex_to_rgb(hex_color):
    """Parse a hex color string to (r, g, b) tuple with values 0-255.

    Accepts: #rgb, #rrggbb, rgb, rrggbb
    """
    color = hex_color.strip().lstrip("#")

    if len(color) == 3:
        color = color[0] * 2 + color[1] * 2 + color[2] * 2

    if len(color) != 6:
        raise ValueError(f"Invalid hex color: {hex_color}")

    try:
        r = int(color[0:2], 16)
        g = int(color[2:4], 16)
        b = int(color[4:6], 16)
    except ValueError:
        raise ValueError(f"Invalid hex color: {hex_color}")

    return (r, g, b)


def srgb_to_linear(value):
    """Convert an sRGB channel value (0-255) to linear light (0.0-1.0).

    Per WCAG 2.1 / IEC 61966-2-1:
      If sRGB <= 0.04045: linear = sRGB / 12.92
      Else: linear = ((sRGB + 0.055) / 1.055) ^ 2.4
    """
    s = value / 255.0
    if s <= 0.04045:
        return s / 12.92
    else:
        return ((s + 0.055) / 1.055) ** 2.4


def relative_luminance(r, g, b):
    """Compute relative luminance per WCAG 2.1.

    L = 0.2126 * R + 0.7152 * G + 0.0722 * B
    where R, G, B are linearized sRGB values.
    """
    r_lin = srgb_to_linear(r)
    g_lin = srgb_to_linear(g)
    b_lin = srgb_to_linear(b)
    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin


def contrast_ratio(color1, color2):
    """Compute the WCAG 2.1 contrast ratio between two (r,g,b) colors.

    Returns a float >= 1.0. The ratio is (L1 + 0.05) / (L2 + 0.05)
    where L1 is the lighter luminance.
    """
    l1 = relative_luminance(*color1)
    l2 = relative_luminance(*color2)

    if l1 < l2:
        l1, l2 = l2, l1

    return (l1 + 0.05) / (l2 + 0.05)


def format_ratio(ratio):
    """Format a contrast ratio for display."""
    return f"{ratio:.2f}:1"


def check_pair(name, fg_hex, bg_hex):
    """Check contrast between two colors and print results."""
    try:
        fg_rgb = hex_to_rgb(fg_hex)
        bg_rgb = hex_to_rgb(bg_hex)
    except ValueError as e:
        print(f"  Error: {e}", file=sys.stderr)
        return False

    ratio = contrast_ratio(fg_rgb, bg_rgb)

    aa_normal = ratio >= 4.5   # WCAG AA for normal text
    aa_large = ratio >= 3.0    # WCAG AA for large text (18pt+ or 14pt+ bold)
    aaa_normal = ratio >= 7.0  # WCAG AAA for normal text
    aaa_large = ratio >= 4.5   # WCAG AAA for large text

    print(f"  {name}")
    print(f"    Foreground: {fg_hex}")
    print(f"    Background: {bg_hex}")
    print(f"    Ratio:      {format_ratio(ratio)}")
    print()
    print(f"    AA  normal text (4.5:1): {'PASS' if aa_normal else 'FAIL'}")
    print(f"    AA  large text  (3.0:1): {'PASS' if aa_large else 'FAIL'}")
    print(f"    AAA normal text (7.0:1): {'PASS' if aaa_normal else 'FAIL'}")
    print(f"    AAA large text  (4.5:1): {'PASS' if aaa_large else 'FAIL'}")
    print()

    return aa_normal


def read_tokens(tokens_path):
    """Parse tokens.css and return a dict of token-name -> value."""
    tokens = {}
    with open(tokens_path, "r") as f:
        text = f.read()

    pattern = re.compile(r"--(deck-[a-zA-Z0-9_-]+)\s*:\s*([^;]+);")
    for match in pattern.finditer(text):
        name = match.group(1)
        value = match.group(2).strip()
        tokens[name] = value

    return tokens


def main():
    parser = argparse.ArgumentParser(
        description="Compute WCAG 2.1 contrast ratio between two colors.",
        epilog="Examples:\n"
               "  python tools/contrast-check.py '#9a6b03' '#ffffff'\n"
               "  python tools/contrast-check.py --tokens examples/demo/styles/tokens.css\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "colors",
        nargs="*",
        help="Two hex colors to compare (e.g. '#9a6b03' '#ffffff')",
    )
    parser.add_argument(
        "--tokens",
        metavar="PATH",
        help="Path to a tokens.css file; checks --deck-fg and --deck-accent against --deck-bg",
    )

    args = parser.parse_args()

    if args.tokens and args.colors:
        print("Error: provide either two colors or --tokens, not both.", file=sys.stderr)
        sys.exit(1)

    if not args.tokens and len(args.colors) != 2:
        parser.print_help()
        sys.exit(1)

    if args.tokens:
        # Token mode
        tokens_path = os.path.abspath(args.tokens)
        if not os.path.isfile(tokens_path):
            print(f"Error: file not found: {tokens_path}", file=sys.stderr)
            sys.exit(1)

        tokens = read_tokens(tokens_path)

        if "deck-bg" not in tokens:
            print("Error: --deck-bg not found in tokens.css", file=sys.stderr)
            sys.exit(1)

        bg = tokens["deck-bg"]
        all_pass = True

        print(f"Tokens: {tokens_path}")
        print(f"Background (--deck-bg): {bg}")
        print()

        # Check each foreground token against background
        fg_tokens = ["deck-fg", "deck-accent", "deck-muted", "deck-accent-alt"]
        checked = 0
        for tok in fg_tokens:
            if tok in tokens:
                passed = check_pair(f"--{tok} on --deck-bg", tokens[tok], bg)
                if not passed:
                    all_pass = False
                checked += 1

        if checked == 0:
            print("No foreground tokens found to check.", file=sys.stderr)
            sys.exit(1)

        # Summary
        if all_pass:
            print("Result: All pairs pass WCAG AA for normal text.")
        else:
            print("Result: One or more pairs FAIL WCAG AA for normal text.")
            sys.exit(1)

    else:
        # Single pair mode
        fg_hex = args.colors[0]
        bg_hex = args.colors[1]

        passed = check_pair("Custom pair", fg_hex, bg_hex)
        if not passed:
            sys.exit(1)


if __name__ == "__main__":
    main()

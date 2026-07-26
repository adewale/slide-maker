#!/usr/bin/env python3
"""Change a CSS token value across an entire deck.

Reads the current value from styles/tokens.css and replaces it in:
  - tokens.css (the definition)
  - slides.md (v-mark colors, Mermaid inline styles, etc.)
  - deck.spec.md (color references)

Usage:
  python tools/update-token.py examples/demo --deck-accent '#b44215'
  python tools/update-token.py examples/olsen --deck-accent '#9a6b03' --dry-run
"""

import argparse
import os
import re
import sys

# All recognized --deck-* tokens
KNOWN_TOKENS = [
    "deck-bg",
    "deck-fg",
    "deck-accent",
    "deck-muted",
    "deck-accent-alt",
    "deck-rule",
    "deck-code-bg",
]


def read_tokens(tokens_path):
    """Parse tokens.css and return a dict of token-name -> current-value."""
    tokens = {}
    if not os.path.isfile(tokens_path):
        return tokens

    with open(tokens_path, "r") as f:
        text = f.read()

    # Match lines like: --deck-accent: #b44215;
    pattern = re.compile(r"--(deck-[a-zA-Z0-9_-]+)\s*:\s*([^;]+);")
    for match in pattern.finditer(text):
        name = match.group(1)
        value = match.group(2).strip()
        tokens[name] = value

    return tokens


def replace_in_file(filepath, old_value, new_value, dry_run=False):
    """Replace all occurrences of old_value with new_value in a file.

    Returns the number of replacements made.
    """
    if not os.path.isfile(filepath):
        return 0

    with open(filepath, "r") as f:
        original = f.read()

    count = original.count(old_value)
    if count == 0:
        return 0

    new_text = original.replace(old_value, new_value)

    if not dry_run:
        with open(filepath, "w") as f:
            f.write(new_text)

    return count


def main():
    parser = argparse.ArgumentParser(
        description="Change a CSS token value across an entire deck.",
        epilog="Examples:\n"
               "  python tools/update-token.py examples/demo --deck-accent '#b44215'\n"
               "  python tools/update-token.py examples/olsen --deck-accent '#9a6b03' --dry-run\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "deck_dir",
        help="Path to the deck directory (e.g. examples/demo)",
    )

    # Add an argument for each known token
    for token in KNOWN_TOKENS:
        parser.add_argument(
            f"--{token}",
            metavar="VALUE",
            help=f"New value for --{token}",
        )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would change without writing files",
    )

    args = parser.parse_args()

    deck_dir = os.path.abspath(args.deck_dir)
    if not os.path.isdir(deck_dir):
        print(f"Error: deck directory not found: {deck_dir}", file=sys.stderr)
        sys.exit(1)

    tokens_path = os.path.join(deck_dir, "styles", "tokens.css")
    slides_path = os.path.join(deck_dir, "slides.md")
    spec_path = os.path.join(deck_dir, "deck.spec.md")

    # Read current token values
    current_tokens = read_tokens(tokens_path)
    if not current_tokens:
        print(f"Error: no tokens found in {tokens_path}", file=sys.stderr)
        print("Make sure the deck has a styles/tokens.css file.")
        sys.exit(1)

    # Determine which tokens to update
    updates = {}
    for token in KNOWN_TOKENS:
        attr_name = token.replace("-", "_")
        new_value = getattr(args, attr_name, None)
        if new_value is not None:
            if token not in current_tokens:
                print(f"Warning: --{token} not found in tokens.css, skipping", file=sys.stderr)
                continue
            old_value = current_tokens[token]
            if old_value == new_value:
                print(f"  --{token} is already {new_value}, skipping")
                continue
            updates[token] = (old_value, new_value)

    if not updates:
        print("No token changes specified. Use --help for usage.")
        sys.exit(0)

    # Files to update
    target_files = [tokens_path, slides_path, spec_path]

    # Also check for page files (src: imports)
    pages_dir = os.path.join(deck_dir, "pages")
    if os.path.isdir(pages_dir):
        for f in sorted(os.listdir(pages_dir)):
            if f.endswith(".md"):
                target_files.append(os.path.join(pages_dir, f))

    print(f"Deck: {deck_dir}")
    if args.dry_run:
        print("[dry-run mode]")
    print()

    total_replacements = 0

    for token, (old_value, new_value) in updates.items():
        print(f"--{token}: {old_value} -> {new_value}")

        for filepath in target_files:
            count = replace_in_file(filepath, old_value, new_value, dry_run=args.dry_run)
            if count > 0:
                rel = os.path.relpath(filepath, deck_dir)
                action = "would replace" if args.dry_run else "replaced"
                print(f"  {rel}: {action} {count} occurrence(s)")
                total_replacements += count

    print()
    action = "Would make" if args.dry_run else "Made"
    print(f"{action} {total_replacements} total replacement(s).")

    if args.dry_run and total_replacements > 0:
        print("(Re-run without --dry-run to apply changes)")


if __name__ == "__main__":
    main()

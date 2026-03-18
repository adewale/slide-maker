#!/usr/bin/env python3
"""Find-and-replace across slide markdown files, aware of Slidev structure.

Modes:
  --in-comments   Only replace inside <!-- ... --> blocks (not in fenced code within comments)
  --in-body       Only replace outside comments
  --everywhere    Replace everywhere
  --dry-run       Show what would change without writing

Usage:
  python tools/bulk-replace.py --in-comments '-->' '\u2192' decks/*/slides.md
  python tools/bulk-replace.py --in-body 'sumi-e' 'editorial-dark' **/*.md
  python tools/bulk-replace.py --everywhere '#ca8a04' '#9a6b03' decks/olsen/
"""

import argparse
import glob
import os
import re
import sys


def find_md_files(paths):
    """Expand paths: if a path is a directory, find *.md files in it recursively."""
    result = []
    for p in paths:
        if os.path.isdir(p):
            for root, _dirs, files in os.walk(p):
                for f in sorted(files):
                    if f.endswith(".md"):
                        result.append(os.path.join(root, f))
        elif os.path.isfile(p):
            result.append(p)
        else:
            # Try as a glob pattern
            expanded = sorted(glob.glob(p, recursive=True))
            if not expanded:
                print(f"Warning: no files matched: {p}", file=sys.stderr)
            result.extend(expanded)
    return result


def parse_regions(text):
    """Parse text into regions: body, comment, and fenced-code-within-comment.

    Returns a list of (kind, start, end) tuples where kind is one of:
      'body'    - normal markdown content
      'comment' - inside <!-- ... --> but NOT inside fenced code blocks
      'code'    - inside fenced code blocks within comments
    """
    regions = []
    pos = 0
    length = len(text)

    while pos < length:
        # Look for the next comment opening
        comment_start = text.find("<!--", pos)
        if comment_start == -1:
            # Rest is body
            if pos < length:
                regions.append(("body", pos, length))
            break

        # Everything before the comment is body
        if comment_start > pos:
            regions.append(("body", pos, comment_start))

        # Find the matching -->
        comment_end = text.find("-->", comment_start + 4)
        if comment_end == -1:
            # Unclosed comment — treat rest as comment
            _parse_comment_interior(text, comment_start, length, regions)
            pos = length
        else:
            end = comment_end + 3  # include the -->
            _parse_comment_interior(text, comment_start, end, regions)
            pos = end

    return regions


def _parse_comment_interior(text, start, end, regions):
    """Parse the interior of a comment block, identifying fenced code blocks.

    Fenced code blocks (``` ... ```) inside comments should not be modified
    when using --in-comments mode.
    """
    interior = text[start:end]
    pos = 0
    fence_pattern = re.compile(r"^(`{3,}|~{3,})", re.MULTILINE)

    while pos < len(interior):
        match = fence_pattern.search(interior, pos)
        if not match:
            # Rest is comment text
            if pos < len(interior):
                regions.append(("comment", start + pos, end))
            break

        fence_start = match.start()
        fence_marker = match.group(1)
        fence_char = fence_marker[0]
        fence_len = len(fence_marker)

        # Everything before the fence is comment
        if fence_start > pos:
            regions.append(("comment", start + pos, start + fence_start))

        # Find the closing fence
        close_pattern = re.compile(
            r"^" + re.escape(fence_char) + r"{" + str(fence_len) + r",}\s*$",
            re.MULTILINE,
        )
        close_match = close_pattern.search(interior, match.end())
        if close_match:
            code_end = close_match.end()
            regions.append(("code", start + fence_start, start + code_end))
            pos = code_end
        else:
            # Unclosed fence — treat rest as code
            regions.append(("code", start + fence_start, end))
            pos = len(interior)

    return regions


def apply_replacement(text, old, new, mode):
    """Apply find-and-replace respecting the given mode.

    Returns (new_text, count_of_replacements).
    """
    if mode == "everywhere":
        count = text.count(old)
        return text.replace(old, new), count

    regions = parse_regions(text)
    parts = []
    total_replacements = 0

    for kind, start, end in regions:
        chunk = text[start:end]
        if mode == "in-comments" and kind == "comment":
            count = chunk.count(old)
            total_replacements += count
            parts.append(chunk.replace(old, new))
        elif mode == "in-body" and kind == "body":
            count = chunk.count(old)
            total_replacements += count
            parts.append(chunk.replace(old, new))
        else:
            parts.append(chunk)

    return "".join(parts), total_replacements


def main():
    parser = argparse.ArgumentParser(
        description="Find-and-replace across slide markdown files, aware of Slidev structure.",
        epilog="Examples:\n"
               "  python tools/bulk-replace.py --in-comments '-->' '\u2192' decks/*/slides.md\n"
               "  python tools/bulk-replace.py --in-body 'sumi-e' 'editorial-dark' **/*.md\n"
               "  python tools/bulk-replace.py --everywhere '#ca8a04' '#9a6b03' decks/olsen/\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )

    mode_group = parser.add_mutually_exclusive_group(required=True)
    mode_group.add_argument(
        "--in-comments",
        action="store_const",
        const="in-comments",
        dest="mode",
        help="Only replace inside <!-- ... --> blocks (not in fenced code within comments)",
    )
    mode_group.add_argument(
        "--in-body",
        action="store_const",
        const="in-body",
        dest="mode",
        help="Only replace outside <!-- ... --> comment blocks",
    )
    mode_group.add_argument(
        "--everywhere",
        action="store_const",
        const="everywhere",
        dest="mode",
        help="Replace everywhere in the file",
    )

    parser.add_argument(
        "old",
        help="The string to find",
    )
    parser.add_argument(
        "new",
        help="The replacement string",
    )
    parser.add_argument(
        "files",
        nargs="+",
        help="Markdown files or directories to process",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would change without writing files",
    )

    args = parser.parse_args()

    files = find_md_files(args.files)
    if not files:
        print("No files to process.", file=sys.stderr)
        sys.exit(1)

    total_files_changed = 0
    total_replacements = 0

    for filepath in files:
        with open(filepath, "r") as f:
            original = f.read()

        new_text, count = apply_replacement(original, args.old, args.new, args.mode)

        if count > 0:
            total_files_changed += 1
            total_replacements += count

            if args.dry_run:
                print(f"  [dry-run] {filepath}: {count} replacement(s)")
                # Show context around each replacement
                for i, line in enumerate(original.splitlines(), 1):
                    if args.old in line:
                        print(f"    L{i}: {line.strip()}")
            else:
                with open(filepath, "w") as f:
                    f.write(new_text)
                print(f"  {filepath}: {count} replacement(s)")

    print()
    action = "Would change" if args.dry_run else "Changed"
    print(f"{action} {total_replacements} occurrence(s) in {total_files_changed} file(s).")

    if args.dry_run and total_files_changed > 0:
        print("(Re-run without --dry-run to apply changes)")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Copy a component from slide-maker/components/ into a deck and mount it.

Copies the .vue file and adds an import + mount into the specified layer
(global-top or global-bottom).

Usage:
  python tools/wire-component.py ProgressSegmentBar examples/demo global-top
  python tools/wire-component.py DataTable examples/reference global-bottom
"""

import argparse
import os
import re
import shutil
import sys


def main():
    parser = argparse.ArgumentParser(
        description="Copy a component from slide-maker/components/ into a deck and mount it.",
        epilog="Examples:\n"
               "  python tools/wire-component.py ProgressSegmentBar examples/demo global-top\n"
               "  python tools/wire-component.py DataTable examples/reference global-bottom\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "component",
        help="Component name (e.g. ProgressSegmentBar)",
    )
    parser.add_argument(
        "deck_dir",
        help="Path to the deck directory (e.g. examples/demo)",
    )
    parser.add_argument(
        "layer",
        choices=["global-top", "global-bottom"],
        help="Layer to mount into: global-top or global-bottom",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would change without writing files",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing component file if it exists",
    )

    args = parser.parse_args()

    # Resolve paths
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    source_dir = os.path.join(repo_root, "slide-maker", "components")
    deck_dir = os.path.abspath(args.deck_dir)
    component_name = args.component
    layer_filename = f"{args.layer}.vue"

    # Validate source component exists
    source_file = os.path.join(source_dir, f"{component_name}.vue")
    if not os.path.isfile(source_file):
        print(f"Error: component not found: {source_file}", file=sys.stderr)
        print("\nAvailable components:", file=sys.stderr)
        if os.path.isdir(source_dir):
            for f in sorted(os.listdir(source_dir)):
                if f.endswith(".vue"):
                    print(f"  {f[:-4]}", file=sys.stderr)
        sys.exit(1)

    # Validate deck directory
    if not os.path.isdir(deck_dir):
        print(f"Error: deck directory not found: {deck_dir}", file=sys.stderr)
        sys.exit(1)

    # Destination paths
    dest_components_dir = os.path.join(deck_dir, "components")
    dest_component_file = os.path.join(dest_components_dir, f"{component_name}.vue")
    layer_file = os.path.join(deck_dir, layer_filename)

    print(f"Component: {component_name}")
    print(f"Deck:      {deck_dir}")
    print(f"Layer:     {args.layer}")
    if args.dry_run:
        print("[dry-run mode]")
    print()

    # Step 1: Copy the component file
    if os.path.isfile(dest_component_file) and not args.force:
        print(f"  Component already exists: {os.path.relpath(dest_component_file, deck_dir)}")
        print("  (Use --force to overwrite)")
    else:
        if args.dry_run:
            print(f"  [dry-run] Would copy: {os.path.relpath(source_file, repo_root)}")
            print(f"         -> {os.path.relpath(dest_component_file, deck_dir)}")
        else:
            os.makedirs(dest_components_dir, exist_ok=True)
            shutil.copy2(source_file, dest_component_file)
            print(f"  Copied: {os.path.relpath(dest_component_file, deck_dir)}")

    # Step 2: Update the layer file
    import_line = f"import {component_name} from './components/{component_name}.vue'"
    tag = f"<{component_name} />"

    if not os.path.isfile(layer_file):
        # Create a minimal layer file
        new_content = _create_layer_file(component_name, import_line, tag)
        if args.dry_run:
            print(f"  [dry-run] Would create: {layer_filename}")
            print(f"    with import: {import_line}")
            print(f"    with tag:    {tag}")
        else:
            with open(layer_file, "w") as f:
                f.write(new_content)
            print(f"  Created: {layer_filename}")
    else:
        # Update existing layer file
        with open(layer_file, "r") as f:
            content = f.read()

        changes = []

        # Check if already imported
        if component_name in content and f"/{component_name}.vue" in content:
            print(f"  Import already present in {layer_filename}")
        else:
            content, added = _add_import(content, import_line)
            if added:
                changes.append(f"Added import: {import_line}")

        # Check if already mounted
        if tag in content or f"<{component_name}>" in content:
            print(f"  Tag already present in {layer_filename}")
        else:
            content, added = _add_tag(content, tag)
            if added:
                changes.append(f"Added tag: {tag}")

        if changes:
            if args.dry_run:
                for c in changes:
                    print(f"  [dry-run] {c}")
            else:
                with open(layer_file, "w") as f:
                    f.write(content)
                for c in changes:
                    print(f"  {c}")
        else:
            print(f"  {layer_filename} already wired (no changes needed)")

    print()
    if args.dry_run:
        print("Re-run without --dry-run to apply changes.")
    else:
        print("Done.")


def _create_layer_file(component_name, import_line, tag):
    """Create a new global-top.vue or global-bottom.vue with the component."""
    return f"""\
<script setup>
{import_line}
</script>

<template>
  {tag}
</template>
"""


def _add_import(content, import_line):
    """Add an import line to the <script setup> block. Returns (new_content, was_added)."""
    # Look for existing <script setup> block
    script_match = re.search(r"(<script\s+setup[^>]*>)", content)
    if script_match:
        # Insert after the opening <script setup> tag
        insert_pos = script_match.end()
        # Find what's on the next line to match indentation
        after = content[insert_pos:]
        # Detect if there's a newline right after the tag
        if after.startswith("\n"):
            content = content[:insert_pos] + "\n" + import_line + content[insert_pos:]
        else:
            content = content[:insert_pos] + "\n" + import_line + "\n" + content[insert_pos:]
        return content, True
    else:
        # No <script setup> block — prepend one
        script_block = f"<script setup>\n{import_line}\n</script>\n\n"
        content = script_block + content
        return content, True


def _add_tag(content, tag):
    """Add a component tag inside the <template> block. Returns (new_content, was_added)."""
    # Find </template> and insert before it
    template_end = content.rfind("</template>")
    if template_end != -1:
        # Detect indentation of existing content in template
        indent = "  "
        content = content[:template_end] + f"\n{indent}{tag}\n" + content[template_end:]
        return content, True

    # No </template> found — this shouldn't happen in a valid .vue file
    # Try to find <template> and add both open/close
    template_start = content.find("<template>")
    if template_start != -1:
        end_of_line = content.find("\n", template_start)
        if end_of_line == -1:
            end_of_line = len(content)
        content = content[:end_of_line] + f"\n  {tag}\n</template>" + content[end_of_line:]
        return content, True

    # No template block at all — append one
    content += f"\n<template>\n  {tag}\n</template>\n"
    return content, True


if __name__ == "__main__":
    main()

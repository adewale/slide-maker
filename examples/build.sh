#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/.." && pwd)"
SKILL_DIR="$REPO_ROOT/skills/slide-maker"
DECKS_DIR="${DECKS_DIR:-}"  # optional external decks directory
OUT="$ROOT/_build"

# Install deps if needed
if [ ! -d "$REPO_ROOT/node_modules" ]; then
  echo "Installing dependencies..."
  npm install --prefix "$REPO_ROOT"
fi

# ── Sync shared files from the skill into each deck ──────────────────────
# The skill is the canonical source. Decks get copies so they work standalone.
sync_skill_files() {
  local deck_dir="$1"

  # Components: copy any that exist in the skill and are used by the deck
  if [ -d "$deck_dir/components" ]; then
    for comp in "$deck_dir/components/"*.vue; do
      [ -f "$comp" ] || continue
      base=$(basename "$comp")
      if [ -f "$SKILL_DIR/components/$base" ]; then
        cp "$SKILL_DIR/components/$base" "$comp"
      fi
    done
  fi

  # Composables, setup, styles: copy if deck has the directory
  for subdir in composables setup styles; do
    if [ -d "$deck_dir/$subdir" ]; then
      for file in "$deck_dir/$subdir/"*; do
        [ -f "$file" ] || continue
        base=$(basename "$file")
        if [ -f "$SKILL_DIR/$subdir/$base" ]; then
          cp "$SKILL_DIR/$subdir/$base" "$file"
        fi
      done
    fi
  done
}

# Clean previous build
rm -rf "$OUT"
mkdir -p "$OUT"

# Core decks (in examples/) — dir:name
declare -a CORE_DECKS=(
  "demo:slide-maker"
  "reference:reference"
)

# Generated decks (from generated-decks/) — showcases of the skill
GENERATED_DIR="$REPO_ROOT/generated-decks"
declare -a GENERATED_DECKS=()
if [ -d "$GENERATED_DIR" ]; then
  for deck_dir in "$GENERATED_DIR"/*/; do
    [ -f "$deck_dir/slides.md" ] || continue
    name=$(basename "$deck_dir")
    GENERATED_DECKS+=("$name")
  done
fi

# External decks (optional — set DECKS_DIR to include personal decks)
declare -a LOCAL_DECKS=()

# Build core decks from examples/
for entry in "${CORE_DECKS[@]}"; do
  dir="${entry%%:*}"
  name="${entry##*:}"
  echo ""
  echo "Syncing skill files into $dir..."
  sync_skill_files "$ROOT/$dir"
  echo "Building $name (core)..."
  cd "$ROOT/$dir"
  npx slidev build --base "${BASE_PREFIX:-}/$name/" --out "$OUT/$name"
  cp "$ROOT/$dir/slides.md" "$OUT/$name/slides.md"
  if [ -d "$ROOT/$dir/pages" ]; then
    cp -r "$ROOT/$dir/pages" "$OUT/$name/pages"
  fi
done

# Build external decks (if DECKS_DIR is set)
if [ -n "$DECKS_DIR" ] && [ -d "$DECKS_DIR" ]; then
  for entry in ${LOCAL_DECKS[@]+"${LOCAL_DECKS[@]}"}; do
    dir="${entry%%:*}"
    name="${entry##*:}"
    echo ""
    echo "Building $name..."
    cd "$DECKS_DIR/$dir"
    npx slidev build --base "${BASE_PREFIX:-}/$name/" --out "$OUT/$name"
    cp "$DECKS_DIR/$dir/slides.md" "$OUT/$name/slides.md"
    if [ -d "$DECKS_DIR/$dir/pages" ]; then
      cp -r "$DECKS_DIR/$dir/pages" "$OUT/$name/pages"
    fi
  done
fi

# Build generated decks (showcases of the skill applied to real projects)
for name in ${GENERATED_DECKS[@]+"${GENERATED_DECKS[@]}"}; do
  echo ""
  echo "Building $name (generated)..."
  cd "$GENERATED_DIR/$name"
  npx slidev build --base "${BASE_PREFIX:-}/$name/" --out "$OUT/$name"
  cp "$GENERATED_DIR/$name/slides.md" "$OUT/$name/slides.md"
  if [ -d "$GENERATED_DIR/$name/pages" ]; then
    cp -r "$GENERATED_DIR/$name/pages" "$OUT/$name/pages"
  fi
done

# ── Split slides.md into per-slide Markdown files ─────────────
# Produces slides/1.md, slides/2.md, ... for each deck.
# Resolves src: imports so each file is self-contained.
split_slides() {
  local deck_build_dir="$1"
  local source_dir="$2"
  local slides_file="$deck_build_dir/slides.md"

  if [ ! -f "$slides_file" ]; then
    return
  fi

  # Split into per-slide files, resolving src: imports inline
  python3 - "$slides_file" "$deck_build_dir/slides" "$source_dir" <<'PYEOF'
import sys, os, re

slides_file = sys.argv[1]
out_dir = sys.argv[2]
source_dir = sys.argv[3]

os.makedirs(out_dir, exist_ok=True)

def read_file(path):
    with open(path, 'r') as f:
        return f.read()

def parse_slides(text):
    """Parse Slidev markdown into individual slides.

    Slidev format: the file starts with --- (opening frontmatter).
    Each --- on its own line is a slide separator. A separator may be
    followed by YAML frontmatter (key: value lines) before the next ---.
    The pattern is: slide content, then ---, then optional frontmatter,
    then --- again (which closes frontmatter and starts content).
    """
    lines = text.split('\n')
    slides = []
    current = []
    i = 0

    # Skip leading blank lines
    while i < len(lines) and lines[i].strip() == '':
        i += 1

    # First line should be ---
    if i < len(lines) and re.match(r'^---\s*$', lines[i]):
        current.append(lines[i])
        i += 1
    else:
        # No frontmatter, treat everything up to first --- as slide 1
        pass

    # Read until we hit the next --- (end of global frontmatter)
    while i < len(lines):
        if re.match(r'^---\s*$', lines[i]):
            current.append(lines[i])
            i += 1
            break
        current.append(lines[i])
        i += 1

    # Now read slide 1 content until the next ---
    while i < len(lines):
        if re.match(r'^---\s*$', lines[i]):
            # This --- is a slide separator — start a new slide
            slides.append('\n'.join(current))
            current = []
            # Collect the new slide: starts with --- then optional frontmatter
            current.append(lines[i])
            i += 1
            # Check for per-slide frontmatter (key: value lines until ---)
            has_fm = False
            peek = i
            while peek < len(lines):
                if re.match(r'^---\s*$', lines[peek]):
                    has_fm = True
                    break
                if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_-]*\s*:', lines[peek]) and lines[peek].strip() != '':
                    break
                peek += 1
            if has_fm:
                # Read frontmatter lines + closing ---
                while i < len(lines):
                    current.append(lines[i])
                    if re.match(r'^---\s*$', lines[i]) and len(current) > 1:
                        i += 1
                        break
                    i += 1
            continue
        current.append(lines[i])
        i += 1

    if current:
        slides.append('\n'.join(current))

    return slides

def resolve_src_slides(slides_list, base_dir):
    """Expand any src: import slides into their contents."""
    result = []
    for slide in slides_list:
        lines = slide.strip().split('\n')
        src_path = None
        for line in lines:
            m = re.match(r'^src:\s*(.+)$', line.strip())
            if m:
                src_path = m.group(1).strip()
                break
        if src_path:
            full_path = os.path.normpath(os.path.join(base_dir, src_path))
            if os.path.exists(full_path):
                imported = read_file(full_path)
                imported_slides = parse_slides(imported)
                result.extend(imported_slides)
            else:
                result.append(slide)
        else:
            result.append(slide)
    return result

raw = read_file(slides_file)
slides = parse_slides(raw)
slides = resolve_src_slides(slides, source_dir)

for idx, slide in enumerate(slides, 1):
    content = slide.strip()
    with open(os.path.join(out_dir, f'{idx}.md'), 'w') as f:
        f.write(content + '\n')

with open(os.path.join(out_dir, 'count'), 'w') as f:
    f.write(str(len(slides)) + '\n')
PYEOF

  local count
  count=$(cat "$deck_build_dir/slides/count" 2>/dev/null || echo "?")
  echo "  → Split into $count slides"
}

# Split slides for all built decks
for entry in "${CORE_DECKS[@]}"; do
  dir="${entry%%:*}"
  name="${entry##*:}"
  split_slides "$OUT/$name" "$ROOT/$dir"
done

for entry in ${LOCAL_DECKS[@]+"${LOCAL_DECKS[@]}"}; do
  dir="${entry%%:*}"
  name="${entry##*:}"
  split_slides "$OUT/$name" "$DECKS_DIR/$dir"
done

for name in ${GENERATED_DECKS[@]+"${GENERATED_DECKS[@]}"}; do
  split_slides "$OUT/$name" "$GENERATED_DIR/$name"
done

# Combined list for routing config — need all deck names for serve.json and _redirects
ALL_DECK_NAMES=()
for entry in "${CORE_DECKS[@]}"; do ALL_DECK_NAMES+=("${entry##*:}"); done
for entry in ${LOCAL_DECKS[@]+"${LOCAL_DECKS[@]}"}; do ALL_DECK_NAMES+=("${entry##*:}"); done
for name in ${GENERATED_DECKS[@]+"${GENERATED_DECKS[@]}"}; do ALL_DECK_NAMES+=("$name"); done

# Keep ALL_DECKS for llms.txt which needs dir:name pairs
ALL_DECKS=("${CORE_DECKS[@]}" ${LOCAL_DECKS[@]+${LOCAL_DECKS[@]+"${LOCAL_DECKS[@]}"}})

# Copy menu page, viewer, and prevent Jekyll processing
cp "$ROOT/index.html" "$OUT/index.html"
cp "$ROOT/view.html" "$OUT/view.html"
touch "$OUT/.nojekyll"

# Generate serve.json for SPA routing (npx serve)
{
  echo '{'
  echo '  "rewrites": ['
  first=true
  for name in "${ALL_DECK_NAMES[@]}"; do
    if [ "$first" = true ]; then
      first=false
    else
      echo ','
    fi
    printf '    { "source": "/%s/**", "destination": "/%s/index.html" }' "$name" "$name"
  done
  echo ''
  echo '  ]'
  echo '}'
} > "$OUT/serve.json"

# Remove _redirects files — Slidev generates per-deck _redirects that
# conflict with Cloudflare Workers' not_found_handling: "single-page-application".
# GitHub Pages uses 404.html instead. Only npx serve uses serve.json.
find "$OUT" -name '_redirects' -delete

# ── Inject <link rel="alternate"> into each deck's index.html ──
for name in "${ALL_DECK_NAMES[@]}"; do
  deck_index="$OUT/$name/index.html"
  if [ -f "$deck_index" ]; then
    # Insert the link tag before </head>
    sed -i.bak 's|</head>|<link rel="alternate" type="text/markdown" href="slides.md" title="Slide Markdown"></head>|' "$deck_index" && rm -f "$deck_index.bak"
  fi
done

# ── Generate llms.txt ─────────────────────────────────────────
# Conforms to https://llmstxt.org/ specification
SITE_URL="${SITE_URL:-}"

{
  echo "# Slide Maker"
  echo ""
  echo "> A collection of Slidev presentation decks built with the Slide Maker skill for Claude Code. Each deck is available as an interactive presentation and as raw Markdown. Individual slides are available at slides/N.md where N is the slide number."
  echo ""
  echo "## Decks"
  echo ""
  for entry in "${CORE_DECKS[@]}"; do
    name="${entry##*:}"
    dir="${entry%%:*}"
    # Read title from frontmatter
    title=$(grep -m1 '^title:' "$ROOT/$dir/slides.md" 2>/dev/null | sed 's/^title:[[:space:]]*//' || echo "$name")
    count=$(cat "$OUT/$name/slides/count" 2>/dev/null || echo "?")
    echo "- [${title}](${SITE_URL}/${name}/slides.md): ${count} slides (core project deck)"
  done
  for entry in ${LOCAL_DECKS[@]+"${LOCAL_DECKS[@]}"}; do
    name="${entry##*:}"
    dir="${entry%%:*}"
    title=$(grep -m1 '^title:' "$DECKS_DIR/$dir/slides.md" 2>/dev/null | sed 's/^title:[[:space:]]*//' || echo "$name")
    count=$(cat "$OUT/$name/slides/count" 2>/dev/null || echo "?")
    echo "- [${title}](${SITE_URL}/${name}/slides.md): ${count} slides"
  done
  for name in ${GENERATED_DECKS[@]+"${GENERATED_DECKS[@]}"}; do
    title=$(grep -m1 '^title:' "$GENERATED_DIR/$name/slides.md" 2>/dev/null | sed 's/^title:[[:space:]]*//' || echo "$name")
    count=$(cat "$OUT/$name/slides/count" 2>/dev/null || echo "?")
    echo "- [${title}](${SITE_URL}/${name}/slides.md): ${count} slides (generated from GitHub project)"
  done
  echo ""
  echo "## Optional"
  echo ""
  echo "Per-slide Markdown is available for each deck. Replace slides.md with slides/N.md to fetch slide N, or slides/count for the total number of slides."
  echo ""
  for name in "${ALL_DECK_NAMES[@]}"; do
    count=$(cat "$OUT/$name/slides/count" 2>/dev/null || echo "?")
    for n in $(seq 1 "$count" 2>/dev/null); do
      echo "- [${name} slide ${n}](${SITE_URL}/${name}/slides/${n}.md)"
    done
  done
} > "$OUT/llms.txt"

# ── Root 404.html for GitHub Pages SPA routing ───────────────
# GitHub Pages serves this for any route that doesn't match a file.
# It redirects to the index which handles deck routing.
cat > "$OUT/404.html" << 'HTML404'
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Redirecting...</title></head>
<body>
<script>
// GitHub Pages SPA redirect: preserve the path for client-side routing
var path = window.location.pathname;
if (path !== '/' && path !== '/index.html') {
  // Keep the path — let the deck's own index.html handle hash routing
  window.location.replace(path);
} else {
  window.location.replace('/');
}
</script>
</body>
</html>
HTML404

echo ""
echo "Done. All decks built to examples/_build/"
echo ""
echo "  npx serve examples/_build                    # local preview"
echo "  npx gh-pages -d examples/_build              # deploy to GitHub Pages"
echo "  wrangler pages deploy examples/_build        # deploy to Cloudflare Pages"

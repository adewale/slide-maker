#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/.." && pwd)"
OUT="$ROOT/_build"

# Install deps if needed
if [ ! -d "$REPO_ROOT/node_modules" ]; then
  echo "Installing dependencies..."
  npm install --prefix "$REPO_ROOT"
fi

# Clean previous build
rm -rf "$OUT"
mkdir -p "$OUT"

# Decks: directory name → build subdirectory
declare -a DECKS=(
  "demo:slide-maker"
  "vaders:vaders"
  "planet-cf:planet-cf"
  "claude-history-explorer:claude-history-explorer"
  "geist-fabrik:geist-fabrik"
  "olsen:olsen"
  "tasche:tasche"

  "tufte:tufte"
  "durable-objects:durable-objects"
  "extensions:extensions"
)

for entry in "${DECKS[@]}"; do
  dir="${entry%%:*}"
  name="${entry##*:}"

  echo ""
  echo "Building $name..."

  cd "$ROOT/$dir"

  # BASE_PREFIX allows serving under a subpath (e.g. /slide-maker for GitHub Pages)
  npx slidev build --base "${BASE_PREFIX:-}/$name/" --out "$OUT/$name"
done

# Copy menu page and prevent Jekyll processing
cp "$ROOT/index.html" "$OUT/index.html"
touch "$OUT/.nojekyll"

# Generate serve.json for SPA routing (presenter mode, slide navigation)
{
  echo '{'
  echo '  "rewrites": ['
  first=true
  for entry in "${DECKS[@]}"; do
    name="${entry##*:}"
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

echo ""
echo "Done. All decks built to examples/_build/"
echo ""
echo "  open examples/_build/index.html   # file:// (links won't work)"
echo "  npx serve examples/_build         # http://localhost:3000"

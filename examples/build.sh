#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/.." && pwd)"
DECKS_DIR="$REPO_ROOT/decks"
OUT="$ROOT/_build"

# Install deps if needed
if [ ! -d "$REPO_ROOT/node_modules" ]; then
  echo "Installing dependencies..."
  npm install --prefix "$REPO_ROOT"
fi

# Clean previous build
rm -rf "$OUT"
mkdir -p "$OUT"

# Core decks (in examples/) — part of the project
declare -a CORE_DECKS=(
  "demo:slide-maker"
  "reference:reference"
)

# Personal decks (in decks/) — local examples
declare -a LOCAL_DECKS=(
  "vaders:vaders"
  "planet-cf:planet-cf"
  "claude-history-explorer:claude-history-explorer"
  "geist-fabrik:geist-fabrik"
  "olsen:olsen"
  "tasche:tasche"
  "tufte:tufte"
  "durable-objects:durable-objects"
)

# Build core decks from examples/
for entry in "${CORE_DECKS[@]}"; do
  dir="${entry%%:*}"
  name="${entry##*:}"
  echo ""
  echo "Building $name (core)..."
  cd "$ROOT/$dir"
  npx slidev build --base "${BASE_PREFIX:-}/$name/" --out "$OUT/$name"
done

# Build local decks from decks/
for entry in "${LOCAL_DECKS[@]}"; do
  dir="${entry%%:*}"
  name="${entry##*:}"
  echo ""
  echo "Building $name..."
  cd "$DECKS_DIR/$dir"
  npx slidev build --base "${BASE_PREFIX:-}/$name/" --out "$OUT/$name"
done

# Combined list for routing config
ALL_DECKS=("${CORE_DECKS[@]}" "${LOCAL_DECKS[@]}")

# Copy menu page and prevent Jekyll processing
cp "$ROOT/index.html" "$OUT/index.html"
touch "$OUT/.nojekyll"

# Generate serve.json for SPA routing (npx serve)
{
  echo '{'
  echo '  "rewrites": ['
  first=true
  for entry in "${ALL_DECKS[@]}"; do
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

# Generate _redirects for Cloudflare Pages / Workers Static Assets
# Slidev uses HTML5 history routing — each deck needs SPA fallback
{
  for entry in "${ALL_DECKS[@]}"; do
    name="${entry##*:}"
    printf '/%s/*    /%s/index.html   200\n' "$name" "$name"
  done
} > "$OUT/_redirects"

echo ""
echo "Done. All decks built to examples/_build/"
echo ""
echo "  open examples/_build/index.html   # file:// (links won't work)"
echo "  npx serve examples/_build         # http://localhost:3000"
echo "  wrangler pages deploy examples/_build  # Cloudflare Pages"

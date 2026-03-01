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
  "keyboardia:keyboardia"
  "garten:garten"
  "claude-history-explorer:claude-history-explorer"
  "geist-fabrik:geist-fabrik"
  "olsen:olsen"
  "tasche:tasche"
  "component-showcase:component-showcase"
  "sumi-e:sumi-e"
  "tufte:tufte"
  "material:material"
  "cloudflare:cloudflare"
)

for entry in "${DECKS[@]}"; do
  dir="${entry%%:*}"
  name="${entry##*:}"

  echo ""
  echo "Building $name..."

  cd "$ROOT/$dir"

  npx slidev build --base "/$name/" --out "$OUT/$name"
done

# Copy menu page
cp "$ROOT/index.html" "$OUT/index.html"

echo ""
echo "Done. All decks built to examples/_build/"
echo ""
echo "  open examples/_build/index.html   # file:// (links won't work)"
echo "  npx serve examples/_build         # http://localhost:3000"

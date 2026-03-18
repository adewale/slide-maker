#!/usr/bin/env bash
set -euo pipefail

# deploy-gh-pages.sh — Build and deploy to GitHub Pages
#
# Usage:
#   bash examples/deploy-gh-pages.sh                    # auto-detect repo name
#   bash examples/deploy-gh-pages.sh /custom-base       # explicit base path
#
# Prerequisites:
#   - npm install (Slidev and dependencies)
#   - git remote set (origin must point to your GitHub repo)
#   - GitHub Pages enabled: Settings → Pages → gh-pages branch

ROOT="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$ROOT/.." && pwd)"

# Determine base path from repo name or argument
if [ -n "${1:-}" ]; then
  BASE="$1"
else
  # Auto-detect from git remote
  REMOTE_URL=$(git -C "$REPO_ROOT" config --get remote.origin.url 2>/dev/null || echo "")
  if [ -z "$REMOTE_URL" ]; then
    echo "Error: no git remote set and no base path provided."
    echo "Usage: $0 /repo-name"
    exit 1
  fi
  # Extract repo name from URL (handles both SSH and HTTPS)
  REPO_NAME=$(echo "$REMOTE_URL" | sed 's/.*\///' | sed 's/\.git$//')
  BASE="/$REPO_NAME"
fi

echo "Building with base path: $BASE"
echo ""

# Build all decks with the GitHub Pages base prefix
BASE_PREFIX="$BASE" bash "$ROOT/build.sh"

# Deploy to gh-pages branch
echo ""
echo "Deploying to gh-pages branch..."

cd "$ROOT/_build"

# Check if gh-pages npm package is available
if npx --no-install gh-pages --version >/dev/null 2>&1; then
  npx gh-pages -d . --dotfiles
else
  # Manual deployment
  git init
  git checkout -b gh-pages
  git add -A
  git commit -m "Deploy to GitHub Pages"

  # Get the remote URL from the parent repo
  REMOTE=$(git -C "$REPO_ROOT" config --get remote.origin.url)
  git remote add origin "$REMOTE"
  git push -f origin gh-pages

  # Clean up the temp git repo
  rm -rf .git
fi

echo ""
echo "Deployed to GitHub Pages."
echo "Site will be available at: https://<user>.github.io${BASE}/"
echo ""
echo "If this is your first deploy, enable GitHub Pages:"
echo "  Settings → Pages → Source → Deploy from branch → gh-pages / root"

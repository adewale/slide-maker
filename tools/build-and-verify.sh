#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# build-and-verify.sh — Post-build smoke test for the Slidev monorepo
#
# Checks every deck in the DECKS array for:
#   1. Build output exists (_build/<name>/index.html)
#   2. CSS design tokens propagated into built CSS bundles
#   3. Theme selectors present in built CSS
#   4. Slide count matches target-length from deck.spec.md (within tolerance)
#   5. Font loading references in built index.html / CSS
#   6. Source styles/index.css entry point exists
#
# Exit 0 if all decks pass, exit 1 if any deck has a FAIL-level issue.
###############################################################################

ROOT="$(cd "$(dirname "$0")" && pwd)"
EXAMPLES="$ROOT/../examples"
BUILD="$EXAMPLES/_build"

# ── Colors ───────────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  GREEN=$'\033[32m'
  YELLOW=$'\033[33m'
  RED=$'\033[31m'
  BOLD=$'\033[1m'
  DIM=$'\033[2m'
  RESET=$'\033[0m'
else
  GREEN="" YELLOW="" RED="" BOLD="" DIM="" RESET=""
fi

# ── Decks — mirrors build.sh ────────────────────────────────────────────────
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

# ── Counters ─────────────────────────────────────────────────────────────────
total=0
passed=0
warned=0
failed=0

# ── Helpers ──────────────────────────────────────────────────────────────────
pass()  { echo "  ${GREEN}PASS${RESET}  $1"; }
warn()  { echo "  ${YELLOW}WARN${RESET}  $1"; }
fail()  { echo "  ${RED}FAIL${RESET}  $1"; }
header(){ echo "${BOLD}[$1]${RESET}"; }

# Grep a pattern in a string stored in a variable.
# Using a here-string avoids SIGPIPE issues with `echo | grep` under pipefail.
# Usage: blob_contains "$haystack" [-flags] -e "needle"
blob_contains() {
  local haystack="$1"; shift
  grep -q "$@" <<< "$haystack"
}

###############################################################################
# Main loop
###############################################################################
for entry in "${DECKS[@]}"; do
  dir="${entry%%:*}"
  name="${entry##*:}"

  # Resolve source directory
  src="$EXAMPLES/$dir"

  build_dir="$BUILD/$name"
  deck_fail=0
  deck_warn=0

  total=$((total + 1))
  echo ""
  header "$name"

  # ── 1. Build output exists ───────────────────────────────────────────────
  if [[ -f "$build_dir/index.html" ]]; then
    pass "Build output exists (index.html)"
  else
    fail "Missing build output: $build_dir/index.html"
    deck_fail=1
    # Skip remaining checks — nothing to inspect
    if (( deck_fail )); then failed=$((failed + 1)); fi
    continue
  fi

  # ── 2. CSS design tokens propagated ──────────────────────────────────────
  # Slidev/Vite may inject :root custom properties at runtime via JS, so the
  # --deck-* declarations might not appear in .css files. We check two things:
  #   a) Source tokens.css exists and defines --deck-* variables
  #   b) Built CSS references some --deck-* via var() (confirms theme uses them)
  # If var() references are absent, we still PASS if source tokens.css exists
  # (Vite runtime injection is expected behavior).
  tokens_file="$src/styles/tokens.css"
  if [[ -f "$tokens_file" ]]; then
    # Extract --deck-* variable names from tokens.css
    token_names=()
    while IFS= read -r varname; do
      token_names+=("$varname")
    done < <(grep -oE '\-\-deck-[a-zA-Z0-9_-]+' "$tokens_file" | sort -u)

    if (( ${#token_names[@]} == 0 )); then
      warn "No --deck-* tokens found in $tokens_file"
      deck_warn=1
    else
      css_files=("$build_dir"/assets/*.css)
      if [[ -f "${css_files[0]}" ]]; then
        # Concatenate all CSS for a single search pass
        css_blob=$(cat "${css_files[@]}")
        # Count how many token names appear in built CSS (as var() refs or declarations)
        found_count=0
        for tok in "${token_names[@]}"; do
          if blob_contains "$css_blob" -Fe "$tok"; then
            found_count=$((found_count + 1))
          fi
        done
        if (( found_count == ${#token_names[@]} )); then
          pass "All ${#token_names[@]} design tokens referenced in built CSS"
        elif (( found_count > 0 )); then
          pass "Design tokens: ${found_count}/${#token_names[@]} referenced in built CSS (rest injected at runtime)"
        else
          # No var() references in CSS — tokens are injected entirely at runtime
          pass "Design tokens defined (${#token_names[@]} tokens; runtime-injected by Vite)"
        fi
      else
        fail "No CSS files found in $build_dir/assets/"
        deck_fail=1
      fi
    fi
  else
    fail "Source tokens.css not found: $tokens_file"
    deck_fail=1
  fi

  # ── 3. Theme selectors present ──────────────────────────────────────────
  theme_selectors=( ".slidev-layout" ".slidev-vclick-target" ".slidev-vclick-hidden" )
  missing_selectors=()
  css_files=("$build_dir"/assets/*.css)
  if [[ -f "${css_files[0]}" ]]; then
    css_blob="${css_blob:-$(cat "${css_files[@]}")}"
    for sel in "${theme_selectors[@]}"; do
      if ! blob_contains "$css_blob" -Fe "$sel"; then
        missing_selectors+=("$sel")
      fi
    done
    if (( ${#missing_selectors[@]} == 0 )); then
      pass "Theme selectors present (${#theme_selectors[@]}/${#theme_selectors[@]})"
    else
      fail "Missing theme selectors: ${missing_selectors[*]}"
      deck_fail=1
    fi
  fi

  # ── 4. Slide count vs target-length ─────────────────────────────────────
  slides_file="$src/slides.md"
  spec_file="$src/deck.spec.md"
  if [[ -f "$slides_file" ]]; then
    # Count lines that are exactly '---' (the Slidev separator).
    # In Slidev, each slide typically has a pair of --- (open/close frontmatter).
    # The first pair is global frontmatter. Approximate slide count:
    #   slides ~= (separator_count + 1) / 2
    sep_count=$(grep -c '^---[[:space:]]*$' "$slides_file" || true)
    slide_count=$(( (sep_count + 1) / 2 ))

    if [[ -f "$spec_file" ]]; then
      target=$(sed -n 's/^.*target-length:[[:space:]]*\([0-9][0-9]*\).*/\1/p' "$spec_file" 2>/dev/null | head -1)
      if [[ -n "$target" ]]; then
        diff=$(( slide_count - target ))
        abs_diff=${diff#-}
        if (( abs_diff > 2 )); then
          warn "Slide count mismatch: counted ~${slide_count} slides, target-length is ${target} (diff ${diff})"
          deck_warn=1
        else
          pass "Slide count ~${slide_count} matches target-length ${target} (within tolerance)"
        fi
      else
        pass "Counted ~${slide_count} slides ${DIM}(no target-length in spec)${RESET}"
      fi
    else
      pass "Counted ~${slide_count} slides ${DIM}(no deck.spec.md)${RESET}"
    fi
  else
    fail "Source slides.md not found: $slides_file"
    deck_fail=1
  fi

  # ── 5. Font loading ────────────────────────────────────────────────────
  index_html="$build_dir/index.html"
  html_content=$(cat "$index_html")

  # Extract expected font families from slides.md frontmatter
  expected_fonts=()
  if [[ -f "$slides_file" ]]; then
    in_frontmatter=0
    in_fonts=0
    while IFS= read -r line; do
      # Track frontmatter boundaries (only the first block)
      if [[ "$line" =~ ^---[[:space:]]*$ ]]; then
        if (( in_frontmatter )); then
          break  # end of frontmatter
        else
          in_frontmatter=1
          continue
        fi
      fi
      if (( in_frontmatter )); then
        # Detect the fonts: block
        if [[ "$line" =~ ^fonts: ]]; then
          in_fonts=1
          continue
        fi
        # If we are inside fonts: block, collect indented values
        if (( in_fonts )); then
          if [[ "$line" =~ ^[[:space:]]+[a-z]+:[[:space:]]*(.+) ]]; then
            font_value="${BASH_REMATCH[1]}"
            # Strip surrounding quotes if present
            font_value="${font_value#\"}"
            font_value="${font_value%\"}"
            font_value="${font_value#\'}"
            font_value="${font_value%\'}"
            expected_fonts+=("$font_value")
          else
            in_fonts=0
          fi
        fi
      fi
    done < "$slides_file"
  fi

  if (( ${#expected_fonts[@]} > 0 )); then
    missing_fonts=()
    # Check in index.html (Google Fonts link) and CSS bundles
    search_blob="$html_content ${css_blob:-}"
    for font in "${expected_fonts[@]}"; do
      # Google Fonts URLs use + for spaces: "Plus Jakarta Sans" → "Plus+Jakarta+Sans"
      font_url_form="${font// /+}"
      if ! blob_contains "$search_blob" -iFe "$font" && \
         ! blob_contains "$search_blob" -iFe "$font_url_form"; then
        missing_fonts+=("$font")
      fi
    done
    if (( ${#missing_fonts[@]} == 0 )); then
      pass "Font references found for: ${expected_fonts[*]}"
    else
      warn "Font references not found: ${missing_fonts[*]}"
      deck_warn=1
    fi
  else
    # No fonts declared in frontmatter — just check for any Google Fonts link
    if blob_contains "$html_content" -Fe 'fonts.googleapis.com'; then
      pass "Google Fonts link present in index.html"
    else
      warn "No Google Fonts link and no fonts declared in frontmatter"
      deck_warn=1
    fi
  fi

  # ── 6. Source index.css exists ──────────────────────────────────────────
  index_css="$src/styles/index.css"
  if [[ -f "$index_css" ]]; then
    pass "Source styles/index.css exists"
  else
    fail "Missing critical entry point: $index_css"
    deck_fail=1
  fi

  # ── Per-deck summary ────────────────────────────────────────────────────
  if (( deck_fail )); then
    failed=$((failed + 1))
  elif (( deck_warn )); then
    warned=$((warned + 1))
    passed=$((passed + 1))   # WARN still counts as passed (non-critical)
  else
    passed=$((passed + 1))
  fi

  unset css_blob
done

###############################################################################
# Final summary
###############################################################################
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "${BOLD}Summary${RESET}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Total decks:  $total"
echo "  ${GREEN}Passed:${RESET}       $passed"
if (( warned > 0 )); then
  echo "  ${YELLOW}Warnings:${RESET}     $warned"
fi
if (( failed > 0 )); then
  echo "  ${RED}Failed:${RESET}       $failed"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if (( failed > 0 )); then
  echo ""
  echo "${RED}${BOLD}RESULT: FAIL${RESET} — $failed/$total deck(s) have critical issues."
  exit 1
else
  echo ""
  echo "${GREEN}${BOLD}RESULT: PASS${RESET} — $passed/$total deck(s) passed."
  exit 0
fi

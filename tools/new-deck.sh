#!/usr/bin/env bash
set -euo pipefail

# ─── new-deck.sh ────────────────────────────────────────────────
# Scaffold a new Slidev deck directory with the correct style preset.
#
# Usage:
#   ./new-deck.sh <name> <preset>
#
# Example:
#   ./new-deck.sh my-talk cloudflare
# ────────────────────────────────────────────────────────────────

ROOT="$(cd "$(dirname "$0")" && pwd)"
EXAMPLES="$ROOT/../examples"

VALID_PRESETS="editorial-dark swiss-minimal bold-modern sumi-e tufte-data cloudflare material-design"

# ─── Usage / validation ────────────────────────────────────────

usage() {
  echo "Usage: $0 <name> <preset>"
  echo ""
  echo "  name    Directory name for the new deck (e.g. my-talk)"
  echo "  preset  One of: $VALID_PRESETS"
  exit 1
}

if [[ $# -lt 2 ]]; then
  usage
fi

DECK_NAME="$1"
PRESET="$2"

# Validate preset
preset_valid=false
for p in $VALID_PRESETS; do
  if [[ "$p" == "$PRESET" ]]; then
    preset_valid=true
    break
  fi
done

if [[ "$preset_valid" == "false" ]]; then
  echo "Error: unknown preset '$PRESET'"
  echo ""
  echo "Valid presets: $VALID_PRESETS"
  exit 1
fi

DECK_DIR="$EXAMPLES/$DECK_NAME"

if [[ -d "$DECK_DIR" ]]; then
  echo "Error: directory '$DECK_NAME' already exists in examples/."
  exit 1
fi

# ─── Preset configuration via case statement ───────────────────
# Bash 3.2 compatible (no associative arrays).

case "$PRESET" in
  editorial-dark)
    theme="default"
    color_schema="dark"
    preset_weights="300,400,600,700,900"
    preset_italic="true"
    font_sans="Playfair Display"
    font_serif="Source Sans 3"
    font_mono="JetBrains Mono"
    transition="fade"
    bg="#0f1219"
    fg="#e2e8f0"
    accent="#64b5f6"
    accent_alt=""
    muted="rgba(226, 232, 240, 0.5)"
    surface=""
    border_color=""
    font_display_css="'Playfair Display', serif"
    font_body_css="'Source Sans 3', sans-serif"
    font_mono_css="'JetBrains Mono', monospace"
    gap="1.5rem"
    radius="10px"
    vclick_transition="all 0.5s ease"
    vclick_transform=""
    code_bg="rgba(100, 181, 246, 0.1)"
    extra_tokens=""
    ;;
  swiss-minimal)
    theme="default"
    color_schema="light"
    preset_weights="400,500,600,700"
    preset_italic="false"
    font_sans="Plus Jakarta Sans"
    font_serif="Figtree"
    font_mono="JetBrains Mono"
    transition="slide-left"
    bg="#ffffff"
    fg="#1a1a2e"
    accent="#2563eb"
    accent_alt=""
    muted="rgba(26, 26, 46, 0.45)"
    surface=""
    border_color=""
    font_display_css="'Plus Jakarta Sans', sans-serif"
    font_body_css="'Figtree', sans-serif"
    font_mono_css="'JetBrains Mono', monospace"
    gap="1.5rem"
    radius="8px"
    vclick_transition="all 0.35s ease-out"
    vclick_transform="translateX(-6px)"
    code_bg="rgba(37, 99, 235, 0.08)"
    extra_tokens=""
    ;;
  bold-modern)
    theme="default"
    color_schema="dark"
    preset_weights="400,500,700"
    preset_italic="false"
    font_sans="Bebas Neue"
    font_serif="DM Sans"
    font_mono="JetBrains Mono"
    transition="slide-left"
    bg="#0a0a0f"
    fg="#f0f0f5"
    accent="#a78bfa"
    accent_alt=""
    muted="rgba(240, 240, 245, 0.5)"
    surface=""
    border_color=""
    font_display_css="'Bebas Neue', sans-serif"
    font_body_css="'DM Sans', sans-serif"
    font_mono_css="'JetBrains Mono', monospace"
    gap="1.5rem"
    radius="12px"
    vclick_transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    vclick_transform="scale(0.95) translateY(8px)"
    code_bg="rgba(167, 139, 250, 0.08)"
    extra_tokens=""
    ;;
  sumi-e)
    theme="seriph"
    color_schema="light"
    preset_weights="400,500,600,700"
    preset_italic="true"
    font_sans="Crimson Pro"
    font_serif="Zen Old Mincho"
    font_mono="JetBrains Mono"
    transition="fade"
    bg="#f5f0e8"
    fg="#1a1a1a"
    accent="#c23b22"
    accent_alt=""
    muted="rgba(26, 26, 26, 0.4)"
    surface=""
    border_color=""
    font_display_css="'Zen Old Mincho', serif"
    font_body_css="'Crimson Pro', serif"
    font_mono_css="'JetBrains Mono', monospace"
    gap="2rem"
    radius="0"
    vclick_transition="all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    vclick_transform="translateX(12px)"
    code_bg="rgba(26, 26, 26, 0.06)"
    extra_tokens=""
    ;;
  tufte-data)
    theme="seriph"
    color_schema="light"
    preset_weights="400,500"
    preset_italic="true"
    font_sans="Source Sans 3"
    font_serif="EB Garamond"
    font_mono="Source Code Pro"
    transition="fade"
    bg="#fffff8"
    fg="#111111"
    accent="#2d5f8a"
    accent_alt="#c0392b"
    muted="rgba(17, 17, 17, 0.5)"
    surface=""
    border_color=""
    font_display_css="'EB Garamond', serif"
    font_body_css="'EB Garamond', serif"
    font_mono_css="'Source Code Pro', monospace"
    gap="1.5rem"
    radius="0"
    vclick_transition="all 0.3s ease"
    vclick_transform=""
    code_bg="rgba(17, 17, 17, 0.05)"
    extra_tokens="  --deck-font-labels: 'Source Sans 3', sans-serif;"
    ;;
  cloudflare)
    theme="default"
    color_schema="light"
    preset_weights="400,500,600,700"
    preset_italic="false"
    font_sans="Work Sans"
    font_serif="DM Sans"
    font_mono="IBM Plex Mono"
    transition="slide-left"
    bg="#f5f1eb"
    fg="#521000"
    accent="#ff6633"
    accent_alt="#b45309"
    muted="rgba(82, 16, 0, 0.6)"
    surface="#fffbf5"
    border_color="#ebd5c1"
    font_display_css="'Work Sans', sans-serif"
    font_body_css="'DM Sans', sans-serif"
    font_mono_css="'IBM Plex Mono', monospace"
    gap="1.5rem"
    radius="10px"
    vclick_transition="all 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
    vclick_transform="translateY(6px)"
    code_bg="rgba(255, 102, 51, 0.08)"
    extra_tokens=""
    ;;
  material-design)
    theme="default"
    color_schema="light"
    preset_weights="300,400,500,600,700"
    preset_italic="false"
    font_sans="Plus Jakarta Sans"
    font_serif="Outfit"
    font_mono="Roboto Mono"
    transition="slide-left"
    bg="#FFFBFE"
    fg="#1C1B1F"
    accent="#6750A4"
    accent_alt="#625B71"
    muted="rgba(28, 27, 31, 0.5)"
    surface="#FFFBFE"
    border_color=""
    font_display_css="'Outfit', sans-serif"
    font_body_css="'Plus Jakarta Sans', sans-serif"
    font_mono_css="'Roboto Mono', monospace"
    gap="1.25rem"
    radius="12px"
    vclick_transition="all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0)"
    vclick_transform="scale(0.92)"
    code_bg=""  # uses var(--deck-surface-container) instead
    extra_tokens="  --deck-primary: #6750A4;
  --deck-primary-container: #EADDFF;
  --deck-on-primary-container: #21005D;
  --deck-secondary: #625B71;
  --deck-secondary-container: #E8DEF8;
  --deck-on-secondary-container: #1D192B;
  --deck-surface-variant: #E7E0EC;
  --deck-surface-container: #F3EDF7;
  --deck-surface-container-high: #ECE6F0;
  --deck-outline: #79747E;
  --deck-outline-variant: #CAC4D0;
  --m3-elevation-1: 0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15);
  --m3-elevation-2: 0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15);
  --m3-elevation-3: 0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3);
  --m3-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --m3-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0);
  --m3-easing-standard: cubic-bezier(0.2, 0, 0, 1);"
    ;;
esac

# Derived flags
is_dark="false"
if [[ "$color_schema" == "dark" ]]; then
  is_dark="true"
fi

is_serif_preset="false"
if [[ "$PRESET" == "sumi-e" || "$PRESET" == "tufte-data" ]]; then
  is_serif_preset="true"
fi

# ─── Create directory structure ────────────────────────────────

echo "Creating deck '$DECK_NAME' with preset '$PRESET'..."
mkdir -p "$DECK_DIR/styles"
mkdir -p "$DECK_DIR/components"

# ─── Generate styles/tokens.css ────────────────────────────────

{
  echo ":root {"
  echo "  --deck-bg: $bg;"
  echo "  --deck-fg: $fg;"
  echo "  --deck-accent: $accent;"
  if [[ -n "$accent_alt" ]]; then
    echo "  --deck-accent-alt: $accent_alt;"
  fi
  echo "  --deck-muted: $muted;"
  if [[ -n "$surface" ]]; then
    echo "  --deck-surface: $surface;"
  fi
  if [[ -n "$border_color" ]]; then
    echo "  --deck-border: $border_color;"
  fi
  echo "  --deck-font-display: $font_display_css;"
  echo "  --deck-font-body: $font_body_css;"
  echo "  --deck-font-mono: $font_mono_css;"
  echo "  --deck-gap: $gap;"
  echo "  --deck-radius: $radius;"
  if [[ -n "$extra_tokens" ]]; then
    echo "$extra_tokens"
  fi
  echo "}"
} > "$DECK_DIR/styles/tokens.css"

# ─── Generate styles/theme.css ─────────────────────────────────

# Build the v-click hidden declarations
vclick_hidden_props="  opacity: 0;"
if [[ -n "$vclick_transform" ]]; then
  vclick_hidden_props="${vclick_hidden_props}
  transform: ${vclick_transform};"
fi

{
  # ── Base .slidev-layout ──
  echo ".slidev-layout {"
  echo "  font-family: var(--deck-font-body);"
  echo "  color: var(--deck-fg);"
  if [[ "$theme" == "default" ]]; then
    echo "  background: var(--deck-bg);"
  fi
  echo "}"
  echo ""

  # ── Headings ──
  echo "h1, h2, h3 {"
  echo "  font-family: var(--deck-font-display);"
  if [[ "$is_serif_preset" == "true" ]]; then
    echo "  font-weight: 400;"
    echo "  letter-spacing: -0.02em;"
    echo "  line-height: 1.2;"
  else
    echo "  font-weight: 700;"
  fi
  echo "}"
  echo ""

  echo "h1 {"
  if [[ "$is_serif_preset" == "true" ]]; then
    echo "  font-size: 2.5rem;"
  else
    echo "  font-size: 2.75rem;"
    echo "  line-height: 1.1;"
    echo "  letter-spacing: -0.02em;"
    echo "  color: var(--deck-fg);"
  fi
  echo "}"
  echo ""

  if [[ "$is_serif_preset" == "true" ]]; then
    echo "h2 {"
    echo "  font-size: 1.8rem;"
    echo "}"
    echo ""
  fi

  echo "h3 {"
  echo "  color: var(--deck-accent);"
  if [[ "$is_serif_preset" == "true" ]]; then
    echo "  font-size: 1.15rem;"
  else
    echo "  font-size: 1rem;"
    echo "  text-transform: uppercase;"
    echo "  letter-spacing: 0.05em;"
    if [[ -n "$accent_alt" && "$PRESET" != "material-design" ]]; then
      echo "  margin-bottom: 0.5rem;"
    fi
  fi
  echo "}"
  echo ""

  # ── strong ──
  echo "strong {"
  if [[ "$PRESET" == "material-design" ]]; then
    echo "  color: var(--deck-primary);"
  else
    echo "  color: var(--deck-accent);"
  fi
  echo "}"
  echo ""

  # ── code ──
  echo "code {"
  echo "  font-family: var(--deck-font-mono);"
  if [[ -n "$accent_alt" ]]; then
    echo "  color: var(--deck-accent-alt);"
  else
    echo "  color: var(--deck-accent);"
  fi
  if [[ "$PRESET" == "material-design" ]]; then
    echo "  background: var(--deck-surface-container);"
  else
    echo "  background: $code_bg;"
  fi
  echo "  padding: 0.15em 0.4em;"
  if [[ "$is_serif_preset" == "true" ]]; then
    echo "  border-radius: 2px;"
    echo "  font-size: 0.85em;"
  else
    echo "  border-radius: 4px;"
    echo "  font-size: 0.9em;"
  fi
  echo "}"
  echo ""

  # ── Lists ──
  echo "ol, ul {"
  echo "  line-height: 1.8;"
  echo "}"
  echo ""
  echo "ol li::marker {"
  if [[ "$PRESET" == "material-design" ]]; then
    echo "  color: var(--deck-primary);"
  else
    echo "  color: var(--deck-accent);"
  fi
  echo "  font-weight: 700;"
  echo "}"
  echo ""
  echo "ul li::marker {"
  if [[ "$PRESET" == "material-design" ]]; then
    echo "  color: var(--deck-primary);"
  else
    echo "  color: var(--deck-accent);"
  fi
  echo "}"
  echo ""

  # ── v-click animations ──
  echo "/* v-click animations — $PRESET preset */"
  echo ".slidev-vclick-target {"
  echo "  transition: $vclick_transition;"
  echo "}"
  echo ""
  echo ".slidev-vclick-hidden {"
  echo "$vclick_hidden_props"
  echo "}"
  echo ""

  # ── Cover layout ──
  echo "/* Cover */"
  echo ".slidev-layout.cover {"
  echo "  display: flex;"
  echo "  flex-direction: column;"
  echo "  justify-content: center;"
  echo "  padding: 4rem;"
  if [[ -n "$surface" ]]; then
    echo "  background: var(--deck-surface);"
  elif [[ "$theme" != "default" ]]; then
    echo "  background: var(--deck-bg);"
  fi
  echo "}"
  echo ""
  echo ".slidev-layout.cover h1 {"
  echo "  font-size: 3.5rem;"
  echo "  letter-spacing: -0.03em;"
  echo "}"
  echo ""
  echo ".slidev-layout.cover p {"
  echo "  font-size: 1.15rem;"
  echo "  color: var(--deck-muted);"
  echo "  margin-top: 1rem;"
  echo "}"
  echo ""

  # ── Section layout ──
  echo "/* Section */"
  echo ".slidev-layout.section {"
  if [[ "$PRESET" == "material-design" ]]; then
    echo "  background: var(--deck-primary);"
    echo "  color: #fff;"
  else
    echo "  background: var(--deck-fg);"
    echo "  color: var(--deck-bg);"
  fi
  echo "}"
  echo ""
  echo ".slidev-layout.section h1 {"
  echo "  font-size: 3rem;"
  echo "  letter-spacing: -0.02em;"
  if [[ "$PRESET" == "material-design" ]]; then
    echo "  color: #fff;"
  else
    echo "  color: var(--deck-bg);"
  fi
  echo "}"
  echo ""
  echo ".slidev-layout.section p {"
  if [[ "$is_dark" == "true" ]]; then
    echo "  color: var(--deck-muted);"
  elif [[ "$PRESET" == "material-design" ]]; then
    echo "  color: rgba(255, 255, 255, 0.7);"
  else
    echo "  color: rgba(245, 241, 235, 0.6);"
  fi
  echo "  font-size: 1.15rem;"
  echo "  margin-top: 0.75rem;"
  echo "}"
  echo ""

  # ── Fact layout ──
  echo "/* Fact */"
  echo ".slidev-layout.fact h1 {"
  echo "  font-size: 7rem;"
  if [[ "$PRESET" == "material-design" ]]; then
    echo "  color: var(--deck-primary);"
  else
    echo "  color: var(--deck-accent);"
  fi
  echo "  letter-spacing: -0.04em;"
  echo "}"
  echo ""
  echo ".slidev-layout.fact p:first-of-type {"
  echo "  font-size: 1.1rem;"
  echo "  text-transform: uppercase;"
  echo "  letter-spacing: 0.08em;"
  echo "  color: var(--deck-muted);"
  echo "  margin-top: -0.5rem;"
  echo "}"
  echo ""
  echo ".slidev-layout.fact p:last-of-type {"
  echo "  font-size: 1.15rem;"
  echo "  margin-top: 2rem;"
  echo "  color: var(--deck-fg);"
  echo "}"
  echo ""

  # ── End layout ──
  echo "/* End */"
  echo ".slidev-layout.end {"
  echo "  display: flex;"
  echo "  flex-direction: column;"
  echo "  justify-content: center;"
  echo "  align-items: center;"
  echo "  text-align: center;"
  if [[ "$PRESET" == "material-design" ]]; then
    echo "  background: #1C1B1F;"
    echo "  color: #E6E1E5;"
  elif [[ "$is_dark" == "false" ]]; then
    echo "  background: var(--deck-fg);"
    echo "  color: var(--deck-bg);"
  fi
  echo "}"
  echo ""
  echo ".slidev-layout.end h1 {"
  echo "  font-size: 3.5rem;"
  if [[ "$PRESET" == "material-design" ]]; then
    echo "  color: #E6E1E5;"
  elif [[ "$is_dark" == "false" ]]; then
    echo "  color: var(--deck-bg);"
  fi
  echo "}"
  echo ""
  echo ".slidev-layout.end p {"
  echo "  color: var(--deck-accent);"
  echo "  font-family: var(--deck-font-mono);"
  echo "  font-size: 1.2rem;"
  echo "  margin-top: 1rem;"
  echo "}"
  echo ""

  # ── Quote layout ──
  echo "/* Quote */"
  echo ".slidev-layout.quote {"
  echo "  display: flex;"
  echo "  flex-direction: column;"
  echo "  justify-content: center;"
  echo "  padding: 4rem;"
  if [[ -n "$surface" ]]; then
    echo "  background: var(--deck-surface);"
  fi
  echo "}"
  echo ""
  echo ".slidev-layout.quote h1 {"
  echo "  font-size: 2rem;"
  echo "  font-style: italic;"
  echo "  line-height: 1.4;"
  echo "  border-left: 4px solid var(--deck-accent);"
  echo "  padding-left: 1.5rem;"
  echo "}"
  echo ""
  echo ".slidev-layout.quote p {"
  echo "  color: var(--deck-muted);"
  echo "  margin-top: 1.5rem;"
  echo "  font-size: 1rem;"
  echo "}"
} > "$DECK_DIR/styles/theme.css"

# ─── Generate styles/index.css ─────────────────────────────────

cat > "$DECK_DIR/styles/index.css" << 'INDEXCSS'
@import './tokens.css';
@import './theme.css';
@import './transitions.css';
INDEXCSS

# ─── Generate slides.md ───────────────────────────────────────

cat > "$DECK_DIR/slides.md" << SLIDESMD
---
theme: ${theme}
title: ${DECK_NAME}
colorSchema: ${color_schema}
fonts:
  sans: ${font_sans}
  serif: ${font_serif}
  mono: ${font_mono}
  weights: '${preset_weights}'
  italic: ${preset_italic}
transition: ${transition}
layout: cover
---

# ${DECK_NAME}

Subtitle goes here.

---
layout: section
transition: fade
---

# Section Title

A brief section description.

---
layout: end
---

# Thank You

${DECK_NAME}
SLIDESMD

# ─── Generate deck.spec.md ────────────────────────────────────

# Extract clean font names from CSS values (strip quotes and fallbacks)
display_font="${font_display_css%%,*}"
display_font="${display_font//\'/}"
body_font="${font_body_css%%,*}"
body_font="${body_font//\'/}"
mono_font="${font_mono_css%%,*}"
mono_font="${mono_font//\'/}"

# Build optional color lines
spec_accent_alt=""
if [[ -n "$accent_alt" ]]; then
  spec_accent_alt=$'\n'"  - accent-alt: \"$accent_alt\""
fi

spec_surface=""
if [[ -n "$surface" ]]; then
  spec_surface=$'\n'"  - surface: \"$surface\""
fi

spec_border=""
if [[ -n "$border_color" ]]; then
  spec_border=$'\n'"  - border: \"$border_color\""
fi

cat > "$DECK_DIR/deck.spec.md" << SPECMD
# Deck Spec

## Meta
- title: ${DECK_NAME}
- purpose: TODO
- audience: TODO
- tone: TODO
- target-length: 6
- notes: no
- style-preset: ${PRESET}

## Design Tokens
- colors:
  - bg: "${bg}"
  - fg: "${fg}"
  - accent: "${accent}"${spec_accent_alt}
  - muted: "${muted}"${spec_surface}${spec_border}
- typography:
  - display: ${display_font}
  - body: ${body_font}
  - mono: ${mono_font}
- motion:
  - preset: TODO

## Layout System
- prefer-builtins: true
- builtins:
  - cover
  - center
  - default
  - section
  - fact
  - quote
  - two-cols
  - end
- custom-layouts: []
- components: []
- css-files:
  - styles/tokens.css
  - styles/theme.css

## Slides

### Slide 1
- kind: cover
- layout: cover
- title: ${DECK_NAME}
- subtitle: Subtitle goes here.

### Slide 2
- kind: section
- layout: section
- title: Section Title

### Slide 3
- kind: end
- layout: end
- title: Thank You
SPECMD

# ─── Generate universal files (keyboard help, shortcuts, transitions) ──

mkdir -p "$DECK_DIR/setup" "$DECK_DIR/composables"

cat > "$DECK_DIR/composables/useHelp.ts" << 'USEHELP'
import { ref } from 'vue'

export const showHelp = ref(false)

export function toggleHelp() {
  showHelp.value = !showHelp.value
}
USEHELP

cat > "$DECK_DIR/setup/shortcuts.ts" << 'SHORTCUTS'
import { defineShortcutsSetup } from '@slidev/types'
import { toggleHelp } from '../composables/useHelp'

export default defineShortcutsSetup((_, base) => {
  return [
    ...base,
    {
      key: '?',
      fn: () => toggleHelp(),
      autoRepeat: false,
    },
    {
      key: 'p',
      fn: () => {
        const base = import.meta.env.BASE_URL || '/'
        window.open(`${base}presenter/`, '_blank')
      },
      autoRepeat: false,
    },
  ]
})
SHORTCUTS

cat > "$DECK_DIR/components/KeyboardHelp.vue" << 'KBHELP'
<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { toggleHelp } from '../composables/useHelp'

onKeyStroke('Escape', () => toggleHelp())
</script>

<template>
  <Teleport to="body">
    <div class="help-backdrop" @click.self="toggleHelp()">
      <div class="help-panel">
        <h2 class="help-title">Keyboard Shortcuts</h2>
        <div class="help-grid">
          <div class="help-column">
            <h3>Navigation</h3>
            <div class="help-row">
              <kbd>&#8594;</kbd> / <kbd>Space</kbd>
              <span>Next slide</span>
            </div>
            <div class="help-row">
              <kbd>&#8592;</kbd>
              <span>Previous slide</span>
            </div>
            <div class="help-row">
              <kbd>&#8593;</kbd>
              <span>Previous click</span>
            </div>
            <div class="help-row">
              <kbd>&#8595;</kbd>
              <span>Next click</span>
            </div>
            <div class="help-row">
              <kbd>Home</kbd>
              <span>First slide</span>
            </div>
            <div class="help-row">
              <kbd>End</kbd>
              <span>Last slide</span>
            </div>
          </div>

          <div class="help-column">
            <h3>View</h3>
            <div class="help-row">
              <kbd>o</kbd>
              <span>Slide overview</span>
            </div>
            <div class="help-row">
              <kbd>d</kbd>
              <span>Toggle dark mode</span>
            </div>
            <div class="help-row">
              <kbd>f</kbd>
              <span>Fullscreen</span>
            </div>
            <div class="help-row">
              <kbd>g</kbd>
              <span>Go to slide</span>
            </div>
            <div class="help-row">
              <kbd>Esc</kbd>
              <span>Close overlays</span>
            </div>
          </div>

          <div class="help-column">
            <h3>Tools</h3>
            <div class="help-row">
              <kbd>p</kbd>
              <span>Presenter mode</span>
            </div>
            <div class="help-row">
              <kbd>?</kbd>
              <span>Toggle this panel</span>
            </div>
            <div class="help-row">
              <kbd>e</kbd>
              <span>Pen / drawing</span>
            </div>
            <div class="help-row">
              <kbd>u</kbd>
              <span>Pen color</span>
            </div>
            <div class="help-row">
              <kbd>Delete</kbd>
              <span>Clear drawings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.help-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.help-panel {
  background: rgba(30, 30, 40, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  max-width: 720px;
  width: 90vw;
}

.help-title {
  font-family: var(--deck-font-display, sans-serif);
  font-size: 1.4rem;
  font-weight: 700;
  color: #f0eef5;
  margin-bottom: 1.5rem;
  text-align: center;
}

.help-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.help-column h3 {
  font-family: var(--deck-font-display, sans-serif);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--deck-accent, #a78bfa);
  margin-bottom: 0.75rem;
}

.help-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: rgba(240, 238, 245, 0.7);
}

.help-row span {
  margin-left: auto;
  white-space: nowrap;
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.6em;
  padding: 0.15em 0.45em;
  font-family: var(--deck-font-mono, monospace);
  font-size: 0.75rem;
  color: #f0eef5;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  line-height: 1.4;
}

@media (max-width: 640px) {
  .help-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
KBHELP

cat > "$DECK_DIR/global-top.vue" << 'GLOBALTOP'
<script setup lang="ts">
import { showHelp } from './composables/useHelp'
import KeyboardHelp from './components/KeyboardHelp.vue'
</script>

<template>
  <KeyboardHelp v-if="showHelp" />
</template>
GLOBALTOP

cat > "$DECK_DIR/global-bottom.vue" << 'GLOBALBOTTOM'
<template>
  <div v-if="!['cover', 'end'].includes($nav.currentLayout)" class="deck-footer">
    <span class="deck-footer-title">{{ $slidev.configs.title }}</span>
    <span class="deck-footer-page">{{ $nav.currentPage }} / {{ $nav.total }}</span>
  </div>
</template>
<style scoped>
.deck-footer {
  position: absolute; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: space-between;
  padding: 0.5rem 1.5rem;
  font-family: var(--deck-font-body, sans-serif);
  font-size: 0.65rem; color: var(--deck-muted);
  pointer-events: none; z-index: 1;
}
</style>
GLOBALBOTTOM

cat > "$DECK_DIR/setup/mermaid-renderer.ts" << 'MERMAIDRENDERER'
import { defineMermaidRendererSetup } from '@slidev/types'
import { renderMermaid } from 'beautiful-mermaid'

export default defineMermaidRendererSetup(() => {
  return (code, _options) => renderMermaid(code)
})
MERMAIDRENDERER

cp "$ROOT/../slide-maker/styles/transitions.css" "$DECK_DIR/styles/transitions.css"

# ─── Update build.sh DECKS array ──────────────────────────────

BUILD_FILE="$EXAMPLES/build.sh"

if [[ -f "$BUILD_FILE" ]]; then
  if grep -q "\"${DECK_NAME}:${DECK_NAME}\"" "$BUILD_FILE"; then
    echo "Note: '$DECK_NAME' is already in build.sh DECKS array."
  else
    # Insert new entry before the closing ) of the DECKS array
    sed -i '' "/^)$/i\\
\\  \"${DECK_NAME}:${DECK_NAME}\"" "$BUILD_FILE"
    echo "Added '${DECK_NAME}:${DECK_NAME}' to build.sh DECKS array."
  fi
else
  echo "Warning: build.sh not found at $BUILD_FILE — skipping DECKS update."
fi

# ─── Done ──────────────────────────────────────────────────────

echo ""
echo "Deck '$DECK_NAME' created successfully with preset '$PRESET'."
echo ""
echo "Files created:"
echo "  examples/$DECK_NAME/slides.md"
echo "  examples/$DECK_NAME/deck.spec.md"
echo "  examples/$DECK_NAME/styles/index.css"
echo "  examples/$DECK_NAME/styles/tokens.css"
echo "  examples/$DECK_NAME/styles/theme.css"
echo "  examples/$DECK_NAME/styles/transitions.css"
echo "  examples/$DECK_NAME/composables/useHelp.ts"
echo "  examples/$DECK_NAME/setup/shortcuts.ts"
echo "  examples/$DECK_NAME/setup/mermaid-renderer.ts"
echo "  examples/$DECK_NAME/components/KeyboardHelp.vue"
echo "  examples/$DECK_NAME/global-top.vue"
echo "  examples/$DECK_NAME/global-bottom.vue"
echo ""
echo "Next steps:"
echo "  1. Edit deck.spec.md — fill in purpose, audience, tone, and slide plan"
echo "  2. Edit slides.md — build your slides"
echo "  3. Preview:  cd examples/$DECK_NAME && npx slidev"
echo "  4. Build:    cd examples && bash build.sh"

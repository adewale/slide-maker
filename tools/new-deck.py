#!/usr/bin/env python3
"""Scaffold a new Slidev deck directory with a style preset.

Usage:
    python tools/new-deck.py <name> <preset>

Example:
    python tools/new-deck.py my-talk cloudflare
"""

from __future__ import annotations

import shutil
import sys
import textwrap
from pathlib import Path

# ─── Paths ────────────────────────────────────────────────────────────────────

TOOLS_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = TOOLS_DIR.parent
DECKS_ROOT = PROJECT_ROOT / "decks"
SKILL_DIR = PROJECT_ROOT / "skills" / "slide-maker"

# ─── Preset definitions ──────────────────────────────────────────────────────

PRESETS: dict[str, dict] = {
    "editorial-dark": {
        "theme": "default",
        "color_schema": "dark",
        "weights": "300,400,600,700,900",
        "italic": True,
        "font_sans": "Playfair Display",
        "font_serif": "Source Sans 3",
        "font_mono": "JetBrains Mono",
        "transition": "fade",
        "bg": "#0f1219",
        "fg": "#e2e8f0",
        "accent": "#64b5f6",
        "accent_alt": "",
        "muted": "rgba(226, 232, 240, 0.5)",
        "surface": "",
        "border_color": "",
        "font_display_css": "'Playfair Display', serif",
        "font_body_css": "'Source Sans 3', sans-serif",
        "font_mono_css": "'JetBrains Mono', monospace",
        "gap": "1.5rem",
        "radius": "10px",
        "vclick_transition": "all 0.5s ease",
        "vclick_transform": "",
        "code_bg": "rgba(100, 181, 246, 0.1)",
        "extra_tokens": "",
    },
    "swiss-minimal": {
        "theme": "default",
        "color_schema": "light",
        "weights": "400,500,600,700",
        "italic": False,
        "font_sans": "Plus Jakarta Sans",
        "font_serif": "Figtree",
        "font_mono": "JetBrains Mono",
        "transition": "slide-left",
        "bg": "#ffffff",
        "fg": "#1a1a2e",
        "accent": "#2563eb",
        "accent_alt": "",
        "muted": "rgba(26, 26, 46, 0.45)",
        "surface": "",
        "border_color": "",
        "font_display_css": "'Plus Jakarta Sans', sans-serif",
        "font_body_css": "'Figtree', sans-serif",
        "font_mono_css": "'JetBrains Mono', monospace",
        "gap": "1.5rem",
        "radius": "8px",
        "vclick_transition": "all 0.35s ease-out",
        "vclick_transform": "translateX(-6px)",
        "code_bg": "rgba(37, 99, 235, 0.08)",
        "extra_tokens": "",
    },
    "bold-modern": {
        "theme": "default",
        "color_schema": "dark",
        "weights": "400,500,700",
        "italic": False,
        "font_sans": "Bebas Neue",
        "font_serif": "DM Sans",
        "font_mono": "JetBrains Mono",
        "transition": "slide-left",
        "bg": "#0a0a0f",
        "fg": "#f0f0f5",
        "accent": "#a78bfa",
        "accent_alt": "",
        "muted": "rgba(240, 240, 245, 0.5)",
        "surface": "",
        "border_color": "",
        "font_display_css": "'Bebas Neue', sans-serif",
        "font_body_css": "'DM Sans', sans-serif",
        "font_mono_css": "'JetBrains Mono', monospace",
        "gap": "1.5rem",
        "radius": "12px",
        "vclick_transition": "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "vclick_transform": "scale(0.95) translateY(8px)",
        "code_bg": "rgba(167, 139, 250, 0.08)",
        "extra_tokens": "",
    },
    "tufte-data": {
        "theme": "seriph",
        "color_schema": "light",
        "weights": "400,500",
        "italic": True,
        "font_sans": "Source Sans 3",
        "font_serif": "EB Garamond",
        "font_mono": "Source Code Pro",
        "transition": "fade",
        "bg": "#fffff8",
        "fg": "#111111",
        "accent": "#2d5f8a",
        "accent_alt": "#c0392b",
        "muted": "rgba(17, 17, 17, 0.5)",
        "surface": "",
        "border_color": "",
        "font_display_css": "'EB Garamond', serif",
        "font_body_css": "'EB Garamond', serif",
        "font_mono_css": "'Source Code Pro', monospace",
        "gap": "1.5rem",
        "radius": "0",
        "vclick_transition": "all 0.3s ease",
        "vclick_transform": "",
        "code_bg": "rgba(17, 17, 17, 0.05)",
        "extra_tokens": "  --deck-font-labels: 'Source Sans 3', sans-serif;",
    },
    "cloudflare": {
        "theme": "default",
        "color_schema": "light",
        "weights": "400,500,600,700",
        "italic": False,
        "font_sans": "Work Sans",
        "font_serif": "DM Sans",
        "font_mono": "IBM Plex Mono",
        "transition": "slide-left",
        "bg": "#f5f1eb",
        "fg": "#521000",
        "accent": "#ff6633",
        "accent_alt": "#b45309",
        "muted": "rgba(82, 16, 0, 0.6)",
        "surface": "#fffbf5",
        "border_color": "#ebd5c1",
        "font_display_css": "'Work Sans', sans-serif",
        "font_body_css": "'DM Sans', sans-serif",
        "font_mono_css": "'IBM Plex Mono', monospace",
        "gap": "1.5rem",
        "radius": "10px",
        "vclick_transition": "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        "vclick_transform": "translateY(6px)",
        "code_bg": "rgba(255, 102, 51, 0.08)",
        "extra_tokens": "",
    },
    "material-design": {
        "theme": "default",
        "color_schema": "light",
        "weights": "300,400,500,600,700",
        "italic": False,
        "font_sans": "Plus Jakarta Sans",
        "font_serif": "Outfit",
        "font_mono": "Roboto Mono",
        "transition": "slide-left",
        "bg": "#FFFBFE",
        "fg": "#1C1B1F",
        "accent": "#6750A4",
        "accent_alt": "#625B71",
        "muted": "rgba(28, 27, 31, 0.5)",
        "surface": "#FFFBFE",
        "border_color": "",
        "font_display_css": "'Outfit', sans-serif",
        "font_body_css": "'Plus Jakarta Sans', sans-serif",
        "font_mono_css": "'Roboto Mono', monospace",
        "gap": "1.25rem",
        "radius": "12px",
        "vclick_transition": "all 0.4s cubic-bezier(0.05, 0.7, 0.1, 1.0)",
        "vclick_transform": "scale(0.92)",
        "code_bg": "",  # uses var(--deck-surface-container) instead
        "extra_tokens": textwrap.dedent("""\
              --deck-primary: #6750A4;
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
              --m3-easing-standard: cubic-bezier(0.2, 0, 0, 1);"""),
    },
}

VALID_PRESETS = list(PRESETS.keys())

# ─── Scaffold files to copy from the skill directory ─────────────────────────
# Mapping: destination (relative to deck dir) -> source (relative to SKILL_DIR)

SCAFFOLD_COPIES: dict[str, str] = {
    "composables/useHelp.ts": "composables/useHelp.ts",
    "setup/shortcuts.ts": "setup/shortcuts.ts",
    "setup/mermaid-renderer.ts": "setup/mermaid-renderer.ts",
    "components/KeyboardHelp.vue": "components/KeyboardHelp.vue",
    # global-top.vue imports these three — vendor them so the scaffolded deck builds
    "components/ProgressSegmentBar.vue": "components/ProgressSegmentBar.vue",
    "components/AudienceQRCode.vue": "components/AudienceQRCode.vue",
    "components/MobileScrollView.vue": "components/MobileScrollView.vue",
    "global-top.vue": "global-top.vue",
    "styles/transitions.css": "styles/transitions.css",
}


# ─── Helpers ──────────────────────────────────────────────────────────────────


def usage() -> None:
    print(f"Usage: {sys.argv[0]} <name> <preset>")
    print()
    print("  name    Directory name for the new deck (e.g. my-talk)")
    print(f"  preset  One of: {' '.join(VALID_PRESETS)}")
    sys.exit(1)


def clean_font_name(css_value: str) -> str:
    """Extract a clean font name from a CSS font-family value.

    E.g. "'Playfair Display', serif" -> "Playfair Display"
    """
    name = css_value.split(",")[0].strip()
    return name.strip("'\"")


def optional_line(prop: str, value: str) -> str:
    """Return a CSS custom property line if value is non-empty, else empty string."""
    return f"  {prop}: {value};\n" if value else ""


# ─── Generators ───────────────────────────────────────────────────────────────


def generate_tokens_css(p: dict) -> str:
    lines = [":root {\n"]
    lines.append(f"  --deck-bg: {p['bg']};\n")
    lines.append(f"  --deck-fg: {p['fg']};\n")
    lines.append(f"  --deck-accent: {p['accent']};\n")
    lines.append(optional_line("--deck-accent-alt", p["accent_alt"]))
    lines.append(f"  --deck-muted: {p['muted']};\n")
    lines.append(optional_line("--deck-surface", p["surface"]))
    lines.append(optional_line("--deck-border", p["border_color"]))
    lines.append(f"  --deck-font-display: {p['font_display_css']};\n")
    lines.append(f"  --deck-font-body: {p['font_body_css']};\n")
    lines.append(f"  --deck-font-mono: {p['font_mono_css']};\n")
    lines.append(f"  --deck-gap: {p['gap']};\n")
    lines.append(f"  --deck-radius: {p['radius']};\n")
    if p["extra_tokens"]:
        lines.append(p["extra_tokens"] + "\n")
    lines.append("}\n")
    return "".join(lines)


def generate_theme_css(preset_name: str, p: dict) -> str:
    """Generate styles/theme.css content based on preset configuration."""
    is_dark = p["color_schema"] == "dark"
    is_serif = preset_name == "tufte-data"
    is_material = preset_name == "material-design"
    theme = p["theme"]
    accent_alt = p["accent_alt"]
    surface = p["surface"]
    vclick_transition = p["vclick_transition"]
    vclick_transform = p["vclick_transform"]
    code_bg = p["code_bg"]

    out: list[str] = []

    def w(s: str = "") -> None:
        out.append(s + "\n" if s else "\n")

    # ── Base .slidev-layout ──
    w(".slidev-layout {")
    w("  font-family: var(--deck-font-body);")
    w("  color: var(--deck-fg);")
    if theme == "default":
        w("  background: var(--deck-bg);")
    w("}")
    w()

    # ── Headings ──
    w("h1, h2, h3 {")
    w("  font-family: var(--deck-font-display);")
    if is_serif:
        w("  font-weight: 400;")
        w("  letter-spacing: -0.02em;")
        w("  line-height: 1.2;")
    else:
        w("  font-weight: 700;")
    w("}")
    w()

    w("h1 {")
    if is_serif:
        w("  font-size: 2.5rem;")
    else:
        w("  font-size: 2.75rem;")
        w("  line-height: 1.1;")
        w("  letter-spacing: -0.02em;")
        w("  color: var(--deck-fg);")
    w("}")
    w()

    if is_serif:
        w("h2 {")
        w("  font-size: 1.8rem;")
        w("}")
        w()

    w("h3 {")
    w("  color: var(--deck-accent);")
    if is_serif:
        w("  font-size: 1.15rem;")
    else:
        w("  font-size: 1rem;")
        w("  text-transform: uppercase;")
        w("  letter-spacing: 0.05em;")
        if accent_alt and not is_material:
            w("  margin-bottom: 0.5rem;")
    w("}")
    w()

    # ── strong ──
    w("strong {")
    if is_material:
        w("  color: var(--deck-primary);")
    else:
        w("  color: var(--deck-accent);")
    w("}")
    w()

    # ── code ──
    w("code {")
    w("  font-family: var(--deck-font-mono);")
    if accent_alt:
        w("  color: var(--deck-accent-alt);")
    else:
        w("  color: var(--deck-accent);")
    if is_material:
        w("  background: var(--deck-surface-container);")
    else:
        w(f"  background: {code_bg};")
    w("  padding: 0.15em 0.4em;")
    if is_serif:
        w("  border-radius: 2px;")
        w("  font-size: 0.85em;")
    else:
        w("  border-radius: 4px;")
        w("  font-size: 0.9em;")
    w("}")
    w()

    # ── Lists ──
    w("ol, ul {")
    w("  line-height: 1.8;")
    w("}")
    w()
    w("ol li::marker {")
    if is_material:
        w("  color: var(--deck-primary);")
    else:
        w("  color: var(--deck-accent);")
    w("  font-weight: 700;")
    w("}")
    w()
    w("ul li::marker {")
    if is_material:
        w("  color: var(--deck-primary);")
    else:
        w("  color: var(--deck-accent);")
    w("}")
    w()

    # ── v-click animations ──
    w(f"/* v-click animations — {preset_name} preset */")
    w(".slidev-vclick-target {")
    w(f"  transition: {vclick_transition};")
    w("}")
    w()

    w(".slidev-vclick-hidden {")
    w("  opacity: 0;")
    if vclick_transform:
        w(f"  transform: {vclick_transform};")
    w("}")
    w()

    # ── Cover layout ──
    w("/* Cover */")
    w(".slidev-layout.cover {")
    w("  display: flex;")
    w("  flex-direction: column;")
    w("  justify-content: center;")
    w("  padding: 4rem;")
    if surface:
        w("  background: var(--deck-surface);")
    elif theme != "default":
        w("  background: var(--deck-bg);")
    w("}")
    w()
    w(".slidev-layout.cover h1 {")
    w("  font-size: 3.5rem;")
    w("  letter-spacing: -0.03em;")
    w("}")
    w()
    w(".slidev-layout.cover p {")
    w("  font-size: 1.15rem;")
    w("  color: var(--deck-muted);")
    w("  margin-top: 1rem;")
    w("}")
    w()

    # ── Section layout ──
    w("/* Section */")
    w(".slidev-layout.section {")
    if is_material:
        w("  background: var(--deck-primary);")
        w("  color: #fff;")
    else:
        w("  background: var(--deck-fg);")
        w("  color: var(--deck-bg);")
    w("}")
    w()
    w(".slidev-layout.section h1 {")
    w("  font-size: 3rem;")
    w("  letter-spacing: -0.02em;")
    if is_material:
        w("  color: #fff;")
    else:
        w("  color: var(--deck-bg);")
    w("}")
    w()
    w(".slidev-layout.section p {")
    if is_dark:
        w("  color: var(--deck-muted);")
    elif is_material:
        w("  color: rgba(255, 255, 255, 0.7);")
    else:
        w("  color: rgba(245, 241, 235, 0.6);")
    w("  font-size: 1.15rem;")
    w("  margin-top: 0.75rem;")
    w("}")
    w()

    # ── Fact layout ──
    w("/* Fact */")
    w(".slidev-layout.fact h1 {")
    w("  font-size: 7rem;")
    if is_material:
        w("  color: var(--deck-primary);")
    else:
        w("  color: var(--deck-accent);")
    w("  letter-spacing: -0.04em;")
    w("}")
    w()
    w(".slidev-layout.fact p:first-of-type {")
    w("  font-size: 1.1rem;")
    w("  text-transform: uppercase;")
    w("  letter-spacing: 0.08em;")
    w("  color: var(--deck-muted);")
    w("  margin-top: -0.5rem;")
    w("}")
    w()
    w(".slidev-layout.fact p:last-of-type {")
    w("  font-size: 1.15rem;")
    w("  margin-top: 2rem;")
    w("  color: var(--deck-fg);")
    w("}")
    w()

    # ── End layout ──
    w("/* End */")
    w(".slidev-layout.end {")
    w("  display: flex;")
    w("  flex-direction: column;")
    w("  justify-content: center;")
    w("  align-items: center;")
    w("  text-align: center;")
    if is_material:
        w("  background: #1C1B1F;")
        w("  color: #E6E1E5;")
    elif not is_dark:
        w("  background: var(--deck-fg);")
        w("  color: var(--deck-bg);")
    w("}")
    w()
    w(".slidev-layout.end h1 {")
    w("  font-size: 3.5rem;")
    if is_material:
        w("  color: #E6E1E5;")
    elif not is_dark:
        w("  color: var(--deck-bg);")
    w("}")
    w()
    w(".slidev-layout.end p {")
    w("  color: var(--deck-accent);")
    w("  font-family: var(--deck-font-mono);")
    w("  font-size: 1.2rem;")
    w("  margin-top: 1rem;")
    w("}")
    w()

    # ── Quote layout ──
    w("/* Quote */")
    w(".slidev-layout.quote {")
    w("  display: flex;")
    w("  flex-direction: column;")
    w("  justify-content: center;")
    w("  padding: 4rem;")
    if surface:
        w("  background: var(--deck-surface);")
    w("}")
    w()
    w(".slidev-layout.quote h1 {")
    w("  font-size: 2rem;")
    w("  font-style: italic;")
    w("  line-height: 1.4;")
    w("  border-left: 4px solid var(--deck-accent);")
    w("  padding-left: 1.5rem;")
    w("}")
    w()
    w(".slidev-layout.quote p {")
    w("  color: var(--deck-muted);")
    w("  margin-top: 1.5rem;")
    w("  font-size: 1rem;")
    w("}")
    w()
    w("/* Presenter cursor — crosshair when drawing mode is active */")
    w(".slidev-drawing-enabled { cursor: crosshair !important; }")

    return "".join(out)


INDEX_CSS = "@import './tokens.css';\n@import './theme.css';\n@import './transitions.css';\n"


def generate_slides_md(name: str, p: dict) -> str:
    italic_str = "true" if p["italic"] else "false"
    return textwrap.dedent(f"""\
        ---
        theme: {p['theme']}
        title: {name}
        colorSchema: {p['color_schema']}
        fonts:
          sans: {p['font_sans']}
          serif: {p['font_serif']}
          mono: {p['font_mono']}
          weights: '{p['weights']}'
          italic: {italic_str}
        transition: {p['transition']}
        layout: cover
        ---

        # {name}

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

        {name}
    """)


def generate_deck_spec_md(name: str, preset_name: str, p: dict) -> str:
    display_font = clean_font_name(p["font_display_css"])
    body_font = clean_font_name(p["font_body_css"])
    mono_font = clean_font_name(p["font_mono_css"])

    # Build optional color lines
    accent_alt_line = f'\n  - accent-alt: "{p["accent_alt"]}"' if p["accent_alt"] else ""
    surface_line = f'\n  - surface: "{p["surface"]}"' if p["surface"] else ""
    border_line = f'\n  - border: "{p["border_color"]}"' if p["border_color"] else ""

    return textwrap.dedent(f"""\
        # Deck Spec

        ## Meta
        - title: {name}
        - purpose: TODO
        - audience: TODO
        - tone: TODO
        - target-length: 6
        - notes: no
        - style-preset: {preset_name}

        ## Design Tokens
        - colors:
          - bg: "{p['bg']}"
          - fg: "{p['fg']}"
          - accent: "{p['accent']}"{accent_alt_line}
          - muted: "{p['muted']}"{surface_line}{border_line}
        - typography:
          - display: {display_font}
          - body: {body_font}
          - mono: {mono_font}
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
        - title: {name}
        - subtitle: Subtitle goes here.

        ### Slide 2
        - kind: section
        - layout: section
        - title: Section Title

        ### Slide 3
        - kind: end
        - layout: end
        - title: Thank You
    """)


GLOBAL_BOTTOM_VUE = textwrap.dedent("""\
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
""")


# ─── Main ─────────────────────────────────────────────────────────────────────


def main() -> None:
    if len(sys.argv) < 3:
        usage()

    deck_name = sys.argv[1]
    preset_name = sys.argv[2]

    if preset_name not in PRESETS:
        print(f"Error: unknown preset '{preset_name}'")
        print()
        print(f"Valid presets: {' '.join(VALID_PRESETS)}")
        sys.exit(1)

    deck_dir = DECKS_ROOT / deck_name

    if deck_dir.is_dir():
        print(f"Error: directory '{deck_name}' already exists in decks/.")
        sys.exit(1)

    p = PRESETS[preset_name]

    print(f"Creating deck '{deck_name}' with preset '{preset_name}'...")

    # ── Create directory structure ──
    (deck_dir / "styles").mkdir(parents=True)
    (deck_dir / "components").mkdir(parents=True)
    (deck_dir / "setup").mkdir(parents=True)
    (deck_dir / "composables").mkdir(parents=True)

    # ── Generate preset-specific files ──
    (deck_dir / "styles" / "tokens.css").write_text(generate_tokens_css(p))
    (deck_dir / "styles" / "theme.css").write_text(generate_theme_css(preset_name, p))
    (deck_dir / "styles" / "index.css").write_text(INDEX_CSS)
    (deck_dir / "slides.md").write_text(generate_slides_md(deck_name, p))
    (deck_dir / "deck.spec.md").write_text(generate_deck_spec_md(deck_name, preset_name, p))

    # ── global-bottom.vue (not in skill dir, generated inline) ──
    (deck_dir / "global-bottom.vue").write_text(GLOBAL_BOTTOM_VUE)

    # ── Copy universal scaffold files from the skill directory ──
    for dest_rel, src_rel in SCAFFOLD_COPIES.items():
        src = SKILL_DIR / src_rel
        dst = deck_dir / dest_rel
        if not src.is_file():
            print(f"Warning: scaffold source not found: {src}")
            continue
        shutil.copy2(src, dst)

    # ── Summary ──
    created_files = [
        f"decks/{deck_name}/slides.md",
        f"decks/{deck_name}/deck.spec.md",
        f"decks/{deck_name}/styles/index.css",
        f"decks/{deck_name}/styles/tokens.css",
        f"decks/{deck_name}/styles/theme.css",
        f"decks/{deck_name}/styles/transitions.css",
        f"decks/{deck_name}/composables/useHelp.ts",
        f"decks/{deck_name}/setup/shortcuts.ts",
        f"decks/{deck_name}/setup/mermaid-renderer.ts",
        f"decks/{deck_name}/components/KeyboardHelp.vue",
        f"decks/{deck_name}/global-top.vue",
        f"decks/{deck_name}/global-bottom.vue",
    ]

    print()
    print(f"Deck '{deck_name}' created successfully with preset '{preset_name}'.")
    print()
    print("Files created:")
    for f in created_files:
        print(f"  {f}")
    print()
    print("Next steps:")
    print(f"  1. Edit deck.spec.md — fill in purpose, audience, tone, and slide plan")
    print(f"  2. Edit slides.md — build your slides")
    print(f"  3. Preview:  cd decks/{deck_name} && npx slidev")
    print(f"  4. Build:    npm run build   # builds all decks, including decks/{deck_name}")


if __name__ == "__main__":
    main()

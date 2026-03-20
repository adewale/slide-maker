import { renderMermaidSVG } from 'beautiful-mermaid'

export default () => {
  return (code: string) => {
    const s = getComputedStyle(document.documentElement)
    const v = (prop: string) => s.getPropertyValue(prop).trim()
    return renderMermaidSVG(code, {
      bg: v('--deck-bg') || '#1C1B1F',
      fg: v('--deck-fg') || '#E6E1E5',
      accent: v('--deck-accent') || undefined,
      muted: v('--deck-muted') || undefined,
      transparent: true,
    })
  }
}

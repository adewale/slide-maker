import { renderMermaidSVG } from 'beautiful-mermaid'

export default () => {
  return (code: string) => {
    const s = getComputedStyle(document.documentElement)
    const v = (prop: string) => s.getPropertyValue(prop).trim()
    return renderMermaidSVG(code, {
      bg: v('--deck-bg') || '#0a0a0f',
      fg: v('--deck-fg') || '#e8e6e1',
      accent: v('--deck-accent') || undefined,
      muted: v('--deck-muted') || undefined,
      transparent: true,
    })
  }
}

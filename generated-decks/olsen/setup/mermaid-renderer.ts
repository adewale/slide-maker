import { renderMermaidSVG } from 'beautiful-mermaid'

export default () => {
  return (code: string) => {
    const s = getComputedStyle(document.documentElement)
    const v = (prop: string) => s.getPropertyValue(prop).trim()
    return renderMermaidSVG(code, {
      bg: v('--deck-bg') || '#ffffff',
      fg: v('--deck-fg') || '#27272a',
      accent: v('--deck-accent') || undefined,
      muted: v('--deck-muted') || undefined,
      transparent: true,
    })
  }
}

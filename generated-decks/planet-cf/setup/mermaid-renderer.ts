import { defineMermaidRendererSetup } from '@slidev/types'
import { renderMermaid } from 'beautiful-mermaid'

export default defineMermaidRendererSetup(() => {
  return (code, _options) => renderMermaid(code)
})

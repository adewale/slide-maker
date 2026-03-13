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

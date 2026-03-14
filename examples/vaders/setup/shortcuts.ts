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
        const b = import.meta.env.BASE_URL || '/'
        const isHash = location.hash.startsWith('#')
        window.open(isHash ? `${b}#/presenter` : `${b}presenter/`, '_blank')
      },
      autoRepeat: false,
    },
  ]
})

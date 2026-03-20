import { defineShortcutsSetup } from '@slidev/types'
import { toggleHelp } from '../composables/useHelp'

export default defineShortcutsSetup((nav, base) => {
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
    {
      key: ']',
      fn: () => nav.nextSlide(),
      autoRepeat: true,
    },
    {
      key: '[',
      fn: () => nav.prevSlide(),
      autoRepeat: true,
    },
  ]
})

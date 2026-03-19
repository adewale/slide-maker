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
        const b = import.meta.env.BASE_URL || '/'
        const isHash = location.hash.startsWith('#')
        window.open(isHash ? `${b}#/presenter` : `${b}presenter/`, '_blank')
      },
      autoRepeat: false,
    },
    {
      key: ']',
      fn: () => nav.nextSlide(true),
      autoRepeat: true,
    },
    {
      key: '[',
      fn: () => nav.prevSlide(true),
      autoRepeat: true,
    },
  ]
})

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
        const url = location.href.replace(/\/(slide-maker\/)?/, '/slide-maker/presenter/')
        window.open(url, '_blank')
      },
      autoRepeat: false,
    },
  ]
})

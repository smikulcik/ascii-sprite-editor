import { useEffect } from 'react'
import { 
  getHotkeyAction, 
  HotkeyAction, 
  HotkeyConfig, 
  DEFAULT_HOTKEYS 
} from '../config/hotkeys'

interface UseHotkeysOptions {
  enabled?: boolean
  config?: HotkeyConfig
}

type HotkeyHandler = (action: HotkeyAction, event: KeyboardEvent) => void

/**
 * Hook to register global hotkey handlers
 * 
 * @param handler - Callback function that receives the hotkey action and event
 * @param options - Configuration options
 * 
 * @example
 * useHotkeys((action, event) => {
 *   if (action === 'tool:pencil') {
 *     setActiveTool('pencil')
 *     event.preventDefault()
 *   }
 * })
 */
export function useHotkeys(
  handler: HotkeyHandler,
  options: UseHotkeysOptions = {}
) {
  const { enabled = true, config = DEFAULT_HOTKEYS } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input or textarea
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      const action = getHotkeyAction(event, config)
      if (action) {
        handler(action, event)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handler, enabled, config])
}

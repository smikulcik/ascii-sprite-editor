/**
 * Default hotkey configuration for the ASCII Sprite Editor
 * Users can customize these in the future via settings
 */

export type HotkeyAction = 
  | 'tool:pencil'
  | 'tool:box'
  | 'tool:type'
  | 'tool:eraser'
  | 'undo'
  | 'redo'
  | 'toggle-grid'
  | 'toggle-onion-skin'

export interface HotkeyBinding {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
}

export interface HotkeyConfig {
  'tool:pencil'?: HotkeyBinding[]
  'tool:box'?: HotkeyBinding[]
  'tool:type'?: HotkeyBinding[]
  'tool:eraser'?: HotkeyBinding[]
  'undo'?: HotkeyBinding[]
  'redo'?: HotkeyBinding[]
  'toggle-grid'?: HotkeyBinding[]
  'toggle-onion-skin'?: HotkeyBinding[]
}

export const DEFAULT_HOTKEYS: HotkeyConfig = {
  'tool:pencil': [{ key: 'p', ctrlKey: true }, { key: 'p', metaKey: true }],
  'tool:box': [{ key: 'b', ctrlKey: true }, { key: 'b', metaKey: true }],
  'tool:type': [{ key: 't', ctrlKey: true }, { key: 't', metaKey: true }],
  'tool:eraser': [{ key: 'e', ctrlKey: true }, { key: 'e', metaKey: true }],
  'undo': [{ key: 'z', ctrlKey: true }, { key: 'z', metaKey: true }],
  'redo': [{ key: 'y', ctrlKey: true }, { key: 'y', metaKey: true }],
  'toggle-grid': [{ key: 'g', ctrlKey: true }, { key: 'g', metaKey: true }],
  'toggle-onion-skin': [{ key: 'o', ctrlKey: true }, { key: 'o', metaKey: true }],
}

/**
 * Check if a keyboard event matches a hotkey binding
 */
export function matchesBinding(event: KeyboardEvent, binding: HotkeyBinding): boolean {
  const keyMatch = event.key.toLowerCase() === binding.key.toLowerCase()
  
  // For ctrl/meta, check if the binding requires one and the event has one
  const requiresCtrlOrMeta = binding.ctrlKey || binding.metaKey
  const hasCtrlOrMeta = event.ctrlKey || event.metaKey
  const ctrlMatch = requiresCtrlOrMeta ? hasCtrlOrMeta : !hasCtrlOrMeta
  
  const shiftMatch = event.shiftKey === (binding.shiftKey || false)
  const altMatch = event.altKey === (binding.altKey || false)

  return keyMatch && ctrlMatch && shiftMatch && altMatch
}

/**
 * Get the hotkey action from a keyboard event
 */
export function getHotkeyAction(
  event: KeyboardEvent,
  config: HotkeyConfig = DEFAULT_HOTKEYS
): HotkeyAction | null {
  for (const [action, bindings] of Object.entries(config)) {
    if (bindings && bindings.some((binding: HotkeyBinding) => matchesBinding(event, binding))) {
      return action as HotkeyAction
    }
  }
  return null
}

/**
 * Format a hotkey binding for display
 */
export function formatHotkey(binding: HotkeyBinding): string {
  const parts: string[] = []
  if (binding.ctrlKey) parts.push('Ctrl')
  if (binding.shiftKey) parts.push('Shift')
  if (binding.altKey) parts.push('Alt')
  if (binding.metaKey) parts.push('Cmd')
  parts.push(binding.key.toUpperCase())
  return parts.join('+')
}

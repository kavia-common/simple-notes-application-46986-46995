import { onMounted, onBeforeUnmount } from 'vue'

type Handlers = {
  onNew?: () => void
  onSave?: () => void
}

// PUBLIC_INTERFACE
export function useKeyboardShortcuts(handlers: Handlers) {
  /** Registers global keyboard shortcuts: Cmd/Ctrl+N for new note, Cmd/Ctrl+S to save (prevents default). */
  function keydown(e: KeyboardEvent) {
    const isMac = navigator.platform.toUpperCase().includes('MAC')
    const mod = isMac ? e.metaKey : e.ctrlKey

    if (mod && (e.key === 'n' || e.key === 'N')) {
      e.preventDefault()
      handlers.onNew?.()
    }
    if (mod && (e.key === 's' || e.key === 'S')) {
      e.preventDefault()
      handlers.onSave?.()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', keydown)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', keydown)
  })
}

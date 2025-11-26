import { ref, watch } from 'vue'

export type Note = {
  id: string
  title: string
  content: string
  updatedAt: string
}

const STORAGE_KEY = 'notes-app:v1'
const SELECTED_KEY = 'notes-app:selected'

function uuid(): string {
  // Simple UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Load notes array from localStorage
 */
function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Note[]
    // Basic validation/coercion
    return parsed
      .filter(n => !!n && typeof n.id === 'string')
      .map(n => ({
        id: n.id,
        title: n.title ?? 'Untitled',
        content: n.content ?? '',
        updatedAt: n.updatedAt ?? new Date().toISOString()
      }))
  } catch {
    return []
  }
}

/**
 * Persist notes array to localStorage
 */
function saveNotes(list: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function loadSelected(): string | null {
  try {
    return localStorage.getItem(SELECTED_KEY)
  } catch {
    return null
  }
}

function saveSelected(id: string | null) {
  if (id) localStorage.setItem(SELECTED_KEY, id)
  else localStorage.removeItem(SELECTED_KEY)
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** This composable manages notes stored in localStorage and provides CRUD helpers and selection state. */
  const notes = ref<Note[]>([])
  const selectedId = ref<string | null>(null)

  // Initialize on first usage (client-only)
  if (process.client) {
    notes.value = loadNotes()
    selectedId.value = loadSelected()
  }

  // Persist on changes
  watch(notes, (val) => {
    if (process.client) saveNotes(val)
  }, { deep: true })

  watch(selectedId, (val) => {
    if (process.client) saveSelected(val)
  })

  // PUBLIC_INTERFACE
  function listNotes(): Note[] {
    /** Returns a snapshot array of all notes. */
    return [...notes.value]
  }

  // PUBLIC_INTERFACE
  function getNote(id: string): Note | undefined {
    /** Returns a note by id, if present. */
    return notes.value.find(n => n.id === id)
  }

  // PUBLIC_INTERFACE
  function getNoteById(id: string): Note | undefined {
    /** Alias for getNote; maintained for readability in components. */
    return getNote(id)
  }

  // PUBLIC_INTERFACE
  function addNote(): string {
    /** Adds a new note with default title and returns its id. */
    const id = uuid()
    const now = new Date().toISOString()
    const newNote: Note = {
      id,
      title: 'Untitled',
      content: '',
      updatedAt: now
    }
    notes.value = [newNote, ...notes.value]
    selectedId.value = id
    return id
  }

  // PUBLIC_INTERFACE
  function updateNote(id: string, payload: Partial<Pick<Note, 'title' | 'content'>>) {
    /** Updates a note's title/content and refreshes updatedAt. */
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx === -1) return
    const updated: Note = {
      ...notes.value[idx],
      ...payload,
      updatedAt: new Date().toISOString()
    }
    // Replace and move to top if updatedAt changed
    const clone = [...notes.value]
    clone.splice(idx, 1)
    notes.value = [updated, ...clone]
  }

  // PUBLIC_INTERFACE
  function deleteNote(id: string) {
    /** Deletes a note by id. */
    notes.value = notes.value.filter(n => n.id !== id)
    if (selectedId.value === id) {
      selectedId.value = null
    }
  }

  // PUBLIC_INTERFACE
  function selectNote(id: string | null) {
    /** Sets selected note id. */
    selectedId.value = id
  }

  return {
    notes,
    selectedId,
    listNotes,
    getNote,
    getNoteById,
    addNote,
    updateNote,
    deleteNote,
    selectNote
  }
}

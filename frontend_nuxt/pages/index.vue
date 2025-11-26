<template>
  <div class="container">
    <header class="app-header">
      <h1 class="app-title">Simple Notes</h1>
      <div class="header-actions">
        <button
          class="btn btn-primary"
          @click="handleCreate"
          aria-label="Create new note"
          data-testid="create-button"
        >
          New Note
          <span class="kbd">⌘/Ctrl + N</span>
        </button>
      </div>
    </header>

    <main class="layout">
      <section class="pane list-pane" aria-label="Notes list">
        <div class="list-toolbar">
          <div class="search-wrap">
            <input
              v-model="query"
              type="text"
              class="input"
              placeholder="Search notes..."
              aria-label="Search notes by title or content"
              data-testid="search-input"
            />
          </div>
          <div class="sort-wrap">
            <label class="sort-label" for="sort">Sort</label>
            <select id="sort" v-model="sort" class="select" aria-label="Sort notes">
              <option value="updated_desc">Last edited</option>
              <option value="updated_asc">Oldest first</option>
              <option value="title_asc">Title (A-Z)</option>
              <option value="title_desc">Title (Z-A)</option>
            </select>
          </div>
        </div>

        <NoteList
          :notes="filteredAndSorted"
          :active-id="selectedId"
          @select="handleSelect"
        />
      </section>

      <section class="pane editor-pane" aria-label="Note editor">
        <NoteEditor
          v-if="activeNote"
          :note="activeNote"
          :saving="saving"
          @update="handleUpdate"
          @delete="() => openDelete(activeNote!.id)"
        />
        <div v-else class="empty-state">
          <p>No note selected. Create a new note or choose one from the list.</p>
        </div>
      </section>
    </main>

    <ConfirmModal
      v-if="confirmOpen"
      :title="'Delete note'"
      :message="'Are you sure you want to delete this note? This action cannot be undone.'"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="confirmDelete"
      @cancel="confirmOpen = false"
      data-testid="delete-confirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import NoteList from '~/components/NoteList.vue'
import NoteEditor from '~/components/NoteEditor.vue'
import ConfirmModal from '~/components/ConfirmModal.vue'
import { useNotes } from '~/composables/useNotes'
import { useKeyboardShortcuts } from '~/composables/useKeyboardShortcuts'

const {
  notes,
  selectedId,
  selectNote,
  addNote,
  updateNote,
  deleteNote,
  getNoteById
} = useNotes()

const query = ref('')
const sort = ref<'updated_desc' | 'updated_asc' | 'title_asc' | 'title_desc'>('updated_desc')
const saving = ref(false)

const activeNote = computed(() => {
  if (!selectedId.value) return null
  return getNoteById(selectedId.value) || null
})

const filteredAndSorted = computed(() => {
  const q = query.value.trim().toLowerCase()
  let list = notes.value

  if (q) {
    list = list.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.content || '').toLowerCase().includes(q)
    )
  }

  const sorted = [...list]
  switch (sort.value) {
    case 'updated_asc':
      sorted.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      break
    case 'title_asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title_desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title))
      break
    default:
      sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }
  return sorted
})

function handleSelect(id: string) {
  selectNote(id)
}

async function handleCreate() {
  const id = addNote()
  selectNote(id)
}

async function handleUpdate(payload: { id: string; title: string; content: string }) {
  saving.value = true
  updateNote(payload.id, { title: payload.title, content: payload.content })
  // small delay to show Saved indicator
  window.setTimeout(() => (saving.value = false), 300)
}

const confirmOpen = ref(false)
const toDeleteId = ref<string | null>(null)
function openDelete(id: string) {
  toDeleteId.value = id
  confirmOpen.value = true
}
function confirmDelete() {
  if (toDeleteId.value) {
    deleteNote(toDeleteId.value)
    if (selectedId.value === toDeleteId.value) {
      selectNote(null)
    }
  }
  toDeleteId.value = null
  confirmOpen.value = false
}

// Keyboard shortcuts
useKeyboardShortcuts({
  onNew: () => {
    handleCreate()
  },
  onSave: () => {
    if (activeNote.value) {
      // Since auto-save occurs on input, onSave is a no-op besides preventing default.
      saving.value = true
      window.setTimeout(() => (saving.value = false), 250)
    }
  }
})

// Keep selectedId valid if note removed externally
watch(notes, (n) => {
  if (selectedId.value && !n.find(x => x.id === selectedId.value)) {
    selectNote(n[0]?.id || null)
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.app-title {
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--color-text);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.kbd {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0 0.4rem;
  border-radius: 0.375rem;
  background: #e5e7eb;
  color: #374151;
  font-size: 0.75rem;
  border: 1px solid #d1d5db;
}

.btn {
  appearance: none;
  border: 1px solid transparent;
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition), background var(--transition), border-color var(--transition);
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn:active {
  transform: translateY(0);
}
.btn-primary {
  background: var(--color-primary);
  color: white;
}
.btn-primary:hover {
  filter: brightness(1.05);
}
.btn-danger {
  background: var(--color-error);
  color: white;
}

.input, .select {
  width: 100%;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid #e5e7eb;
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm) inset;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.input:focus, .select:focus {
  border-color: var(--color-primary);
  box-shadow: var(--ring);
}

.layout {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 1rem;
  min-height: calc(100vh - 140px);
}

.pane {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.list-pane {
  padding: 0.75rem;
}

.list-toolbar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}
.search-wrap {
  flex: 1;
}
.sort-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.sort-label {
  font-size: 0.85rem;
  color: #4b5563;
}

.editor-pane {
  padding: 0.75rem;
}
.empty-state {
  flex: 1;
  display: grid;
  place-items: center;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="editor">
    <div class="editor-bar">
      <input
        v-model="localTitle"
        class="title-input"
        type="text"
        placeholder="Title"
        aria-label="Note title"
        data-testid="editor-title"
        @input="triggerUpdate"
      />
      <div class="bar-actions">
        <span class="saved" :class="{ visible: saving }">Saved</span>
        <button
          class="btn btn-danger"
          @click="$emit('delete')"
          aria-label="Delete note"
        >
          Delete
        </button>
      </div>
    </div>

    <textarea
      v-model="localContent"
      class="content-input"
      placeholder="Start typing..."
      aria-label="Note content"
      data-testid="editor-content"
      @input="triggerUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import type { Note } from '~/composables/useNotes'

const props = defineProps<{
  note: Note
  saving?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', payload: { id: string, title: string, content: string }): void
  (e: 'delete'): void
}>()

const localTitle = ref(props.note.title)
const localContent = ref(props.note.content)

watch(() => props.note.id, async () => {
  localTitle.value = props.note.title
  localContent.value = props.note.content
  await nextTick()
  // Focus title when switching to a different note
  const titleEl = document.querySelector<HTMLInputElement>('[data-testid="editor-title"]')
  titleEl?.focus()
})

watch(() => props.note.title, (v) => { if (v !== localTitle.value) localTitle.value = v })
watch(() => props.note.content, (v) => { if (v !== localContent.value) localContent.value = v })

function triggerUpdate() {
  emit('update', {
    id: props.note.id,
    title: localTitle.value,
    content: localContent.value
  })
}
</script>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  height: 100%;
}

.editor-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.title-input {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-md);
  padding: 0.6rem 0.75rem;
  box-shadow: var(--shadow-sm) inset;
  transition: border-color var(--transition), box-shadow var(--transition);
}
.title-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--ring);
}

.bar-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.saved {
  color: #22c55e;
  opacity: 0;
  transform: translateY(-2px);
  transition: opacity var(--transition), transform var(--transition);
  font-weight: 600;
}
.saved.visible {
  opacity: 1;
  transform: translateY(0);
}

.btn {
  appearance: none;
  border: 1px solid transparent;
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition), background var(--transition);
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-danger {
  background: var(--color-error);
  color: white;
}

.content-input {
  flex: 1;
  min-height: 50vh;
  resize: vertical;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-lg);
  padding: 0.75rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
  box-shadow: var(--shadow-sm) inset;
}
.content-input:focus {
  border-color: var(--color-primary);
  box-shadow: var(--ring);
}
</style>

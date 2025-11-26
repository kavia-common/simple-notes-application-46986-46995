<template>
  <div class="note-list" role="list">
    <NoteListItem
      v-for="n in notes"
      :key="n.id"
      :note="n"
      :active="n.id === activeId"
      @click="() => $emit('select', n.id)"
      data-testid="note-item"
    />
    <div v-if="!notes.length" class="empty">
      <p>No notes found.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import NoteListItem from './NoteListItem.vue'
import type { Note } from '~/composables/useNotes'

defineProps<{
  notes: Note[]
  activeId: string | null
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()
</script>

<style scoped>
.note-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  max-height: calc(100vh - 240px);
  overflow: auto;
  padding-right: 0.25rem;
}

.empty {
  display: grid;
  place-items: center;
  color: #6b7280;
  padding: 1rem 0.5rem;
}
</style>

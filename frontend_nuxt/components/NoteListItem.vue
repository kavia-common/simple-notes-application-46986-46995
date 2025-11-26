<template>
  <button
    class="item"
    :class="{ active }"
    @click="$emit('click')"
    :aria-pressed="active ? 'true' : 'false'"
    :aria-label="`Open note ${note.title || 'Untitled'}`"
    data-testid="note-item"
  >
    <div class="row">
      <h3 class="title">{{ note.title || 'Untitled' }}</h3>
      <time class="time" :datetime="note.updatedAt">
        {{ friendlyTime(note.updatedAt) }}
      </time>
    </div>
    <p class="preview">
      {{ (note.content || '').slice(0, 80) || 'No content' }}
    </p>
  </button>
</template>

<script setup lang="ts">
import type { Note } from '~/composables/useNotes'

defineProps<{
  note: Note
  active?: boolean
}>()

function friendlyTime(iso: string): string {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString()
}
</script>

<style scoped>
.item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-md);
  padding: 0.6rem 0.7rem;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition), border-color var(--transition), box-shadow var(--transition), transform var(--transition);
  box-shadow: var(--shadow-sm);
}
.item:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  border-color: #d1d5db;
}
.item.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
  background: #f8fbff;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
}
.title {
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}
.time {
  color: #6b7280;
  font-size: 0.8rem;
}
.preview {
  color: #475569;
  font-size: 0.9rem;
  margin: 0.25rem 0 0 0;
}
</style>

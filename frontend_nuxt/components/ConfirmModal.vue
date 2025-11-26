<template>
  <div class="overlay" role="dialog" aria-modal="true" :aria-labelledby="titleId">
    <div class="modal">
      <header class="modal-header">
        <h2 :id="titleId">{{ title }}</h2>
      </header>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <footer class="modal-footer">
        <button class="btn" @click="$emit('cancel')" aria-label="Cancel deletion">{{ cancelText }}</button>
        <button class="btn btn-danger" @click="$emit('confirm')" aria-label="Confirm deletion" data-testid="delete-confirm"> {{ confirmText }} </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const titleId = computed(() => `modal-title-${Math.random().toString(36).slice(2)}`)
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 50;
}
.modal {
  background: var(--color-surface);
  color: var(--color-text);
  width: 100%;
  max-width: 440px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
.modal-header {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-body {
  padding: 1rem;
}
.modal-footer {
  padding: 0.9rem 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  appearance: none;
  border: 1px solid #e5e7eb;
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition), box-shadow var(--transition);
}
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
.btn-danger {
  background: var(--color-error);
  color: white;
  border-color: transparent;
}
</style>

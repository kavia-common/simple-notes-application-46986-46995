<template>
  <div class="min-h-screen bg-gradient-to-br from-[#dbeafe] to-[#f9fafb] text-gray-900">
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
/**
 * Root app wrapper for the Notes application.
 * Sets up a subtle gradient background and renders the main page.
 */
</script>

<style>
:root {
  /* Ocean Professional Theme Variables */
  --color-primary: #2563EB; /* blue-600 */
  --color-secondary: #F59E0B; /* amber-500 */
  --color-success: #F59E0B; /* amber-500 as success accent */
  --color-error: #EF4444; /* red-500 */
  --color-bg: #f9fafb; /* gray-50 */
  --color-surface: #ffffff; /* white */
  --color-text: #111827; /* gray-900 */
  --ring: 0 0 0 3px rgba(37, 99, 235, 0.35);

  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 10px rgba(0,0,0,0.08);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.10);

  --transition: 180ms ease;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html, body, #__nuxt {
  height: 100%;
}

button, input, textarea {
  font: inherit;
}

a, button {
  outline: none;
}
a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible {
  box-shadow: var(--ring);
  border-color: var(--color-primary);
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>

<script setup lang="ts">
import type { Comment } from '@/types'

interface Props {
  comment: Comment
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [commentId: number]
}>()

const handleDelete = () => {
  emit('delete', props.comment.id)
}
</script>

<template>
  <article class="message is-small">
    <div class="message-header">
      <a :href="`mailto:${comment.email}`" class="has-text-white">{{ comment.name }}</a>

      <button
        type="button"
        class="delete is-small"
        aria-label="delete"
        @click="handleDelete"
      ></button>
    </div>
    <div class="message-body">
      {{ comment.body }}
    </div>
  </article>
</template>

<style scoped>
.message {
  opacity: 0;
  animation: fadeIn 0.3s ease-in forwards;
}

.message:not(:last-child) {
  margin-bottom: 1.5rem;
}

.message-header {
  background-color: #4a4a4a;
  border-radius: 4px 4px 0 0;
  font-weight: 700;
  padding: 0.75em 1em;
}

.delete.is-small {
  background-color: #0a0a0a33;
}

.message-body {
  border-color: #dbdbdb;
  border-radius: 4px;
  color: #4a4a4a;
  padding: 1.25em 1.5em;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

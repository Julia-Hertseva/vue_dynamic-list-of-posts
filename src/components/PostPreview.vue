<script setup lang="ts">
import type { Post } from '@/types'

defineProps<{
  post?: Post
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()

const handleEditClick = () => {
  emit('edit')
}

const handleDeleteClick = () => {
    emit('delete')
}
</script>

<template>
  <div class="block">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <h2 v-if="post">#{{ post.id }}: {{ post.title }}</h2>
      <h2 v-else>#post id: Post Title</h2>
      <div class="is-flex">
        <span
          class="icon is-small is-right is-clickable"
          @click="handleEditClick"
          title="Edit post"
        >
          <i class="fas fa-pen-to-square"></i>
        </span>
        <span
          class="icon is-small is-right has-text-danger is-clickable ml-3"
          @click="handleDeleteClick"
          title="Delete post"
        >
          <i class="fas fa-trash"></i>
        </span>
      </div>
    </div>
    <p v-if="post">{{ post.body }}</p>
    <p v-else>Post body</p>
  </div>
</template>

<style>
  .has-text-danger {
    color: #f14668 !important;
}
</style>

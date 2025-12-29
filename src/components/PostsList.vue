<script setup lang="ts">
import type { Post } from '@/types'

const props = defineProps<{
  posts: Post[]
  isSidebarOpen?: boolean
  currentPostId?: number | null
}>()

const emit = defineEmits<{
  'open-post': [post: Post]
  'close-post': []
  'create-post': []
}>()

const handlePostClick = (post: Post) => {
  if (props.currentPostId === post.id) {
    emit('close-post')
  } else {
    emit('open-post', post)
  }
}

const handleCreatePost = () => {
  emit('create-post')
}

const isPostOpen = (postId: number) => {
  return props.currentPostId === postId
}

const hasOpenPost = () => {
  return props.currentPostId !== null
}
</script>

<template>
  <div
    class="tile is-parent"
    :class="{
      'is-6': isSidebarOpen,
      'is-12': !isSidebarOpen,
      'PostsList--shrinked': isSidebarOpen,
    }"
  >
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button
            type="button"
            class="button is-link"
            @click="handleCreatePost"
            :class="{ 'is-light': isSidebarOpen && !hasOpenPost() }"
          >
            Add New Post
          </button>
        </div>

        <table class="table is-fullwidth is-striped is-hoverable is-narrow">
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button
                  type="button"
                  class="button"
                  :class="isPostOpen(post.id) ? 'is-link' : 'is-link is-light'"
                  @click="handlePostClick(post)"
                >
                  {{ isPostOpen(post.id) ? 'Close' : 'Open' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
.tile.is-parent {
  transition: all 0.5s ease-in-out;
}

.tile.is-parent.is-6 {
  width: 50%;
}

.tile.is-parent.is-12 {
  width: 100%;
}

.PostsList--shrinked {
  transition: all 0.5s ease-in-out;
}

.has-background-link-light {
  background-color: #eff1fa !important;
}
</style>

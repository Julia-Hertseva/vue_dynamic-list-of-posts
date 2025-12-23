<script setup lang="ts">
import PostPreview from './PostPreview.vue'
import NoComments from './NoComments.vue'
import WriteCommentBtn from './WriteCommentBtn.vue'
import AddPost from './AddPost.vue'
import type { Post } from '@/types'

interface Props {
  isOpen: boolean
  post: Post | null
  isCreating: boolean
}

interface Emits {
  (e: 'create-post', title: string, body: string): void
  (e: 'cancel'): void
}

const { isOpen, post, isCreating } = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleCreatePost = (title: string, body: string) => {
  emit('create-post', title, body)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div
    class="tile is-parent Sidebar"
    :class="{
      'Sidebar--open': isOpen,
      'is-6': isOpen
    }"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <!-- Форма створення посту -->
        <AddPost
          v-if="isCreating"
          @submit="handleCreatePost"
          @cancel="handleCancel"
        />

        <!-- Деталі посту -->
        <div v-else-if="post">
          <PostPreview :post="post" />

          <!-- Коментарі -->
          <div class="block">
            <NoComments />
            <WriteCommentBtn />
          </div>
        </div>

        <!-- Повідомлення, якщо нічого не вибрано -->
        <div v-else-if="isOpen" class="has-text-centered" style="padding: 2rem;">
          <p class="title is-4">Select a post to view details</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity, padding, margin;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
  max-width: 0;
  padding: 0 !important;
  margin: 0 !important;
  width: 0;
}

@media (min-width: 769px) {
  .Sidebar--open {
    max-width: 50%;
    width: 50%;
    padding: 0.75rem !important;
    margin: 0 !important;
  }
}

.Sidebar--open {
  opacity: 1;
}
</style>

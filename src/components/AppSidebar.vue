<script setup lang="ts">
import { ref, watch, computed, reactive } from 'vue'
import PostPreview from './PostPreview.vue'
import NoComments from './NoComments.vue'
import WriteCommentBtn from './WriteCommentBtn.vue'
import AddPost from './AddPost.vue'
import CommentItem from './CommentItem.vue'
import PostLoader from './PostLoader.vue'
import CommentForm from './CommentForm.vue'
import * as commentsApi from '@/api/comments'
import type { Post, Comment } from '@/types'

interface Props {
  isOpen: boolean
  post: Post | null
  isCreating: boolean
  isEditing: boolean
}

interface Emits {
  (e: 'create-post', title: string, body: string): void
  (e: 'update-post', title: string, body: string): void
  (e: 'delete-post'): void
  (e: 'edit-post', post: Post): void
  (e: 'cancel'): void
}

const { isOpen, post, isCreating, isEditing } = defineProps<Props>()
const emit = defineEmits<Emits>()

const comments = ref<Comment[]>([])
const isLoadingComments = ref(false)
const commentsError = ref<string | null>(null)
const isWritingComment = ref(false)

const commentFormData = reactive({
  name: '',
  email: '',
})

const hasComments = computed(() => comments.value.length > 0)
const shouldShowNoComments = computed(
  () => !isLoadingComments.value && !commentsError.value && !hasComments.value,
)

const loadComments = async () => {
  if (!post?.id) {
    comments.value = []
    return
  }

  isLoadingComments.value = true
  commentsError.value = null

  try {
    comments.value = await commentsApi.getCommentsByPostId(post.id)
  } catch (error) {
    console.error('Error loading comments:', error)
    commentsError.value = 'Unable to load comments'
  } finally {
    isLoadingComments.value = false
  }
}

const handleCreatePost = (title: string, body: string) => {
  emit('create-post', title, body)
}

const handleUpdatePost = (title: string, body: string) => {
  emit('update-post', title, body)
}

const handleDeletePost = () => {
  emit('delete-post')
}

const handleEditPost = () => {
  if (post) {
    emit('edit-post', post)
  }
}

const handleCancel = () => {
  emit('cancel')
}

const handleWriteComment = () => {
  isWritingComment.value = true
}

const handleAddComment = async (name: string, email: string, body: string) => {
  if (!post?.id) return

  commentsError.value = null
  let optimisticCommentId: number | null = null

  try {
    const tempComment: Comment = {
      id: Date.now(),
      postId: post.id,
      name,
      email,
      body,
    }

    optimisticCommentId = tempComment.id
    comments.value = [...comments.value, tempComment]

    const newComment = await commentsApi.createComment({
      postId: post.id,
      name,
      email,
      body,
    })

    comments.value = comments.value.map(comment =>
      comment.id === optimisticCommentId ? newComment : comment
    )

    commentFormData.name = name
    commentFormData.email = email

  } catch (error) {
    console.error('Error creating comment:', error)

    if (optimisticCommentId) {
      comments.value = comments.value.filter(comment => comment.id !== optimisticCommentId)
    }

    commentsError.value = 'Failed to add comment. Please try again.'
  }
}

const handleCancelComment = () => {
  isWritingComment.value = false
  commentsError.value = null
}

const handleDeleteComment = async (commentId: number) => {
  let commentToDelete: Comment | undefined;

  try {
    commentToDelete = comments.value.find(c => c.id === commentId)

    comments.value = comments.value.filter((comment) => comment.id !== commentId)

    await commentsApi.deleteComment(commentId)

    commentsError.value = null
  } catch (error) {
    console.error('Error deleting comment:', error)

    if (commentToDelete) {
      comments.value = [...comments.value, commentToDelete]
    }

    commentsError.value = 'Failed to delete comment. Please try again.'
  }
}

watch(
  () => post,
  (newPost) => {
    if (newPost && !isCreating && !isEditing) {
      loadComments()
      isWritingComment.value = false
      commentFormData.name = ''
      commentFormData.email = ''
    } else {
      comments.value = []
      commentsError.value = null
      isWritingComment.value = false
      commentFormData.name = ''
      commentFormData.email = ''
    }
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="tile is-parent Sidebar"
    :class="{
      'Sidebar--open': isOpen,
      'is-6': isOpen,
    }"
  >
    <div class="tile is-child box is-success">
      <div class="content">
        <AddPost
          v-if="isCreating"
          :mode="'create'"
          @submit="handleCreatePost"
          @cancel="handleCancel"
        />

        <AddPost
          v-else-if="isEditing && post"
          :post="post"
          :mode="'edit'"
          @submit="handleUpdatePost"
          @cancel="handleCancel"
        />

        <div v-else-if="post">
          <PostPreview :post="post" @edit="handleEditPost" @delete="handleDeletePost" />

          <div class="block">
            <div v-if="commentsError" class="notification is-danger is-light mb-4">
              <button class="delete" @click="commentsError = null"></button>
              {{ commentsError }}
            </div>

            <PostLoader v-if="isLoadingComments" />

            <div v-else-if="hasComments">
              <CommentItem
                v-for="comment in comments"
                :key="comment.id"
                :comment="comment"
                @delete="handleDeleteComment"
              />
            </div>

            <NoComments v-if="shouldShowNoComments" />

            <CommentForm
              v-if="isWritingComment"
              :initial-name="commentFormData.name"
              :initial-email="commentFormData.email"
              @submit="handleAddComment"
              @cancel="handleCancelComment"
            />

            <div v-if="!isWritingComment" class="mt-4">
              <WriteCommentBtn @click="handleWriteComment" />
            </div>
          </div>
        </div>

        <div v-else-if="isOpen" class="has-text-centered" style="padding: 2rem">
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

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

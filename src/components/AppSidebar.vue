<script setup lang="ts">
import { ref, watch, computed, reactive } from 'vue'
import PostPreview from './PostPreview.vue'
import NoComments from './NoComments.vue'
import WriteCommentBtn from './WriteCommentBtn.vue'
import AddPost from './AddPost.vue'
import CommentItem from './CommentItem.vue'
import PostLoader from './PostLoader.vue'
import InputField from './InputField.vue'
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

const commentForm = reactive({
  name: '',
  email: '',
  body: '',
})

const commentErrors = reactive({
  name: '',
  email: '',
  body: '',
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

const clearAllErrors = () => {
  if (commentErrors.name || commentErrors.email || commentErrors.body) {
    commentErrors.name = ''
    commentErrors.email = ''
    commentErrors.body = ''
  }
}

const validateComment = () => {
  let isValid = true

  commentErrors.name = ''
  commentErrors.email = ''
  commentErrors.body = ''

  if (!commentForm.name.trim()) {
    commentErrors.name = 'Name is required'
    isValid = false
  }

  if (!commentForm.email.trim()) {
    commentErrors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(commentForm.email)) {
    commentErrors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!commentForm.body.trim()) {
    commentErrors.body = 'Comment is required'
    isValid = false
  }

  return isValid
}

const handleAddComment = async () => {
  if (!post?.id) return

  if (!validateComment()) {
    return
  }

  try {
    const newComment = await commentsApi.createComment({
      postId: post.id,
      name: commentForm.name,
      email: commentForm.email,
      body: commentForm.body,
    })

    comments.value = [...comments.value, newComment]

    commentForm.name = ''
    commentForm.email = ''
    commentForm.body = ''
    commentErrors.name = ''
    commentErrors.email = ''
    commentErrors.body = ''

    isWritingComment.value = false
  } catch (error) {
    console.error('Error creating comment:', error)
    commentsError.value = 'Failed to add comment'
  }
}

const handleCancelComment = () => {
  isWritingComment.value = false
  commentForm.name = ''
  commentForm.email = ''
  commentForm.body = ''
  commentErrors.name = ''
  commentErrors.email = ''
  commentErrors.body = ''
}

const handleDeleteComment = async (commentId: number) => {
  try {
    await commentsApi.deleteComment(commentId)
    comments.value = comments.value.filter((comment) => comment.id !== commentId)
  } catch (error) {
    console.error('Error deleting comment:', error)
    commentsError.value = 'Failed to delete comment'
  }
}

watch(
  () => post,
  (newPost) => {
    if (newPost && !isCreating && !isEditing) {
      loadComments()
      isWritingComment.value = false
      commentForm.name = ''
      commentForm.email = ''
      commentForm.body = ''
      commentErrors.name = ''
      commentErrors.email = ''
      commentErrors.body = ''
    } else {
      comments.value = []
      commentsError.value = null
      isWritingComment.value = false
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

            <div v-if="isWritingComment">
              <InputField
                :modelValue="commentForm.name"
                @update:modelValue="commentForm.name = $event"
                @input="clearAllErrors"
                label="Author Name"
                id="comment-name"
                type="text"
                placeholder="Name Surname"
                icon="user"
                :error="commentErrors.name"
                :required="true"
              />

              <InputField
                :modelValue="commentForm.email"
                @update:modelValue="commentForm.email = $event"
                @input="clearAllErrors"
                label="Author Email"
                id="comment-email"
                type="email"
                placeholder="Your Email"
                icon="envelope"
                :error="commentErrors.email"
                :required="true"
              />

              <div class="field">
                <label class="label" for="comment-body">Write Post Body</label>
                <div class="control">
                  <textarea
                    v-model="commentForm.body"
                    id="comment-body"
                    class="textarea"
                    :class="{ 'is-danger': commentErrors.body }"
                    placeholder="Comment"
                    rows="4"
                    @input="clearAllErrors"
                  ></textarea>
                </div>
                <p v-if="commentErrors.body" class="help is-danger">{{ commentErrors.body }}</p>
              </div>

              <div class="field is-grouped mt-4">
                <div class="control">
                  <button type="button" class="button is-link" @click="handleAddComment">
                    Add Comment
                  </button>
                </div>
                <div class="control">
                  <button
                    type="button"
                    class="button is-link is-light"
                    @click="handleCancelComment"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

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

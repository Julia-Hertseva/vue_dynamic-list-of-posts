<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import LayoutHeader from './components/LayoutHeader.vue'
import PostsList from './components/PostsList.vue'
import AppSidebar from './components/AppSidebar.vue'
import AppLoader from './components/AppLoader.vue'
import LoginForm from './components/LoginForm.vue'
import NeedToRegister from './components/NeedToRegister.vue'
import InputField from './components/InputField.vue'
import * as usersApi from './api/users'
import * as postsApi from './api/posts'
import type { User, Post } from './types'

const currentUser = ref<User | null>(null)
const isLoggedIn = computed(() => !!currentUser.value)

const authForm = ref({
  email: '',
  name: '',
  error: null as string | null,
  isLoading: false,
  isRegistering: false,
})

const posts = ref<Post[]>([])
const postsError = ref<string | null>(null)
const isPostsLoading = ref(false)

const sidebarState = ref({
  isOpen: false,
  mode: 'view' as 'view' | 'create' | 'edit',
  currentPost: null as Post | null,
})

const isSidebarOpen = computed(() => sidebarState.value.isOpen)
const isCreatingPost = computed(() => sidebarState.value.mode === 'create')
const isEditingPost = computed(() => sidebarState.value.mode === 'edit')
const currentPost = computed(() => sidebarState.value.currentPost)
const currentPostId = computed(() => currentPost.value?.id || null)

const openSidebar = (mode: 'view' | 'create' | 'edit', post: Post | null = null) => {
  sidebarState.value = {
    isOpen: true,
    mode,
    currentPost: post,
  }
}

const closeSidebar = () => {
  sidebarState.value = {
    isOpen: false,
    mode: 'view',
    currentPost: null,
  }
}

const openCreatePostForm = () => {
  openSidebar('create')
}

const openPost = (post: Post) => {
  openSidebar('view', post)
}

const closePost = () => {
  closeSidebar()
}

const editPost = (post: Post) => {
  openSidebar('edit', post)
}

const loadUser = () => {
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser)
    } catch (e) {
      console.error('Failed to load user:', e)
      localStorage.removeItem('currentUser')
    }
  }
}

const saveUser = (user: User) => {
  currentUser.value = user
  localStorage.setItem('currentUser', JSON.stringify(user))
}

const logout = () => {
  currentUser.value = null
  posts.value = []
  closeSidebar()
  localStorage.removeItem('currentUser')

  authForm.value = {
    email: '',
    name: '',
    error: null,
    isLoading: false,
    isRegistering: false,
  }
}

const createPost = async (title: string, body: string) => {
  if (!currentUser.value) return

  try {
    const newPost = await postsApi.createPost(currentUser.value.id, title, body)
    posts.value = [...posts.value, newPost]
    openSidebar('view', newPost)
  } catch (error) {
    console.error('Error creating post:', error)
    throw error
  }
}

const updatePost = async (title: string, body: string) => {
  if (!currentPost.value) return

  try {
    const updatedPost = await postsApi.updatePost(currentPost.value.id, { title, body })

    const index = posts.value.findIndex(post => post.id === updatedPost.id)
    if (index !== -1) {
      posts.value[index] = updatedPost
    }

    openSidebar('view', updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}

const deletePost = async () => {
  if (!currentPost.value) return

  try {
    await postsApi.deletePost(currentPost.value.id)

    posts.value = posts.value.filter(post => post.id !== currentPost.value!.id)

    closeSidebar()
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

const loadPosts = async () => {
  if (!currentUser.value) return

  isPostsLoading.value = true
  postsError.value = null

  try {
    posts.value = await postsApi.getPostsByUserId(currentUser.value.id)
  } catch (error) {
    console.error('Error loading posts:', error)
    postsError.value = 'Unable to load posts'
  } finally {
    isPostsLoading.value = false
  }
}

const handleLogin = async () => {
  if (!authForm.value.email.trim()) return

  authForm.value.error = null
  authForm.value.isLoading = true

  try {
    const user = await usersApi.getUserByEmail(authForm.value.email)

    if (!user) {
      authForm.value.isRegistering = true
      return
    }

    saveUser(user)
    loadPosts()
  } catch (error) {
    console.error('Login error:', error)
    authForm.value.error = 'Failed to login. Please try again.'
  } finally {
    authForm.value.isLoading = false
  }
}

const updateEmail = (value: string) => {
  authForm.value.email = value
  authForm.value.error = null
}

const handleRegister = async () => {
  if (!authForm.value.email.trim() || !authForm.value.name.trim()) {
    authForm.value.error = 'Please fill in all fields'
    return
  }

  authForm.value.isLoading = true

  try {
    const emailParts = authForm.value.email.split('@')
    const username = emailParts[0] || 'user'

    const user = await usersApi.createUser({
      name: authForm.value.name,
      email: authForm.value.email,
      username: username,
    })

    saveUser(user)
    loadPosts()
    authForm.value.isRegistering = false
  } catch (error) {
    console.error('Register error:', error)
    authForm.value.error = 'Failed to register. Please try again.'
  } finally {
    authForm.value.isLoading = false
  }
}

onMounted(() => {
  loadUser()

  if (isLoggedIn.value) {
    loadPosts()
  }
})
</script>

<template>
  <div id="app">
    <section v-if="!isLoggedIn" class="container is-flex is-justify-content-center">
      <div v-if="!authForm.isRegistering">
        <LoginForm
          :email="authForm.email"
          :isLoading="authForm.isLoading"
          :error="authForm.error"
          @update:email="updateEmail"
          @submit="handleLogin"
        />
      </div>

      <div v-else>
        <form class="box mt-5" @submit.prevent="handleRegister">
          <h1 class="title is-3">You need to register</h1>

          <InputField
            :modelValue="authForm.email"
            @update:modelValue="authForm.email = $event"
            label="Email"
            id="user-email"
            type="email"
            icon="envelope"
            :disabled="true"
          />

          <NeedToRegister
            :name="authForm.name"
            :isLoading="authForm.isLoading"
            @update:name="authForm.name = $event"
          />

          <div class="field">
            <div class="control">
              <button
                type="button"
                class="button is-primary"
                :class="{ 'is-loading': authForm.isLoading }"
                @click="handleRegister"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <div v-else>
      <LayoutHeader :userName="currentUser?.name || ''" @logout="logout" />

      <div class="section">
        <div class="container">
          <div v-if="postsError" class="notification is-danger">
            <button class="delete" @click="postsError = null"></button>
            {{ postsError }}
          </div>

          <div
            v-if="isPostsLoading"
            class="is-flex is-justify-content-center is-align-items-center"
            style="min-height: 200px"
          >
            <AppLoader />
          </div>

          <div
            v-else-if="!isPostsLoading && posts.length === 0 && !postsError"
            class="tile is-ancestor"
          >
            <div class="tile is-parent">
              <div class="tile is-child box is-success">
                <div class="block">
                  <div class="block is-flex is-justify-content-space-between is-align-items-center">
                    <p class="title">Posts</p>
                    <button
                      type="button"
                      class="button is-link"
                      @click="openCreatePostForm"
                      :class="{ 'is-light': isSidebarOpen && isCreatingPost }"
                    >
                      Add New Post
                    </button>
                  </div>
                  <p class="has-text-centered mt-2">No posts yet</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="posts.length > 0" class="tile is-ancestor equal-height-container">
            <PostsList
              :posts="posts"
        :is-sidebar-open="isSidebarOpen"
        :current-post-id="currentPostId"
        @open-post="openPost"
        @close-post="closePost"
        @create-post="openCreatePostForm"
        />

            <AppSidebar
              :is-open="isSidebarOpen"
              :post="currentPost"
              :is-creating="isCreatingPost"
              :is-editing="isEditingPost"
              @create-post="createPost"
              @update-post="updatePost"
              @delete-post="deletePost"
              @edit-post="editPost"
              @cancel="closeSidebar"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.title {
  font-weight: 500;
}

.label {
  color: #363636;
  font-size: 1rem;
  font-weight: 700;
}

.button {
  height: 2.5em !important;
  border-radius: 4px;
  margin-bottom: 0;
}

.button.is-primary {
  color: #fff;
  font-weight: 400;
}

.button.is-link {
  background-color: #485fc7;
  font-weight: 400;
}

.button.is-link:hover {
  background-color: #3e56c4;
}

.button.is-link.is-light {
  background-color: #eff1fa;
  color: #3850b7;
}

.button.is-link.is-light:hover {
  background-color: #e6e9f7;
}

.button.is-link.is-light:active,
.button.is-link.is-light.is-active {
  background-color: #dce0f4;
}

.button.is-link:focus:not(:active) {
  box-shadow: 0 0 0 0.125em #485fc740;
}

.control.has-icons-left:hover .icon {
  color: #dbdbdb !important;
}

.input {
  border-radius: 4px;
  box-shadow: inset 0 0.0625em 0.125em #0a0a0a0d;
}

.input:focus ~ .icon {
  color: #363636 !important;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: #485fc7;
  box-shadow: 0 0 0 0.125em #485fc740;
}

.box {
  background-color: #fff;
  border-radius: 6px;
  box-shadow:
    0 0.5em 1em -0.125em #0a0a0a1a,
    0 0 0 1px #0a0a0a05;
  color: #4a4a4a;
  display: block;
  padding: 1.25rem;
  height: 100%;
}

.tile.is-parent {
  padding: 0.75rem;
  transition: all 0.5s ease-in-out;
  height: 100%;
  display: flex;
}

.tile.is-child {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tile.is-ancestor {
  margin-left: -0.75rem !important;
  margin-right: -0.75rem !important;
  margin-top: -0.75rem !important;
  display: flex;
  flex-wrap: nowrap;
  min-height: min-content;
}

.equal-height-container {
  display: flex;
  align-items: stretch;
}

.equal-height-container .tile.is-parent {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  height: auto;
}

.equal-height-container .tile.is-child {
  flex: 1;
}
</style>

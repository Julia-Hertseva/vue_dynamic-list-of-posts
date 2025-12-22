<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LayoutHeader from './components/LayoutHeader.vue'
import PostsList from './components/PostsList.vue'
import AppLoader from './components/AppLoader.vue'
import LoginForm from './components/LoginForm.vue'
import NeedToRegister from './components/NeedToRegister.vue'
import * as usersApi from './api/users'
import * as postsApi from './api/posts'
import type { User, Post } from './types'

const currentUser = ref<User | null>(null)
const isLoggedIn = ref(false)

const email = ref('')
const name = ref('')
const loginError = ref<string | null>(null)
const isLoginLoading = ref(false)
const isRegistering = ref(false)

const posts = ref<Post[]>([])
const postsError = ref<string | null>(null)
const isPostsLoading = ref(false)

const loadUser = () => {
  const savedUser = localStorage.getItem('currentUser')
  if (savedUser) {
    try {
      currentUser.value = JSON.parse(savedUser)
      isLoggedIn.value = true
    } catch (e) {
      console.error('Failed to load user:', e)
      localStorage.removeItem('currentUser')
    }
  }
}

const saveUser = (user: User) => {
  currentUser.value = user
  isLoggedIn.value = true
  localStorage.setItem('currentUser', JSON.stringify(user))
}

const logout = () => {
  currentUser.value = null
  isLoggedIn.value = false
  posts.value = []
  localStorage.removeItem('currentUser')
  email.value = ''
  name.value = ''
  loginError.value = null
  isRegistering.value = false
}

const handleLogin = async () => {
  loginError.value = null

  if (!email.value.trim()) {
    return
  }

  isLoginLoading.value = true

  try {
    const user = await usersApi.getUserByEmail(email.value)

    if (!user) {
      isRegistering.value = true
      return
    }

    saveUser(user)
    loadPosts()
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = 'Failed to login. Please try again.'
  } finally {
    isLoginLoading.value = false
  }
}

const updateEmail = (value: string) => {
  email.value = value
  loginError.value = null
}

const handleRegister = async () => {
  if (!email.value.trim() || !name.value.trim()) {
    loginError.value = 'Please fill in all fields'
    return
  }

  isLoginLoading.value = true

  try {
    const emailParts = email.value.split('@')
    const username = emailParts[0] || 'user'

    const user = await usersApi.createUser({
      name: name.value,
      email: email.value,
      username: username,
    })

    saveUser(user)
    loadPosts()
    isRegistering.value = false
  } catch (error) {
    console.error('Register error:', error)
    loginError.value = 'Failed to register. Please try again.'
  } finally {
    isLoginLoading.value = false
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
      <div v-if="!isRegistering">
        <LoginForm
          :email="email"
          :isLoading="isLoginLoading"
          :error="loginError"
          @update:email="updateEmail"
          @submit="handleLogin"
        />
      </div>

      <div v-else>
        <form class="box mt-5" @submit.prevent="handleRegister">
          <h1 class="title is-3">You need to register</h1>
          <div class="field">
            <label class="label" for="user-email">Email</label>
            <div class="control has-icons-left">
              <input type="email" id="user-email" :value="email" class="input" disabled />

              <span class="icon is-small is-left">
                <i class="fas fa-envelope"></i>
              </span>
            </div>
          </div>

          <NeedToRegister :name="name" :isLoading="isLoginLoading" @update:name="name = $event" />

          <div class="field">
            <div class="control">
              <button
                type="button"
                class="button is-primary"
                :class="{ 'is-loading': isLoginLoading }"
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
                  <div class="block is-flex is-justify-content-space-between">
                    <p class="title">Posts</p>
                    <button type="button" class="button is-link">Add New Post</button>
                  </div>
                  <p class="has-text-centered mt-2">No posts yet</p>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="posts.length > 0" class="tile is-ancestor">
            <PostsList :posts="posts" />
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

.input:focus {
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
}

.tile.is-parent {
  padding: 0.75rem;
}

.tile.is-ancestor {
  margin-left: -0.75rem !important;
  margin-right: -0.75rem !important;
  margin-top: -0.75rem !important;
}
</style>

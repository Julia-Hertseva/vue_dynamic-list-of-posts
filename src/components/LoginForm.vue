<script setup lang="ts">
defineProps<{
  email: string
  isLoading?: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  'update:email': [value: string]
  submit: []
}>()

const handleSubmit = (event: Event) => {
  event.preventDefault()
  emit('submit')
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    const form = (event.target as HTMLElement).closest('form')
    if (form && form.checkValidity()) {
      emit('submit')
    }
  }
}
</script>

<template>
  <form class="box mt-5" @submit="handleSubmit">
    <h1 class="title is-3">Get your userId</h1>

    <div v-if="error" class="notification is-danger mb-4">
      {{ error }}
    </div>

    <div class="field">
      <label class="label" for="user-email">Email</label>
      <div class="control has-icons-left">
        <input
          type="email"
          id="user-email"
          :value="email"
          @input="emit('update:email', ($event.target as HTMLInputElement).value)"
          @keyup="handleKeyUp"
          class="input"
          placeholder="Enter your email"
          required
          :disabled="isLoading"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-envelope" />
        </span>
      </div>
    </div>

    <div class="field">
      <button
        type="submit"
        class="button is-primary"
        :class="{ 'is-loading': isLoading }"
        :disabled="isLoading"
      >
        Login
      </button>
    </div>
  </form>
</template>

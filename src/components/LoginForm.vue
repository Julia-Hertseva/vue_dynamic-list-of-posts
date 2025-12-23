<script setup lang="ts">
import InputField from './InputField.vue'

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

    <InputField
      :modelValue="email"
      @update:modelValue="emit('update:email', $event)"
      @keyup="handleKeyUp"
      label="Email"
      id="user-email"
      type="email"
      placeholder="Enter your email"
      icon="envelope"
      :disabled="isLoading"
      :required="true"
    />

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

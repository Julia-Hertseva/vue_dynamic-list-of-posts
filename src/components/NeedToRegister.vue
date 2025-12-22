<script setup lang="ts">
defineProps<{
  name: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:name': [value: string]
}>()
</script>

<template>
  <div class="field">
    <label class="label" for="user-name">Your Name</label>

    <div class="control has-icons-left">
      <input
        type="text"
        id="user-name"
        :value="name"
        @input="emit('update:name', ($event.target as HTMLInputElement).value)"
        class="input"
        placeholder="Enter your name"
        required
        minlength="4"
        :disabled="isLoading"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
    </div>
  </div>
</template>

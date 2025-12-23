<script setup lang="ts">
import InputField from './InputField.vue'

defineProps<{
  name: string
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'update:name': [value: string]
}>()
</script>

<template>
  <InputField
    :modelValue="name"
    @update:modelValue="emit('update:name', $event)"
    label="Your Name"
    id="user-name"
    type="text"
    placeholder="Enter your name"
    icon="user"
    :disabled="isLoading"
    :required="true"
    :minlength="4"
  />
</template>

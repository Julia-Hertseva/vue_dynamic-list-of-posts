<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

defineProps<{
  modelValue: string
  label: string
  id: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  rows?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="field">
    <label class="label" :for="id">{{ label }}</label>
    <div class="control">
      <textarea
        v-bind="$attrs"
        :id="id"
        :value="modelValue"
        @input="handleInput"
        class="textarea"
        :class="{ 'is-danger': error }"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows || 4"
      ></textarea>
    </div>

    <p v-if="error" class="help is-danger">{{ error }}</p>
  </div>
</template>

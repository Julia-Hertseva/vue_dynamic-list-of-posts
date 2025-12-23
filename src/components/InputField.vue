<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

defineProps<{
  modelValue: string
  label: string
  id: string
  type?: string
  placeholder?: string
  icon?: string
  error?: string
  disabled?: boolean
  required?: boolean
  minlength?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="field">
    <label class="label" :for="id">{{ label }}</label>
    <div class="control has-icons-left" :class="{ 'has-icons-right': error }">
      <input
        v-bind="$attrs"
        :type="type || 'text'"
        :id="id"
        :value="modelValue"
        @input="handleInput"
        class="input"
        :class="{ 'is-danger': error }"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :minlength="minlength"
      />

      <span class="icon is-small is-left">
        <i :class="`fas fa-${icon || 'user'}`"></i>
      </span>

      <span v-if="error" class="icon is-small is-right has-text-danger">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger">{{ error }}</p>
  </div>
</template>

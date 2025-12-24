<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button type="button" class="button is-link" @click="handleClick">
    Write a comment
  </button>
</template>

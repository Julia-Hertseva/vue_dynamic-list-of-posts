<script setup lang="ts">
defineProps<{
  userName: string
}>()

const emit = defineEmits<{
  logout: []
}>()
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-item">
      <h2 class="title is-size-4">Vue List Of Posts</h2>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <div class="mr-5 mb-2">
            <p>User: {{ userName }}</p>
          </div>

          <a class="button is-light" @click="emit('logout')"> Logout </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.title {
  font-weight: 500;
}

.buttons {
  gap: 0;
}

.button {
  margin-bottom: 0.5rem;
  font-weight: 400;
  border-radius: 4px;
}

.button.is-light {
  background-color: #f5f5f5;
}

.button.is-light:hover,
.button.is-light.is-hovered {
  background-color: #eee;
}
</style>

<script setup lang="ts">
import PostPreview from './PostPreview.vue'
import NoComments from './NoComments.vue'
import WriteCommentBtn from './WriteCommentBtn.vue'
</script>

<template>
  <div class="tile is-parent is-8-desktop Sidebar Sidebar--open">
    <div class="tile is-child box is-success">
      <div class="content">
        <PostPreview />

        <!-- Comments Section -->
        <div class="block">
          <NoComments />
          <!-- <Comment /> -->

          <WriteCommentBtn />
        </div>

        <!-- Loader -->
        <!-- <PostLoader /> -->
      </div>
    </div>
  </div>
</template>

<style>
.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-property: max-width, opacity;
  transition-duration: 0.5s;
  transition-timing-function: ease-in-out;
}

@media (min-width: 769px) {
  .Sidebar {
    max-width: 0;
  }

  .Sidebar--open {
    max-width: 50%;
  }
}

.Sidebar--open {
  opacity: 1;
}
</style>

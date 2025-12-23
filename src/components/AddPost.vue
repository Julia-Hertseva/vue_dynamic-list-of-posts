<script setup lang="ts">
import { reactive } from 'vue'
import InputField from './InputField.vue'

interface Emits {
  (e: 'submit', title: string, body: string): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const form = reactive({
  title: '',
  body: '',
})

const errors = reactive({
  title: '',
  body: '',
})

const validate = () => {
  let isValid = true

  errors.title = ''
  errors.body = ''

  if (!form.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (!form.body.trim()) {
    errors.body = 'Post body is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (validate()) {
    emit('submit', form.title, form.body)
    form.title = ''
    form.body = ''
  }
}

const handleCancel = () => {
  emit('cancel')
  form.title = ''
  form.body = ''
  errors.title = ''
  errors.body = ''
}
</script>

<template>
  <div class="content">
    <h2>Create new post</h2>

    <form @submit.prevent="handleSubmit">
      <InputField
        :modelValue="form.title"
        @update:modelValue="form.title = $event"
        label="Title"
        id="post-title"
        type="text"
        placeholder="Post title"
        icon="user"
        :error="errors.title"
      />

      <div class="field">
        <label class="label" for="post-body"> Write Post Body </label>
        <div class="control">
          <textarea
            v-model="form.body"
            id="post-body"
            class="textarea"
            :class="{ 'is-danger': errors.body }"
            placeholder="Post body"
          ></textarea>
        </div>
        <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button type="submit" class="button is-link">Create</button>
        </div>
        <div class="control">
          <button type="reset" class="button is-link is-light" @click="handleCancel">Cancel</button>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
.content h2 {
  font-size: 1.75em;
  font-weight: 600;
}
</style>

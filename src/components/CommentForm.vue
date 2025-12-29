<script setup lang="ts">
import { ref, reactive } from 'vue'
import InputField from './InputField.vue'

interface Props {
  initialName?: string
  initialEmail?: string
}

interface Emits {
  (e: 'submit', name: string, email: string, body: string): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  initialName: '',
  initialEmail: ''
})
const emit = defineEmits<Emits>()

const isLoading = ref(false)

const form = reactive({
  name: props.initialName,
  email: props.initialEmail,
  body: ''
})

const errors = reactive({
  name: '',
  email: '',
  body: ''
})

const clearNameError = () => {
  errors.name = ''
}

const clearEmailError = () => {
  errors.email = ''
}

const clearBodyError = () => {
  errors.body = ''
}

const validate = () => {
  let isValid = true

  errors.name = ''
  errors.email = ''
  errors.body = ''

  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!form.body.trim()) {
    errors.body = 'Comment is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) {
    return
  }

  isLoading.value = true
  try {
    await emit('submit', form.name, form.email, form.body)
    form.body = ''

    errors.name = ''
    errors.email = ''
    errors.body = ''

  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  form.name = ''
  form.email = ''
  form.body = ''
  errors.name = ''
  errors.email = ''
  errors.body = ''
  emit('cancel')
}
</script>

<template>
  <div class="comment-form">
    <InputField
      :modelValue="form.name"
      @update:modelValue="form.name = $event"
      @input="clearNameError"
      label="Author Name"
      id="comment-name"
      type="text"
      placeholder="Name Surname"
      icon="user"
      :error="errors.name"
      :required="true"
    />

    <InputField
      :modelValue="form.email"
      @update:modelValue="form.email = $event"
      @input="clearEmailError"
      label="Author Email"
      id="comment-email"
      type="email"
      placeholder="Your Email"
      icon="envelope"
      :error="errors.email"
      :required="true"
    />

    <div class="field">
      <label class="label" for="comment-body">Write Post Body</label>
      <div class="control">
        <textarea
          v-model="form.body"
          id="comment-body"
          class="textarea"
          :class="{ 'is-danger': errors.body }"
          placeholder="Comment"
          rows="4"
          @input="clearBodyError"
        ></textarea>
      </div>
      <p v-if="errors.body" class="help is-danger">{{ errors.body }}</p>
    </div>

    <div class="field is-grouped mt-4">
      <div class="control">
        <button
          type="button"
          class="button is-link"
          @click="handleSubmit"
          :class="{ 'is-loading': isLoading }"
        >
          Add Comment
        </button>
      </div>
      <div class="control">
        <button
          type="button"
          class="button is-link is-light"
          @click="handleCancel"
          :disabled="isLoading"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

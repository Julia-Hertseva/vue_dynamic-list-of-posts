<template>
  <div class="field">
    <label class="label" for="input-field">
      Title
    </label>
    <div class="control has-icons-left has-icons-right">
      <input
        type="text"
        id="input-field"
        class="input"
        placeholder="Enter text"
      />
      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span class="icon is-small is-right has-text-danger">
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p class="help is-danger">Error text</p>
  </div>
</template>

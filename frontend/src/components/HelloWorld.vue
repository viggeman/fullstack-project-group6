<script setup>
  import { ref } from 'vue';

  defineProps({
    msg: String,
  });

  const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>

  <a href="https://github.com/viggeman/fullstack-project-group6" target="_blank"
    >REPO</a
  >
</template>

<style scoped></style>

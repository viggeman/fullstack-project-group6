<script setup>
  import HelloWorld from './components/HelloWorld.vue';
  import Menu from './components/Menu.vue';
</script>

<template>
  <!-- <HelloWorld msg="Hello + GRuPp 6" />
   -->
  <Menu />
  <div class="container">
    <router-view />
  </div>
</template>

<style scoped></style>

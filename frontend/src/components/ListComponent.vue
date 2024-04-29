<template>
  <div>
    <ul>
      <li v-for="item in propData">
        {{ item.writerName }}: ID {{ item.writerId }}
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  // Define props for the list items
  const props = defineProps({
    items: {
      type: Array,
    },
  });

  // Define a reactive ref for the list items
  const propData = ref(props.items);
  console.log('propData', propData);
</script>

<style>
  /* Add your component styles here */
</style>

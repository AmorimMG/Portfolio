<script setup>
import { ref } from "vue";

const openFiles = ref(["index.js", "style.css"]);
</script>

<template>
  <div class="tab-bar">
    <span v-for="file in openFiles" :key="file" class="tab">{{ file }}</span>
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  background-color: #333;
  color: white;
  padding: 5px;
}

.tab {
  padding: 10px;
  cursor: pointer;
}
</style>

<script setup>
import { ref } from "vue";

const files = ref([
  { name: "index.js", type: "file" },
  { name: "style.css", type: "file" },
  { name: "components", type: "folder", children: [{ name: "Header.vue", type: "file" }] },
]);
</script>

<template>
  <div class="file-explorer">
    <ul>
      <li v-for="file in files" :key="file.name">
        <span>{{ file.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.file-explorer {
  width: 200px;
  background-color: #1e1e1e;
  color: white;
  padding: 10px;
}
</style>

<script setup>
import { useAppsStore } from '@/stores/useAppsStore';
import { useTrashStore } from '@/stores/useTrashStore';

const trashStore = useTrashStore();
const appsStore = useAppsStore();

function restore(app) {
  appsStore.restoreApp(app);
}

function permanentDelete(app) {
  trashStore.removeFromTrash(app);
}
</script>

<template>
  <div class="w-full h-full">
    <div class="w-full h-full flex flex-col justify-center items-center" v-if="trashStore.trash.length === 0">
      <h1>🗑️</h1>
      Nada na lixeira
    </div>
    <ul v-else>
      <li class="flex flex-row justify-content-between items-center" v-for="app in trashStore.trash" :key="app.id">
        <div class="flex flex-row justify-content-between items-center">
          <img loading="lazy" :src="app.icon" width="50px" height="50px" alt="App Icon">
          <div class="ml-5"> {{ app.title }} </div>
        </div>
        <div>
          <button class="buttonTrash" @click="restore(app)">Restaurar</button>
          <button class="buttonTrash" @click="permanentDelete(app)">Excluir</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.trash-container {
  padding: 1rem;
}

button {
  margin-left: 8px;
  background-color: #eee;
  border: 1px solid #ccc;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #ccc;
}

.buttonTrash {
  color: black;
}
</style>

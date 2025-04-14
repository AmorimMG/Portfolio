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
  <div>
    <h2>🗑️ Lixeira</h2>
    <div v-if="trashStore.trash.length === 0">Nada na lixeira</div>
    <ul>
      <li v-for="app in trashStore.trash" :key="app.id">
        {{ app.title }}
        <button @click="restore(app)">Restaurar</button>
        <button @click="permanentDelete(app)">Excluir</button>
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
</style>

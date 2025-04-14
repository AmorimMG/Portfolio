<script setup lang="ts">
import { defineEmits, ref } from "vue";
import sidebarFileSystem from '../sidebarFileSystem.vue';
import Trash from "../Trash.vue";
import CustomDialog from "./CustomDialog.vue";

const props = defineProps({
	visible: Boolean,
});

const emit = defineEmits(["close"]);
const closeModal = () => {
	emit("close");
};

const trash = ref([
  {
    id: 1,
    title: 'App Exemplo',
    name: 'AppExemplo',
    icon: '📦',
    colSpan: 1,
    rowSpan: 1,
  },
]);

function handleRestore(app) {
  // aqui você insere na lista de apps do Select.vue, ou emite evento
  console.log('Restaurar', app);
  trash.value = trash.value.filter(a => a.id !== app.id);
}

function handleDelete(app) {
  trash.value = trash.value.filter(a => a.id !== app.id);
}
</script>

<template>
<CustomDialog class="dialog-terminal" 
    :visible="props.visible"
    @update:visible="closeModal"
>
  <sidebarFileSystem>
    <Trash :trash="trash" @restore="handleRestore" @delete="handleDelete"/>
  </sidebarFileSystem>
</CustomDialog>
</template>

<style scoped>
.dialog-terminal {
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
}

.maximized {
  transform: scale(1.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}

.modal-header {
  background-color: #e8e8e8;
  border-top-left-radius: 10px;
  border-top-right-radius: 0px;
  padding: 10px;
}

.window-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  justify-content: start;
}

.window-controls span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.close { background-color: #ff5f56; }
.minimize { background-color: #ffbd2e; }
.maximize { background-color: #27c93f; }

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar button {
  background-color: #d8d8d8;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
}

.path-input {
  flex-grow: 1;
  background-color: #ffffff;
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 14px;
  color: black;
}

.modal-body {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>

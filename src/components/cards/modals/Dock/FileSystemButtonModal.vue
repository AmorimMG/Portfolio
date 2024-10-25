<script setup lang="ts">
import { defineEmits } from "vue";
import FileSystemModal from "./FileSystemModal.vue";

const emit = defineEmits(["close"]);

const closeModal = () => {
	emit("close");
};
</script>

<template>
  <div class="modal-wrapper" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="window-controls">
          <span class="close" @click="closeModal"></span>
          <span class="minimize"></span>
          <span class="maximize"></span>
        </div>
        <div class="toolbar">
          <button>&lt;</button>
          <button>&gt;</button>
          <input type="text" class="path-input" value="admin > Downloads > some-stuff" readonly />
        </div>
      </div>
      
      <FileSystemModal/>
      <div class="modal-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-wrapper {
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 1000px;
  height: 80%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  background-color: #e8e8e8;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: 10px;
}

.window-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  justify-content: end;
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

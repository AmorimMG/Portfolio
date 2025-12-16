<script setup lang="ts">
import { useDockStore } from "@/stores/useDockStore";
import { onMounted, ref } from "vue";
import { componentMap, widgets as initialWidgets } from "../data/appsDock";

const widgets = ref(initialWidgets);
const dockStore = useDockStore();
const isDragOverWidgets = ref(false);
let draggedDockItem: any = null;

// Escutar eventos de drag do dock
const setupDragListeners = () => {
  window.addEventListener("dock-drag-start", (event: any) => {
    draggedDockItem = event.detail;
    console.log("Dock item drag started on widgets:", draggedDockItem);
  });

  window.addEventListener("dock-drag-end", () => {
    draggedDockItem = null;
    isDragOverWidgets.value = false;
  });
};

const onDragOver = (event: DragEvent) => {
  if (draggedDockItem) {
    isDragOverWidgets.value = true;
    event.preventDefault();
  }
};

const onDragLeave = () => {
  isDragOverWidgets.value = false;
};

const onDrop = (event: DragEvent) => {
  isDragOverWidgets.value = false;

  if (!draggedDockItem) return;

  console.log("Dropping dock item on widgets:", draggedDockItem);

  // Converter item do dock para widget
  const commandToComponentMap: Record<string, string> = {
    terminal: "TerminalCard",
    folder: "FileSystemCard",
    vscode: "VscodeCard",
    photos: "PhotosCard",
    amorim: "PortfolioModal",
    trash: "TrashCard",
  };

  const componentName = commandToComponentMap[draggedDockItem.command];
  if (componentName) {
    const newWidget = {
      id: Date.now() + Math.random(),
      name: componentName,
      colSpan: 1,
      rowSpan: 1,
    };
    widgets.value.push(newWidget);
  }

  draggedDockItem = null;
};

onMounted(() => {
  setupDragListeners();
});
</script>

<template>
  <div
    class="widgets-container"
    @dragover.prevent="onDragOver"
    @drop.prevent="onDrop"
    @dragleave="onDragLeave"
    :class="{ 'drag-over-widgets': isDragOverWidgets }"
  >
    <draggable
      class="draggableWidgets"
      v-model="widgets"
      item-key="id"
      group="widgets"
      animation="200"
    >
      <template #item="{ element }">
        <component
          class="app-widgets"
          :is="componentMap[element.name]"
          :style="{
            'grid-column': 'span ' + element.colSpan,
            'grid-row': 'span ' + element.rowSpan,
          }"
        />
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.widgets-container {
  transition: all 0.3s ease;
  border-radius: 12px;
  padding: 5px;
}

.widgets-container.drag-over-widgets {
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.widgets-container.drag-over-widgets::before {
  content: "⬇️ Solte aqui";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  z-index: 9999;
  pointer-events: none;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.draggableWidgets {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
  grid-template-rows: repeat(1, 1fr);
  grid-auto-flow: row;
  margin-top: 10px;
  min-height: 150px;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.app-widgets {
  width: 250px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: transform 0.2s ease;
}

.app-widgets:hover {
  transform: scale(1.02);
}

.app-widgets * {
  font-size: 1rem !important;
  padding: 0;
  border: none;
  border-radius: 12px;
  text-align: center;
}

.app-widgets > .h-full .card {
  width: 250px;
}

@media (max-width: 991px) {
  .draggableWidgets {
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: row;
    display: none;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { componentMap, widgets as initialWidgets } from '../data/appsDock';
const widgets = ref(initialWidgets);
</script>

<template>
    <draggable class="draggableWidgets" v-model="widgets" item-key="id" group="widgets" animation="200">
        <template #item="{ element }">
            <component class="app-widgets" :is="componentMap[element.name]" :style="{
                'grid-column': 'span ' + element.colSpan,
                'grid-row': 'span ' + element.rowSpan
            }" />
        </template>
    </draggable>
</template>

<style scoped>
.draggableWidgets {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    grid-template-rows: repeat(1, 1fr);
    grid-auto-flow: column;
    margin-top: 10px;
}

.app-widgets {
    width: 250px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.app-widgets * {
    font-size: 1rem !important;
    padding: 0;
    border: none;
    border-radius: 12px;
    text-align: center;
}

.app-widgets>.h-full .card {
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

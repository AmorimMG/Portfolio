<script setup>
import { vElementSize } from '@vueuse/components';
import { defineAsyncComponent, ref } from 'vue';

const props = defineProps({
    header: String
});

const dashboardVisible = ref(false);
const emit = defineEmits(["close"]);
const onHide = () => {
    emit('close');
    dashboardVisible.value = false;
};

const startResize = (event, direction) => {
    event.preventDefault();

    const dialogElement = document.querySelector('.dialog-terminal');
    const { width, height, top, left } = dialogElement.getBoundingClientRect();

    const startX = event.clientX;
    const startY = event.clientY;

    const resize = (e) => {
        if (direction.includes('right')) {
            dialogElement.style.width = `${width + e.clientX - startX}px`;
        }
        if (direction.includes('bottom')) {
            dialogElement.style.height = `${height + e.clientY - startY}px`;
        }
        if (direction.includes('left')) {
            dialogElement.style.width = `${width - (e.clientX - startX)}px`;
            dialogElement.style.left = `${left + (e.clientX - startX)}px`;
        }
        if (direction.includes('top')) {
            dialogElement.style.height = `${height - (e.clientY - startY)}px`;
            dialogElement.style.top = `${top + (e.clientY - startY)}px`;
        }
    };

    const stopResize = () => {
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
};

const Dashboard = defineAsyncComponent(() => import('../../views/Dashboard.vue'));
</script>

<template>
    <Button text class="w-full h-full" @click="dashboardVisible = true" />
    <Dialog v-element-size="onResize" class="dialog-terminal" contentStyle="width: 100%; height: 100%; background-color: #000000cc !important; overflow-y: auto;" 
            :visible="dashboardVisible"  
            @update:visible="dashboardVisible = $event"
            @hide="onHide"
            :closable="false"
            :breakpoints="{ '960px': '50vw' }"  
            :style="{ width: '90vw', height: '90vh' }"
            :unstyled="true"
            >
        <template #header>
            <div class="safari-header w-full flex justify-content-between items-center">
                <div class="header-buttons">
                    <button @click="dashboardVisible = false" class="nav-button back"></button>
                    <button @click="dashboardVisible = false" class="nav-button forward"></button>
                    <button @click="dashboardVisible = false" class="nav-button refresh"></button>
                </div>
                <div class="url-bar">https://amorim.pro/</div>
                <div class="right-section"></div>
            </div>
        </template>
        <Dashboard ref="el" class="layout-main-container" v-if="dashboardVisible" />

         <span class="resize-handle top" @mousedown="startResize($event, 'top')"></span>
        <span class="resize-handle right" @mousedown="startResize($event, 'right')"></span>
        <span class="resize-handle bottom" @mousedown="startResize($event, 'bottom')"></span>
        <span class="resize-handle left" @mousedown="startResize($event, 'left')"></span>
        <span class="resize-handle top-right" @mousedown="startResize($event, 'top right')"></span>
        <span class="resize-handle top-left" @mousedown="startResize($event, 'top left')"></span>
        <span class="resize-handle bottom-right" @mousedown="startResize($event, 'bottom right')"></span>
        <span class="resize-handle bottom-left" @mousedown="startResize($event, 'bottom left')"></span>
    </Dialog>
</template>

<style scoped>
.dialog-terminal {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    min-width: 200px;
    min-height: 200px;
}

.safari-header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #f2f2f7;
    border-bottom: 1px solid #dcdcdc;
}

.header-buttons {
    display: flex;
    gap: 8px;
}

.nav-button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #c4c4c4;
    border: none;
    cursor: pointer;
}

.back { background-color: #ff5f57; }
.forward { background-color: #febc2e; }
.refresh { background-color: #28c840; }

.url-bar {
    padding: 6px 12px;
    border-radius: 8px;
    margin-left: 12px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    background-color: #333;
    color: white;
    font-size: 14px;
    font-weight: 500;
}

/* Resizable handle styling */
.resize-handle {
    position: absolute;
    background-color: red; /* cor do handler */
    z-index: 10;
}

/* Individual handles */
.top { top: 0; left: 0; right: 0; height: 5px; cursor: ns-resize; }
.right { top: 0; right: 0; bottom: 0; width: 5px; cursor: ew-resize; }
.bottom { left: 0; right: 0; bottom: 0; height: 5px; cursor: ns-resize; }
.left { top: 0; left: 0; bottom: 0; width: 5px; cursor: ew-resize; }

/* Corner handles */
.top-right { top: 0; right: 0; width: 10px; height: 10px; cursor: nesw-resize; }
.top-left { top: 0; left: 0; width: 10px; height: 10px; cursor: nwse-resize; }
.bottom-right { bottom: 0; right: 0; width: 10px; height: 10px; cursor: nwse-resize; }
.bottom-left { bottom: 0; left: 0; width: 10px; height: 10px; cursor: nesw-resize; }
</style>

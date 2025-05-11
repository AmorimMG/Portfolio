<script setup lang="ts">
import { ref } from 'vue';
import FileSystem from '../FileSystem.vue';
import SidebarFileSystem from '../sidebarFileSystem.vue';
import Trash from '../Trash.vue';
import CustomDialog from './CustomDialog.vue';

const props = defineProps({
    visible: Boolean,
    modalType: {
        type: String,
        default: 'files' // Can be 'trash', 'system', etc.
    }
});

const emit = defineEmits(['close']);
const closeModal = () => {
    emit('close');
};

const currentPath = ref(props.modalType.charAt(0).toUpperCase() + props.modalType.slice(1));
const currentView = ref<string>(props.modalType);

const handleFileSelect = (item: any) => {
    currentPath.value = item.path;
    if (item.type === 'directory') {
        currentView.value = item.name.toLowerCase();
    }
};

// Map of components for different views
const viewComponents = {
    trash: Trash,
    documents: FileSystem,
    files: FileSystem,
    system: 'div'
};
</script>

<template>
    <CustomDialog class="dialog-terminal" :visible="props.visible" @update:visible="closeModal">
        <div class="modal-header">
            <div class="path-display">
                {{ currentPath }}
            </div>
        </div>
        <SidebarFileSystem @select="handleFileSelect">
            <component :is="viewComponents[currentView] || FileSystem">
                <template v-if="currentView === 'system'">
                    <div class="system-view">
                        <h2>System Configuration</h2>
                    </div>
                </template>
            </component>
        </SidebarFileSystem>
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

.close {
    background-color: #ff5f56;
}

.minimize {
    background-color: #ffbd2e;
}

.maximize {
    background-color: #27c93f;
}

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

.path-display {
    background-color: #f5f5f5;
    padding: 8px 12px;
    border-radius: 4px;
    color: #333;
    font-size: 14px;
    margin-bottom: 10px;
}

.system-view {
    padding: 20px;
    color: black;
}
</style>

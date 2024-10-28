<script setup>
import { ref, watch } from 'vue';
import ModalHeader from '../modals/ModalHeader.vue';
import MonacoEditor from '../MonacoEditor.vue';
import FileExplorer from './FileExplorer.vue';
import StatusBar from './StatusBar.vue';
import Tabs from './Tabs.vue';

const props = defineProps({
	visible: Boolean,
});

const emit = defineEmits(["update:visible"]);

const closeModal = () => {
    emit("update:visible", false);
};

watch(props, (newValue, oldValue) => {
	if (newValue !== oldValue) {
		console.log("Modal Visible:", newValue);
	}
});

const code = ref("console.log('Hello World!');");
</script>

<template>
    <Dialog
        @hide="closeModal"
        :visible="props.visible"  
        :closable="false"
        :unstyled="true"
        :style="{ width: '80rem', height: '50rem', overflowY: 'auto' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
    <template #header>
        <ModalHeader @close="closeModal"/>
    </template>
        <div class="vscode-clone">
            <div class="sidebar">
                <FileExplorer />
            </div>
            <div class="main-area">
                <Tabs />
                <MonacoEditor v-model="code" />
                <StatusBar />
            </div>
        </div>
    </dialog>
</template>

<style scoped>
.vscode-clone {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 200px;
  background-color: #252526;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tabs {
  height: 40px;
}

.monaco-editor {
  flex: 1;
}

.status-bar {
  height: 30px;
}
</style>

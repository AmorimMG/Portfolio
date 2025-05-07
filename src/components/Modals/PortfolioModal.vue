<script setup>
import { ref } from 'vue';
import Portfolio from '../Portfolio.vue';
import CustomDialog from './CustomDialog.vue';

const props = defineProps({
    header: String,
    visible: {
        type: Boolean,
        default: false
    }
});

const portfolioVisible = ref(false);
const url = ref('https://amorim.pro/');
const emit = defineEmits(['close', 'update:visible']);

const closeModal = () => {
    emit('update:visible', false);
};
</script>

<template>
    <Button text class="w-full h-full" @click="portfolioVisible = true" />
    <CustomDialog class="dialog-terminal p-dialog-maximized"
        contentStyle="width: 100%; height: 100%; background-color: #000000cc !important; overflow-y: none;"
        :visible="portfolioVisible || visible" @update:visible="closeModal" :maximized="true" :closable="false"
        :breakpoints="{ '960px': '50vw' }" :style="{ width: '90vw', height: '90vh' }" :unstyled="true">
        <template #header>
            <div
                class="safari-header w-full flex items-center justify-between px-3 py-2 bg-neutral-100 border-b border-neutral-300">
                <div class="flex gap-2">
                    <button @click="onHide" class="w-3 h-3 rounded-full bg-red-500"></button>
                    <button @click="onForward" class="w-3 h-3 rounded-full bg-yellow-400"></button>
                    <button @click="refreshPage" class="w-3 h-3 rounded-full bg-green-500"></button>
                </div>
                <input disabled v-model="url"
                    class="bg-zinc-800 text-white text-sm font-medium px-3 py-1 rounded-lg shadow-inner ml-3 w-full max-w-lg"
                    placeholder="Enter URL..." />
                <div class="w-10"></div>
            </div>
        </template>
        <Portfolio ref="el" class="layout-main-container" />
    </CustomDialog>
</template>

<style scoped></style>

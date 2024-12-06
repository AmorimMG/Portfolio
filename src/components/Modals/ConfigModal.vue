<script setup lang="ts">
import { defineEmits, ref } from "vue";
import draggable from "vuedraggable";
import Wallpapers from '../../data/wallpapers.js';
import ModalHeader from "./ModalHeader.vue";

defineProps ({
    visible: {
        type: Boolean,
        default: false,
    }
});

const selectedBackground = ref('https://primefaces.org/cdn/primevue/images/dock/window.jpg');

const backgroundImages = ref(Wallpapers);
const emit = defineEmits(["update:visible, update:modelValue"]);

const closeModal = () => {
    emit("update:visible", false);
};
</script>

<template>
<Dialog class="dialog-terminal" 
    :visible="visible"  
    :closable="false"
    :unstyled="true"
    :style="{ width: '80rem', height: '50rem', overflowY: 'auto' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
>
    <template #header>
        <ModalHeader @close="closeModal"/>
    </template>
    <div style="background-color: rgba(0, 0, 0, 0.2);">
        <div class="flex justify-content-center align-item-center">
            <h1> Actual Image</h1>
        </div>
        <div class="flex flex-column gap-6">
            <div class="flex flex-wrap justify-content-center gap-3">
                <img :src="selectedBackground" width="450" alt="Selected Background" class="border-round" />
            </div>
            <draggable v-model="backgroundImages" item-key="value" class="flex flex-wrap justify-content-center gap-3 mb-3">
                <template #item="{ element }">
                    <div>
                        <img @click="() => {$emit('update:modelValue', element.value); selectedBackground = element.value}" :src="element.value" alt="Selected Background" class="w-12rem h-10rem shadow-2 border-round" />
                        <p class="text-center">{{ element.label }}</p>
                    </div>
                </template>
            </draggable> 
        </div>
    </div>
</Dialog>
</template>

<style scoped></style>

<script setup lang="ts">
import { useConfigModalStore } from '@/stores/configModal';
import { defineEmits, ref } from "vue";
import draggable from 'vuedraggable';
import Wallpapers from '../../data/wallpapers.js';
import ModalHeader from "./ModalHeader.vue";

defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    isTopbar: {
        type: Boolean,
        default: false,
    },
});
const configModalStore = useConfigModalStore();

const selectedBackground = ref(configModalStore.getBackground());

const backgroundImages = ref(Wallpapers);
const emit = defineEmits(["update:visible, update:modelValue"]);
const openWallpaper = ref(false);

const loadedImages = ref(new Set<string>());

const handleImageLoad = (src: string) => {
    loadedImages.value.add(src);
};

const closeModal = () => {
    emit("update:visible", false);
    openWallpaper.value = false;
};

</script>

<template>
    <Button v-if="!isTopbar" text class="w-full h-full" @click="openWallpaper = true"
        style="width: 100%; height: 100%; justify-content: center">
        <VueNeonLight size="15px" :flash="false" style="color: white"></VueNeonLight>
    </Button>
    <Dialog class="dialog-terminal" :visible="visible || openWallpaper" :closable="false" :unstyled="true"
        :style="{ width: '80rem', height: '50rem', overflowY: 'auto' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <template #header>
            <ModalHeader @close="closeModal" />
        </template>
        <div style="background-color: rgba(0, 0, 0, 0.2);">
            <div class="flex justify-content-center align-item-center">
                <h1>Background</h1>
            </div>
            <div class="flex flex-column gap-6">
                <div class="flex flex-wrap justify-content-center gap-3">
                    <img loading="lazy" :src="configModalStore.getBackground()" width="450" height="200"
                        alt="Selected Background" class="border-round" />
                </div>
                <draggable v-model="backgroundImages" item-key="value"
                    class="flex flex-wrap justify-content-center gap-3 mb-3">
                    <template #item="{ element }">
                        <div class="flex flex-column align-items-center" style="width: 12rem;">
                            <div style="width: 12rem; height: 10rem; position: relative;">
                                <Skeleton v-if="!loadedImages.has(element.value)" width="100%" height="100%"
                                    class="border-round" style="position: absolute; top: 0; left: 0; z-index: 1;" />
                                <img loading="lazy" v-show="loadedImages.has(element.value)"
                                    @load="handleImageLoad(element.value)" @click="() => {
                                        $emit('update:modelValue', element.value);
                                        selectedBackground = element.value;
                                        configModalStore.setBackground(element.value);
                                    }" :src="element.value" alt="Selected Background"
                                    class="w-full h-full shadow-2 border-round"
                                    style="object-fit: cover; position: absolute; top: 0; left: 0; z-index: 2;" />
                            </div>
                            <p style="color: white" class="text-center mt-2">{{ element.label }}</p>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
    </Dialog>
</template>

<style scoped></style>

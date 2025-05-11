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
const openWallpaper = ref(false);

const loadedImages = ref(new Set<string>());

const handleImageLoad = (src: string) => {
    loadedImages.value.add(src);
};

const emit = defineEmits(['update:visible', 'update:modelValue']);
const closeModal = () => {
    emit("update:visible", false);
    openWallpaper.value = false;
};

</script>

<template>
    <div class="config-root" v-bind="$attrs">
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
                <div class="flex justify-center items-center py-6">
                    <h1 class="text-3xl sm:text-4xl font-semibold text-white tracking-tight drop-shadow-md">
                        Choose Your Background
                    </h1>
                </div>

                <div class="flex flex-col gap-6 px-4 py-6">
                    <div class="flex justify-center">
                        <img loading="lazy" :src="configModalStore.getBackground()" alt="Selected Background"
                            class="rounded-xl w-full max-w-[700px] shadow-lg" width="450" height="200" />
                    </div>
                    <draggable v-model="backgroundImages" item-key="value"
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 pb-6">
                        <template #item="{ element }">
                            <div class="flex flex-col items-center text-white">
                                <div
                                    class="relative w-full aspect-[6/5] rounded-xl overflow-hidden shadow-md cursor-pointer transition-transform duration-200 hover:scale-105">
                                    <Skeleton v-if="!loadedImages.has(element.value)"
                                        class="absolute inset-0 rounded-xl" />
                                    <img v-show="loadedImages.has(element.value)" @load="handleImageLoad(element.value)"
                                        @click="() => {
                                            $emit('update:modelValue', element.value);
                                            selectedBackground = element.value;
                                            configModalStore.setBackground(element.value);
                                        }" :src="element.value" alt="Background"
                                        class="absolute inset-0 w-full h-full object-cover rounded-xl" />
                                </div>
                                <p class="text-sm text-center mt-2">{{ element.label }}</p>
                            </div>
                        </template>
                    </draggable>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped></style>

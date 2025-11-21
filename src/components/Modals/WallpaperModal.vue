<script setup lang="ts">
import { useWallpaperStore } from '@/stores/wallpaperStore.js';
import { ref } from "vue";
import draggable from 'vuedraggable';
import Wallpapers from '../../data/wallpapers.js';
import CustomDialog from '../Modals/CustomDialog.vue';

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
const wallpaperModalStore = useWallpaperStore();

const selectedBackground = ref(wallpaperModalStore.getBackground());

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
        <CustomDialog class="dialog-terminal" :visible="visible || openWallpaper" :maximized="false"
            @update:visible="closeModal()" :style="{ overflowY: 'auto', backgroundColor: 'transparent' }">
            <div class="bg-black/20 backdrop-blur-md h-full overflow-y-auto">
                <div class="flex justify-center items-center py-4 sm:py-6">
                    <h1 class="text-2xl sm:text-4xl font-semibold text-white tracking-tight drop-shadow-md">
                        Choose Your Background
                    </h1>
                </div>

                <div class="flex flex-col gap-4 sm:gap-6 px-4 py-4 sm:py-6">
                    <div class="flex justify-center">
                        <img loading="lazy" :src="wallpaperModalStore.getBackground()" alt="Selected Background"
                            class="rounded-xl max-w-full sm:max-w-[700px] shadow-lg" width="450" height="200" />
                    </div>
                    <draggable v-model="backgroundImages" item-key="value"
                        class="grid grid-cols-4 gap-4 px-4 pb-6">
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
                                            wallpaperModalStore.setBackground(element.value);
                                        }" :src="element.value" alt="Background"
                                        class="absolute inset-0 w-full h-full object-cover rounded-xl" />
                                </div>
                                <p class="text-sm text-center mt-2">{{ element.label }}</p>
                            </div>
                        </template>
                    </draggable>
                </div>
            </div>
        </CustomDialog>
    </div>
</template>

<style scoped>
.dialog-terminal {
    width: 90vw;
    max-width: 80rem;
    height: 90vh;
    max-height: 50rem;
    overflow-y: auto;
}

@media (max-width: 640px) {
    .dialog-terminal {
        width: 100vw;
        height: 100vh;
        max-width: 100vw;
        max-height: 100vh;
        margin: 0;
        top: 0;
        left: 0;
    }
}
</style>

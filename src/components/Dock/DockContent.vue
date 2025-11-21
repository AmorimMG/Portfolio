<script setup>
import { useAppsStore } from '@/stores/useAppsStore';
import { useWallpaperStore } from '@/stores/wallpaperStore';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

import Widgets from '../Widgets.vue';

import { getLanguageCookie } from '../../service/session';

const { locale } = useI18n();
const selectRef = ref(null);
const appsStore = useAppsStore();

const isMobile = ref(window.innerWidth <= 768);

const wallpaperStore = useWallpaperStore();
const background = ref(wallpaperStore.getBackground());

watchEffect(() => {
    background.value = wallpaperStore.getBackground();

    const cookieValue = getLanguageCookie();
    locale.value = cookieValue || 'en';
});

const updateScreenSize = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
    window.addEventListener('resize', updateScreenSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize);
});
</script>

<template>
    <div class="dock-window dock-advanced overflow-hidden">
        <transition name="fade" mode="out-in">
            <div class="w-full h-full absolute inset-0 z-0 bg-cover bg-center" :key="background"
                :style="{ 'background-image': `url(${background})` }"></div>
        </transition>
        <div class="relative z-10 wrapper flex justify-between">
            <div class="apps">
                <Desktop ref="selectRef" />
            </div>
            <div class="widgets mr-8">
                <Widgets />
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
    /* fade-enter é a classe aplicada antes da entrada e fade-leave-to após a saída */
    opacity: 0;
}

.dock-demo {
    padding: 0;
    height: 100vh;
    user-select: none;
}

.dock-demo>.dock-window {
    width: 100%;
    height: 100vh;
    position: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.dock-demo .p-menubar {
    padding: 0;
    border-radius: 0;
}

.apps {
    width: 100vw;
    height: 100vh;
}

.widgets {
    position: absolute;
    right: 0;
}

@media (max-width: 991px) {
    .widgets {
        margin-right: 0;
        right: auto;
        position: fixed;
    }

    .wrapper {
        margin-top: 50px;
    }
}
</style>

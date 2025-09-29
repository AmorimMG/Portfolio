<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const isFullscreen = ref(false);

const toggleFullscreen = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen().catch(console.warn);
    }
};

const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<template>
    <button 
        @click="toggleFullscreen" 
        class="fullscreen-btn"
        :title="isFullscreen ? 'Sair da tela cheia' : 'Entrar em tela cheia'"
    >
        {{ isFullscreen ? '⊡' : '⊞' }}
    </button>
</template>

<style scoped>
.fullscreen-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
    font-size: 16px;
    font-family: monospace;
}

.fullscreen-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}
</style>
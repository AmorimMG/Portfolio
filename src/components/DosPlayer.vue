<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
    game: String,
    visible: Boolean,
    baseUrl: {
        type: String,
        default: 'https://v8.js-dos.com/bundles/'
    }
});
const emit = defineEmits(['update:visible']);

const containerRef = ref(null);
let dosInstance = null;
let gameDiv = null;

// Função para carregar o script js-dos dinamicamente (retorna Promise do window.DosLoader)
async function loadJsDosScript() {
    if (window.Dos) return window.Dos;

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://v8.js-dos.com/latest/js-dos.js';
        script.onload = () => resolve(window.Dos);
        script.onerror = reject;
        document.body.appendChild(script);
    });
}
async function loadGame() {
    if (!props.visible || !props.game || !containerRef.value) return;

    const Dos = await loadJsDosScript();

    if (gameDiv) {
        gameDiv.remove();
        gameDiv = null;
    }

    gameDiv = document.createElement('div');
    containerRef.value.appendChild(gameDiv);

    dosInstance = Dos(gameDiv, {
        url: `${props.baseUrl}${props.game}`,
        autoStart: true,
        renderAspect: '16/9',
        kiosk: true
    });
}
function stopGame() {
    if (dosInstance) {
        dosInstance.stop();
        dosInstance = null;
    }
    if (gameDiv) {
        gameDiv.remove();
        gameDiv = null;
    }
}

onMounted(() => {
    if (props.visible) {
        loadGame();
    }
});

onBeforeUnmount(() => {
    stopGame();
});

watch(
    () => props.visible,
    async (val) => {
        if (val) {
            await loadGame();
        } else {
            stopGame();
        }
    }
);
</script>

<template>
    <div v-show="visible" ref="containerRef" class="dos-container"></div>
</template>

<style scoped>
.dos-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    overflow: hidden;
    width: 100%;
    height: 100%;
}

:deep(.jsdos-rso) {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    display: flex;
    flex-direction: column;
}
</style>

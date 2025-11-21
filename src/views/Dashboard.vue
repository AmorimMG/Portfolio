<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import BootupScreen from "../components/BootupScreen.vue";
import System from "../components/Dock/System.vue";
import Intro3D from "../components/Intro3D.vue";
import SystemLoginScreen from "./SystemLoginScreen.vue";

const systemState = ref("fullscreen-prompt");
const isLoggedIn = ref(false);
const isFullscreen = ref(false);
const showFullscreenOverlay = ref(false);
const savedSystemState = ref(null);

const enterFullscreen = async () => {
  try {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.warn('Fullscreen request failed:', error);
  }
};

const checkFullscreen = () => {
  isFullscreen.value = !!document.fullscreenElement;
  
  // Se entrou em tela cheia pela primeira vez
  if (isFullscreen.value && systemState.value === "fullscreen-prompt" && !savedSystemState.value) {
    systemState.value = "intro";
    showFullscreenOverlay.value = false;
  }
  
  // Se entrou em tela cheia novamente (retornou)
  if (isFullscreen.value && savedSystemState.value) {
    systemState.value = savedSystemState.value;
    savedSystemState.value = null;
    showFullscreenOverlay.value = false;
  }
  
  // Se saiu de tela cheia após já ter iniciado
  if (!isFullscreen.value && systemState.value !== "fullscreen-prompt" && !savedSystemState.value) {
    savedSystemState.value = systemState.value;
    showFullscreenOverlay.value = true;
  }
};

onMounted(() => {
  document.addEventListener('fullscreenchange', checkFullscreen);
  checkFullscreen(); // Verificar estado inicial
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', checkFullscreen);
});

const handleLogin = () => {
  isLoggedIn.value = true;
  systemState.value = "system";
};

const onIntroComplete = () => {
  systemState.value = "booting";
  setTimeout(() => {
    systemState.value = "login";
  }, 3000);
};
</script>

<template>
  <!-- Overlay de tela cheia (aparece por cima do conteúdo) -->
  <Transition name="fade">
    <div
      v-if="showFullscreenOverlay || systemState === 'fullscreen-prompt'"
      class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center text-white z-50"
    >
      <div class="text-center">
        <h2 class="text-2xl mb-4">Experiência em Tela Cheia</h2>
        <p class="mb-6">Para melhor experiência, entre em modo tela cheia</p>
        <button
          @click="enterFullscreen"
          class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          Entrar em Tela Cheia
        </button>
      </div>
    </div>
  </Transition>

  <!-- Conteúdo principal -->
  <Transition name="fade" mode="out-in">
    <div
      class="overflow-y-hidden overflow-x-hidden"
      v-if="systemState === 'intro'"
      key="intro"
    >
      <Intro3D @animation-complete="onIntroComplete" />
    </div>

    <BootupScreen v-else-if="systemState === 'booting'" key="booting" />

    <SystemLoginScreen
      v-else-if="systemState === 'login'"
      @login="handleLogin"
    />

    <System v-else-if="systemState === 'system' && isLoggedIn" key="system" />
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

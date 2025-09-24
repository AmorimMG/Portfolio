<script setup>
import { ref } from 'vue';
import BootupScreen from '../components/BootupScreen.vue';
import System from '../components/Dock/System.vue';
import Intro3D from '../components/Intro3D.vue';
import SystemLoginScreen from './SystemLoginScreen.vue';

const systemState = ref('intro');
const isLoggedIn = ref(false);

const handleLogin = () => {
    isLoggedIn.value = true;
    systemState.value = 'system';
};

const onIntroComplete = () => {
    console.log("Dashboard recebeu 'animation-complete'. Mudando estado para 'booting'.");
    systemState.value = 'booting';
    setTimeout(() => {
        systemState.value = 'login';
    }, 3000);
};
</script>

<template>
    <Transition name="fade" mode="out-in">
        <div v-if="systemState === 'intro'" key="intro">
            <Intro3D @animation-complete="onIntroComplete" />
        </div>

        <BootupScreen v-else-if="systemState === 'booting'" key="booting" />

        <SystemLoginScreen v-else-if="systemState === 'login'" @login="handleLogin" />

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
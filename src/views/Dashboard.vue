<script setup>
import { onMounted, ref } from 'vue';
import BootupScreen from '../components/BootupScreen.vue';
import System from '../components/Dock/System.vue';
import SystemLoginScreen from './SystemLoginScreen.vue';

const isStarted = ref(true);
const isLoggedIn = ref(false);

const handleLogin = () => {
    isLoggedIn.value = true;
};

onMounted(() => {
    setTimeout(() => {
        isStarted.value = false;
    }, 3000);
});
</script>

<template>
    <div v-if="isStarted">
        <BootupScreen />
    </div>
    <div v-if="!isStarted && !isLoggedIn">
        <SystemLoginScreen @login="handleLogin" :class="{ 'fade-in': !isStarted }" />
    </div>
    <System v-if="isLoggedIn" :class="{ 'fade-in': isLoggedIn }" />
</template>

<style scoped></style>

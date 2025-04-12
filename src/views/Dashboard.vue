<script setup>
import { onMounted, ref } from 'vue';
import BootupScreen from '../components/BootupScreen.vue';
import Dock from '../components/Dock/Dock.vue';

const isStarted = ref(true);

onMounted(() => {
	setTimeout(() => {
		isStarted.value = false;
	}, 3000);
});
</script>

<template>
<div v-if="isStarted" class="center">
    <BootupScreen/>
</div>
<Dock :class="{ 'hidden': isStarted, 'fade-in': !isStarted }" />
</template>

<style scoped>
.black-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 999;
}

.gif-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.center{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
}

.login-screen{
    width: 100vw;
    height: 100vh;
}

.background-container{
    top: 0;
    left: 0;
    position: absolute;
    z-index: -1;
}
</style>

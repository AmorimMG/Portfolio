<script setup>
import { onMounted } from 'vue';
import AmorimLogo from '@/assets/images/cards/profilePic.png';
import MacOSBackground from '@/assets/images/dock/macOSbackground.jpg';
import { ref } from 'vue';
import Dock from '../components/Dock/Dock.vue';
import BootupScreen from '../components/BootupScreen.vue';

const isStarted = ref(true);

onMounted(() => {
	setTimeout(() => {
		isStarted.value = false;
	}, 3000);
});
</script>

<template>
<!-- <div v-if="!isStarted" class="login-screen center">
    <div style="position: relative;">
        <div style="position: absolute; top: -5px; left: -5px; width: 110px; height: 110px; border: 5px solid black; border-radius: 25%;"></div>
        <Image :src="AmorimLogo" alt="Image" width="100" style="top: -1px;" />
    </div>
    <h5 class="mt-3">Amorim Portfolio</h5>
    <div class="flex gap-2">
        <Button @click="isStarted = true" icon="pi pi-arrow-left" outlined class="p-button-rounded" />
        <Password placeholder="*****" :feedback="false" />
        <Button icon="pi pi-question" outlined class="p-button-rounded"/>
    </div>
    <img width="100%" height="100%" class="background-container" :src="MacOSBackground" />
</div> -->
<div v-if="isStarted" class="center">
    <BootupScreen/>
</div>
<Dock :class="{ 'hidden': isStarted, 'fade-in': !isStarted }" v-else />
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

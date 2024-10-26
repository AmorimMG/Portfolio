<script setup>
import { ref } from 'vue';
import AmorimLogo from '../assets/images/Cards/profilePic.png';
import Dock from '../components/Dock/Dock.vue';

const isStarted = ref(false);
</script>

<template>
<div v-if="!isStarted" class="login-screen center">
    <Avatar :image="AmorimLogo" class="mr-2" size="xlarge" shape="circle" />
    <h5 class="mt-3">Amorim Portfolio</h5>
    <div class="flex gap-2">
        <Button @click="isStarted = true" icon="pi pi-arrow-left" outlined class="p-button-rounded" />
        <Password v-model="value" placeholder="*****" :feedback="false" />
        <Button icon="pi pi-question" outlined class="p-button-rounded"/>
    </div>
    <img width="100%" height="100%" class="background-container" src="/src/assets/images/Dock/macOSbackground.jpg" />
</div>
<Dock v-else />
</template>

<style scoped>
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

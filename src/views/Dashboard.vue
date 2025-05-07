<script setup>
import { onMounted, ref } from 'vue';
import BootupScreen from '../components/BootupScreen.vue';
import System from '../components/Dock/System.vue';

const isStarted = ref(true);

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
    <System :class="{ hidden: isStarted, 'fade-in': !isStarted }" />
</template>

<style scoped></style>

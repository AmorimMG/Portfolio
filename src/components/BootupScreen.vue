<script setup lang="ts">
import { onMounted, ref } from 'vue';
const progress = ref(0);

onMounted(() => {
    const interval = setInterval(() => {
        if (progress.value < 100) {
            progress.value += 200 / 30;
        } else {
            clearInterval(interval);
        }
    }, 100);
});
</script>

<template>
    <div class="bootup-wrapper">
        <div class="gif-container">
            <img loading="lazy" class="logo-icon" src="@/assets/images/logo/flamorz.svg" alt="Flamorz Logo"
                width="250px" />
            <ProgressBar :value="progress" mode="determinate" :showValue="false"
                style="height: 9px; width: 250px; background: grey; margin-top: -30px" />
        </div>

        <div class="black-screen"></div>
    </div>
</template>


<style scoped>
:deep(.p-progressbar-value) {
    background: white !important;
}

.logo-icon {
    filter: brightness(0) invert(1);
    mix-blend-mode: normal;
}

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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>

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
  <div class="gif-container">
    <i class="apple-icon pi pi-apple"></i>
    <ProgressBar :value="progress" mode="determinate" :showValue="false" style="height: 9px; width: 250px; background: grey" />
  </div>

  <div class="black-screen"></div>
</template>

<style scoped>
.apple-icon {
  font-size: 100px;
  color: white;
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
  gap: 30px;
  justify-content: center;
  align-items: center;
}

.p-progressbar-value p-progressbar-value-animate {
    background: white !important;
}
</style>

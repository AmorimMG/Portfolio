<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import AnaglyphText from '../components/Anaglyth.vue';
import { useParallax } from '@vueuse/core';

const container = ref(null);
const { tilt, roll } = useParallax(container);

const parallax = reactive(useParallax(container));

const layerBase = {
    position: 'absolute',
    transition: '.3s ease-out all'
};

const layer = computed(() => ({
    ...layerBase,
    transform: `translateX(${parallax.tilt * 1000}px) translateY(${parallax.roll * 150}px) scale(1.33)`
}));
</script>

<template>
    <div ref="container" class="page">
        <div class="title-wrapper w-full center">
            <AnaglyphText class="center" :text="'Amorim'" />
        </div>
        <div class="grid w-full h-full center" :style="{ transform: `rotateX(${tilt}deg) rotateY(${roll}deg)` }">
            <router-link class="col-2 h-full wrapper" to="/dashboard">
                <div class="text-wrapper"><AnaglyphText :size="30" :text="'Dashboard'" /></div>
                <img class="background-card" :style="layer" src="../assets/images/intro/dashboard.png" />
            </router-link>
            <router-link class="col-2 h-full wrapper" to="/dock">
                <div class="text-wrapper"><AnaglyphText :size="30" :text="'Dock'" /></div>
                <img class="background-card" :style="layer" src="../assets/images/intro/dock.png" />
            </router-link>
            <router-link class="col-2 h-full wrapper" to="/threejs">
                <div class="text-wrapper"><AnaglyphText :size="30" :text="'3thd'" /></div>
                <img class="background-card" :style="layer" src="../assets/images/intro/3thd.png" />
            </router-link>
            <router-link class="col-2 h-full wrapper" to="/game">
                <div class="text-wrapper"><AnaglyphText :size="30" :text="'2d'" /></div>
                <img class="background-card" :style="layer" src="../assets/images/intro/2d.png" />
            </router-link>
            <router-link class="col-2 h-full wrapper" to="/pointerlock">
                <div class="text-wrapper"><AnaglyphText :size="30" :text="'1thd'" /></div>
                <img class="background-card" :style="layer" src="../assets/images/intro/1thd.png" />
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.page {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
    overflow-x: hidden;
    flex-direction: column;
    padding: 0;
}

.grid {
    gap: 10px;
}

.title-wrapper {
    position: absolute;
    z-index: 1;
    opacity: 0.5;
}

.wrapper {
    display: flex;
    position: relative;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
    justify-content: center;
    align-items: center;
}

.wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-size: cover;
    background-position: center;
    transition: transform 0.3s ease-out;
}

.wrapper:hover {
    transform: scale(1.05);
    border: 3px solid lightblue;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.background-card {
    overflow: hidden;
    z-index: -1;
    position: relative;
    height: 100%;
}

.text-wrapper {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
}
</style>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import AnaglyphText from '../components/Anaglyth.vue';
import { useParallax, useMediaQuery } from '@vueuse/core';
import Button from 'primevue/button';
import YAML from 'js-yaml';

const container = ref(null);
const { tilt, roll } = useParallax(container);
const isMobile = useMediaQuery('(max-width: 700px)');

const parallax = reactive(useParallax(container));

const layerBase = {
    position: 'absolute',
    transition: '.3s ease-out all'
};

const infoStyle = computed(() => ({
    opacity: 0.4,
    top: '20px',
    left: '40px',
    position: isMobile.value ? 'inherit' : 'absolute'
}));

const layer0 = computed(() => ({
    ...layerBase,
    transform: `translateX(${parallax.tilt * 10}px) translateY(${parallax.roll * 10}px) scale(1.33)`
}));

const layer1 = computed(() => ({
    ...layerBase,
    transform: `translateX(${parallax.tilt * 100}px) translateY(${parallax.roll * 100}px) scale(1.33)`
}));

const layer2 = computed(() => ({
    ...layerBase,
    transform: `translateX(${parallax.tilt * 150}px) translateY(${parallax.roll * 150}px) scale(1.33)`
}));

const layer3 = computed(() => ({
    ...layerBase,
    transform: `translateX(${parallax.tilt * 200}px) translateY(${parallax.roll * 200}px) scale(1.33)`
}));

const layer4 = computed(() => ({
    ...layerBase,
    transform: `translateX(${parallax.tilt * 500}px) translateY(${parallax.roll * 500}px) scale(1.33)`
}));
</script>

<template>
    <div ref="container" class="page">
        <div class="text-wrapper w-full center">
            <AnaglyphText class="center" style="bottom: 150px; right: 50px" :text="'Amorim'" />
        </div>
        <div class="grid w-full h-full center" :style="{ transform: `rotateX(${tilt}deg) rotateY(${roll}deg)` }">
            <router-link class="col-2 h-full wrapper" to="/">
                <img class="background-card" :style="layer2" src="../assets/images/cards/parallaxbackground.png" />
                <Button>Dashboard</Button>
            </router-link>
            <router-link class="col-2 h-full wrapper" to="/dock">
                <img class="background-card" :style="layer2" src="../assets/images/cards/parallaxbackground.png" />
                <Button>Dock</Button>
            </router-link>
            <router-link class="col-2 h-full wrapper" to="/threejs">
                <img class="background-card" :style="layer2" src="../assets/images/cards/parallaxbackground.png" />
                <Button>3D</Button>
            </router-link>
            <router-link class="col-2 h-full wrapper" to="/game">
                <img class="background-card" :style="layer2" src="../assets/images/cards/parallaxbackground.png" />
                <Button>2D</Button>
            </router-link>
            <router-link class="col-2 h-full wrapper" to="/pointerlock">
                <img class="background-card" :style="layer2" src="../assets/images/cards/parallaxbackground.png" />
                <Button>3thd</Button>
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

.text-wrapper {
    position: absolute;
    bottom: 25vw;
    z-index: 1;
}

.wrapper {
    display: flex;
    justify-content: center;
    align-content: center;
    position: relative;
    overflow: hidden;
    background-size: cover;
    background-repeat: no-repeat;
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

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.background-card {
    overflow: hidden;
    z-index: -1;
    position: relative;
}
</style>

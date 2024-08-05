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
</script>

<template>
    <div ref="container" class="page" :style="{ transform: `rotateX(${tilt}deg) rotateY(${roll}deg)` }">
        <img :style="layer0" src="../assets/images/parallaxbackground.png" />
        <AnaglyphText style="bottom: 150px; right: 50px" :text="'Amorim'" />
        <router-link to="/">
            <Button :style="layer1">Enter</Button>
            <pre :style="infoStyle">{{ YAML.dump(parallax) }}</pre>
        </router-link>
    </div>
</template>

<style>
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
    perspective: 1000px;
    overflow-y: hidden;
    overflow-x: hidden;

}

.centered-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>

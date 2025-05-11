<script setup>
import { onMounted, ref } from 'vue';
import { WeatherService } from '../../service/ThirdPartyEndpoints';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';

onMounted(async () => {
    try {
        const data = await WeatherService.getWeather();
        weather.value = data;
    } catch (error) {
        console.error('Failed to fetch weather:', error);
    }
});

const weather = ref([]);
const computedScale = ref(getComputedStyle(document.documentElement).getPropertyValue('--scale').trim());
</script>

<template>
    <div class="w-full h-full center flex-col gap-3">
        <div class="center">
            <div class="gap-3"><i class="pi pi-cloud"></i> Weather</div>
        </div>
        <VueNeonLight color="#ff00ff" :size="computedScale" :flash="false" style="color: white">{{ weather?.current?.temp_c }} º C</VueNeonLight>
        <VueNeonLight :size="computedScale" style="color: white"> {{ weather?.current?.condition?.text }} </VueNeonLight>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
</script>

<template>
    <div class="w-full h-full center flex-column gap-3">
        <div class="center">
            <div class="gap-3"><i class="pi pi-cloud"></i> Weather</div>
        </div>
        <VueNeonLight color="#ff00ff" size="$scale" :flash="false" style="color: white">{{ weather?.current?.temp_c }} º C</VueNeonLight>
        <VueNeonLight size="$scale" style="color: white"> {{ weather?.current?.condition?.text }} </VueNeonLight>
    </div>
</template>

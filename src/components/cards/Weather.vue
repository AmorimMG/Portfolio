<script setup>
import { ref, onMounted } from 'vue';
import { WeatherService } from '../../service/ThirdPartyEndpoints';
import CardEffect from '../CardEffect.vue';

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
    <div class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <h2 :class="{ glitch: isGlitchActive }">{{ weather?.current?.temp_c }} º</h2>
                <img :src="weather?.current?.condition?.icon" />
            </div>
        </CardEffect>
    </div>
</template>

<style scoped></style>

<script setup>
import { ref, onMounted } from 'vue';
import { ValorantService } from '../../service/ThirdPartyEndpoints';

const valorant = ref([]);
const imageAgent = ref([]);
const imagePeakRating = ref([]);

onMounted(async () => {
    try {
        const response = await ValorantService.getValorant();
        valorant.value = response.data;
        imageAgent.value = valorant.value.segments[5]?.metadata.imageUrl;
        imagePeakRating.value = valorant.value.segments[4]?.stats?.peakRating.metadata.iconUrl;
    } catch (error) {
        console.error('Failed to fetch valorant data:', error);
    }
});
</script>
<template>
    <div class="gap-2">
        <div class="center">
            <p>{{ valorant?.platformInfo?.platformUserHandle }}</p>
            <img width="30px" :src="valorant?.platformInfo?.avatarUrl" alt="Valorant" />
        </div>
        <div class="card-body">
            <img width="20px" :src="imageAgent" alt="Valorant" />
            <img width="20px" :src="imagePeakRating" alt="Valorant" />
        </div>
    </div>
</template>
<style lang="css">
.card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
</style>

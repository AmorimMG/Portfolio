<script setup>
import { ref } from 'vue';

const valorant = ref([]);
const imageAgent = ref([]);
const imagePeakRating = ref([]);

/* onMounted(async () => {
    try {
        const response = await ValorantService.getValorant();
        valorant.value = response.data;
        imageAgent.value = valorant.value.segments[5]?.metadata.imageUrl;
        imagePeakRating.value = valorant.value.segments[4]?.stats?.peakRating.metadata.iconUrl;
    } catch (error) {
        console.error('Failed to fetch valorant data:', error);
    }
}); */
</script>
<template>
    <Skeleton class="Skeleton"></Skeleton>
    <!--     <div class="gap-2">
        <div class="center">
            <p>{{ valorant?.platformInfo?.platformUserHandle }}</p>
            <img loading="lazy" width="30px" :src="valorant?.platformInfo?.avatarUrl" alt="Valorant" />
        </div>
        <div class="card-body">
            <img loading="lazy" width="20px" :src="imageAgent" alt="Valorant" />
            <img loading="lazy" width="20px" :src="imagePeakRating" alt="Valorant" />
        </div>
    </div>-->
</template>
<style lang="css">
.Skeleton {
    height: 100% !important;
}

.card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
</style>

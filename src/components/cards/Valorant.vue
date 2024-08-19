<script setup>
import { ref, onMounted } from 'vue';
import CardEffect from '../CardEffect.vue';
import { ValorantService } from '../../service/ThirdPartyEndpoints';

const valorant = ref([]);

onMounted(async () => {
    try {
        const response = await ValorantService.getValorant();
        valorant.value = response.data;
        console.log(valorant.value);
    } catch (error) {
        console.error('Failed to fetch valorant data:', error);
    }
});
</script>
<template>
    <div class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <img :src="valorant?.platformInfo?.avatarUrl" alt="Valorant" />
                <div class="card-body">
                    <h2>{{ valorant?.segments?.rank?.tiername }}</h2>
                </div>
            </div>
        </CardEffect>
    </div>
</template>

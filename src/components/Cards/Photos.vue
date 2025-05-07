<script setup>
import { onMounted, ref } from 'vue';
import { PhotoService } from '../../service/ThirdPartyEndpoints';
import CardEffect from '../CardEffect.vue';

onMounted(async () => {
    try {
        const data = await PhotoService.getImages();
        images.value = data;
    } catch (error) {
        console.error('Failed to fetch images:', error);
    }
});

const images = ref([]);
const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
</script>

<template>
    <div class="col-8 lg:col-9 xl:col-9">
        <CardEffect>
            <div class="card center w-full" style="padding: 0">
                <Galleria
                    :value="images"
                    :responsiveOptions="responsiveOptions"
                    :showThumbnails="false"
                    containerStyle="max-width: 600px"
                    :numVisible="5"
                    :circular="true"
                    :autoPlay="true"
                    :showIndicators="false"
                    :changeItemOnIndicatorHover="true"
                    :transitionInterval="2000"
                >
                    <template #item="slotProps">
                        <img loading="lazy" width="200px" height="200px" :src="slotProps.item.url" :alt="slotProps.item.id" style="display: block" />
                    </template>
                </Galleria>
            </div>
        </CardEffect>
    </div>
</template>

<style scoped></style>

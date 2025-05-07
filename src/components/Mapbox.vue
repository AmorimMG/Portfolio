<script setup>
import { ref } from 'vue';
import CardEffect from './CardEffect.vue';
import VueNeonLight from './VueNeonLight/vue-neon-light.vue';

const online = ref(false);

</script>
<template>
    <div class="col-span-4 lg:col-span-4 xl:col-span-3">
        <CardEffect>
            <div class="card mb-0 center" :style="{ padding: 0 }">
                <div class="center flex-col gap-2">
                    <div class="center">
                        <div class="title-container gap-3"><i class="pi pi-map"></i> MapBox</div>
                    </div>
                    <div class="flex flex-row gap-2">
                        <div v-if="online" ref="mapContainer" class="map-container"></div>
                        <VueNeonLight style="color: white" v-else>OFFLINE</VueNeonLight>
                        <span class="dot"></span>
                    </div>
                </div>
            </div>
        </CardEffect>
    </div>
</template>

<style scoped>
.map-container {
    flex: 1;
    width: 100%;
}

.title-container {
    display: flex;
    width: 150px;
    align-items: center;
    justify-content: start;
}

.dot {
    height: 10px;
    width: 10px;
    background-color: red;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
}
</style>

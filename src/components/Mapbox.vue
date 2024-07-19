<script setup>
import CardEffect from './CardEffect.vue';
</script>
<template>
    <div v-tooltip.top="'Location'" class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="card mb-0 center">
                <h5 :class="{ glitch: isGlitchActive }" class="lights" style="position: absolute">Tracking Offline <span class="red-dot"></span></h5>
            </div>
            <!--     <div ref="mapContainer" class="map-container"></div> -->
        </CardEffect>
    </div>
</template>

<style scoped>
.map-container {
    flex: 1;
    width: 100%;
}
</style>

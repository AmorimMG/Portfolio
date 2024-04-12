<script>
import mapboxgl from 'mapbox-gl';

export default {
    name: 'MapboxMap',
    data() {
        return {
            map: null,
        };
    },
    mounted() {
        mapboxgl.accessToken = 'pk.eyJ1IjoicmVjbm92ZSIsImEiOiJjbHV2a2lscmYwNGVjMmpwYmRqZHNtYTdvIn0.k3GNzaXx-423rxgLjno94A';
        this.initializeMap();
    },
    methods: {
        initializeMap() {
            this.map = new mapboxgl.Map({
                container: this.$refs.mapContainer,
                style: 'mapbox://styles/recnove/cluvknswr000901nr6vm27h1q/draft',
                center: [-44.040207108870035, -19.943651234047532],
                zoom: 10,
                bearing: 0,
                pitch: 0,
                antialias: true,
                hash: true,
                interactive: false,
                
            });

            // Add navigation control (optional)
            /* this.map.addControl(new mapboxgl.NavigationControl()); */
        }
    },
    beforeUnmount() {
        this.map.remove();
        this.map = null;
    }
};
</script>
<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped>
.map-container {
    flex: 1;
    width: 100%;
}
</style>

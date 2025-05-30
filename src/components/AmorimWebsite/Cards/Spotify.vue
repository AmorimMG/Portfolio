<script>
import { useToast } from 'primevue/usetoast';
import { RESTAPI } from '../../../service/api.js';
import CardEffect from '../../CardEffect.vue';
import VueNeonLight from '../../VueNeonLight/vue-neon-light.vue';

export default {
    components: {
        CardEffect,
        VueNeonLight
    },
    data() {
        return {
            toast: useToast(),
            currentTrack: null,
            lastTrack: null
        };
    },
    mounted() {
        this.getSpotifyData();
    },
    methods: {
        async getSpotifyData() {
            RESTAPI.ObterSpotify().then((response) => {
                if (response.data.currentTrack) {
                    const currentTrack = response.data.currentTrack;
                    this.currentTrack = {
                        name: currentTrack.name,
                        artist: currentTrack.artist,
                        album: currentTrack.album,
                        images: currentTrack.images,
                        url: currentTrack.href
                    };
                }

                if (response.data.lastTrack) {
                    const lastItem = response.data.lastTrack;
                    this.lastTrack = {
                        name: lastItem.name,
                        artist: lastItem.artist,
                        album: lastItem.album.name,
                        images: lastItem.images,
                        url: lastItem.url
                    };
                }
            });
        }
    }
};
</script>

<template>
    <div class="col-span-4 lg:col-span-4 xl:col-span-3">
        <CardEffect class="w-full">
            <div class="card page">
                <div class="album-info" v-if="currentTrack">
                    <a :href="currentTrack.url" target="_blank" rel="noopener noreferrer">
                        <div class="album-image"
                            :style="{ backgroundImage: 'url(' + currentTrack.images[0].url + ')' }">
                            <div class="overlayy">
                                <VueNeonLight :flash="false" color="#ff00ff90">{{ currentTrack.name }}</VueNeonLight>
                                <VueNeonLight :flash="false" style="color: white">{{ currentTrack.artist }}
                                </VueNeonLight>
                                <VueNeonLight :flash="false" color="#ff00ff90">{{ currentTrack.album }}</VueNeonLight>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="album-info" v-else-if="!currentTrack && lastTrack">
                    <a :href="lastTrack.url" target="_blank" rel="noopener noreferrer">
                        <div class="album-image" :style="{ backgroundImage: 'url(' + lastTrack.images[0].url + ')' }">
                            <div class="overlayy">
                                <VueNeonLight :flash="false" color="#ff00ff90">{{ lastTrack.name }}</VueNeonLight>
                                <VueNeonLight :flash="false" style="color: white">{{ lastTrack.artist }}</VueNeonLight>
                                <VueNeonLight :flash="false" color="#ff00ff90">{{ lastTrack.album }}</VueNeonLight>
                            </div>
                        </div>
                    </a>
                </div>
                <div v-else style="height: 100%">
                    <div class="album-info">
                        <a href="https://open.spotify.com/intl-pt/track/37IFFBgI7qnLKqGP15mmIu" target="_blank"
                            rel="noopener noreferrer">
                            <div class="album-image"
                                style="background-image: url('https://media.pitchfork.com/photos/6390cc1e12b41513f51f1700/16:9/w_1280,c_limit/Brakence-%20hypochondriac.jpeg')">
                                <div class="overlayy">
                                    <VueNeonLight :flash="false" color="#ff00ff90">venus fly trap</VueNeonLight>
                                    <VueNeonLight :flash="false" style="color: white">brakence</VueNeonLight>
                                    <VueNeonLight :flash="false" color="#ff00ff90">hypochondriac</VueNeonLight>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </CardEffect>
    </div>
</template>

<style scoped>
.page {
    width: 100%;
    height: 100% !important;
    aspect-ratio: 2 / 1;
    padding: 0;
}

.info {
    display: flex;
    align-items: row;
}

.album-info {
    width: 100%;
    height: 100%;
    padding: 5px;
    border-radius: 10px;
}

.album-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
}

.overlayy {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.overlayy h4 {
    margin-bottom: 5px;
    color: white;
}

.overlayy h5 {
    margin-bottom: 5px;
    color: white;
}

.overlayy h6 {
    margin-bottom: 0;
    color: white;
}
</style>

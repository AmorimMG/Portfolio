<script>
import { RESTAPI } from '../../service/api.js';
import { useToast } from 'primevue/usetoast';
import CardEffect from '../CardEffect.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';

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
    <div class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="card page">
                <!--                 <div class="title-container gap-3"><i class="pi pi-volume-up"></i> Spotify</div> -->
                <div class="album-info" v-if="currentTrack">
                    <a :href="currentTrack.url" target="_blank" rel="noopener noreferrer">
                        <div class="album-image" :style="{ backgroundImage: 'url(' + currentTrack.images[0].url + ')' }">
                            <div class="overlayy">
                                <VueNeonLight size="30px" :flash="false" color="#ff00ff90">{{ currentTrack.name }}</VueNeonLight>
                                <VueNeonLight size="25px" :flash="false" style="color: white">{{ currentTrack.artist }}</VueNeonLight>
                                <VueNeonLight size="20px" :flash="false" color="#ff00ff90">{{ currentTrack.album }}</VueNeonLight>
                                <!--                                 <h4>{{ currentTrack.name }}</h4>
                                <h5>{{ currentTrack.artist }}</h5>
                                <h6>Album: {{ currentTrack.album }}</h6> -->
                            </div>
                        </div>
                    </a>
                </div>
                <div class="album-info" v-else-if="!currentTrack && lastTrack">
                    <a :href="lastTrack.url" target="_blank" rel="noopener noreferrer">
                        <div class="album-image" :style="{ backgroundImage: 'url(' + lastTrack.images[0].url + ')' }">
                            <div class="overlayy">
                                <h4>{{ lastTrack.name }}</h4>
                                <h5>{{ lastTrack.artist }}</h5>
                                <h6>Album: {{ lastTrack.album }}</h6>
                            </div>
                        </div>
                    </a>
                </div>
                <div v-else style="height: 100%">
                    <div class="album-info">
                        <!--                         <div class="title-container gap-3"><i class="pi pi-volume-up"></i> Spotify</div> -->
                        <div class="overlayy">
                            <h2>No track currently playing</h2>
                        </div>
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

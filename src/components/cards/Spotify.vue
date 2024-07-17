<script>
import { RESTAPI } from '../../service/api.js';
import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            toast: useToast(),
            currentTrack: null,
            lastTrack: null,
            isLargeScreen: window.innerWidth > 992
        };
    },
    mounted() {
        this.getSpotifyData();
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
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
                        url: currentTrack.url
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
        },
        handleResize() {
            this.isLargeScreen = window.innerWidth > 992;
        }
    }
};
</script>

<template>
    
    <div v-tooltip.top="'Spotify Music'" class="col-4 lg:col-4 xl:col-3">
    <div v-if="isLargeScreen" class="card page">
        <div class="album-info" v-if="currentTrack">
            <div class="album-image" :style="{ backgroundImage: 'url(' + currentTrack.images[0].url + ')' }">
                <div class="overlayy">
                    <h2>{{ currentTrack.name }}</h2>
                    <h3>{{ currentTrack.artist }}</h3>
                    <h4>Album: {{ currentTrack.album }}</h4>
                </div>
            </div>
        </div>
            <h2 v-if="!currentTrack && lastTrack != null">Last Played Track:</h2>
            <div v-if="!currentTrack && lastTrack != null">
                <p>{{ lastTrack.name }} by {{ lastTrack.artist }}</p>
                <p>Album: {{ lastTrack.album }}</p>
            </div>
            <div v-if="!currentTrack && !lastTrack" style="height: 100%;">
            <div class="album-info">
                <div class="overlayy">
                    <h2>No track currently playing</h2>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="card page"> 
        <div class="album-info" v-if="currentTrack">
            <div class="album-image" :style="{ backgroundImage: 'url(' + currentTrack.images[0].url + ')' }">
                <div class="overlayy">
                    <h2>{{ currentTrack.name }}</h2>
                    <h3>{{ currentTrack.artist }}</h3>
                    <h4>Album: {{ currentTrack.album }}</h4>
                </div>
            </div>
        </div>
        <div class="album-info" v-if="!currentTrack && lastTrack">
            <div class="album-image" :style="{ backgroundImage: 'url(' + lastTrack?.images[0].url + ')' }">
                <div class="overlayy">
                    <h2>{{ lastTrack?.name }}</h2>
                    <h3>{{ lastTrack?.artist }}</h3>
                    <h4>Album: {{ lastTrack?.album }}</h4>
                </div>
            </div>
        </div>
        <div v-if="!currentTrack && !lastTrack" style="height: 100%;">
            <div class="album-info">
                <div class="overlayy">
                    <h2>No track currently playing</h2>
                </div>
            </div>
        </div>
    </div>
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

h6 {
    font-size: 0.8em;
}

.album-info {
    background-color: #1db954;
    width: 100%;
    height: 100%;
    padding: 5px;
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

.overlayy h2 {
    font-size: 24px;
    margin-bottom: 5px;
    color: white;
}

.overlayy h3 {
    font-size: 20px;
    margin-bottom: 5px;
    color: white;
}

.overlayy h4 {
    font-size: 16px;
    margin-bottom: 0;
    color: white;
}
</style>

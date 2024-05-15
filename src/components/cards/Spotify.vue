<script>
import { RESTAPI } from '../../service/api.js';
import { useToast } from 'primevue/usetoast';

export default {
    data() {
        return {
            toast: useToast(),
            currentTrack: null,
            lastTrack: null
        };
    },
    async mounted() {
        await this.getSpotifyData();
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

                    console.log(this.currentTrack);
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

                    console.log(this.lastTrack);
                }
            });
        }
    }
};
</script>

<template>
    <div class="container">
        <h2 v-if="currentTrack">Spotify</h2>
        <div class="info" v-if="currentTrack">
            <div>
                <h6>{{ currentTrack.name }} by {{ currentTrack.artist }}</h6>
                <h6>Album: {{ currentTrack.album }}</h6>
            </div>
            <img width="50%" height="50%" :src="currentTrack.images[0].url" />
        </div>
        <h2 v-if="!currentTrack">Last Played Track:</h2>
        <div v-if="!currentTrack && lastTrack">
            <p>{{ lastTrack.name }} by {{ lastTrack.artist }}</p>
            <p>Album: {{ lastTrack.album }}</p>
        </div>
    </div>
</template>

<style scoped>
.container {
    background-color: #1db954;
    width: 100%;
    height: 100%;
    padding: 20px;
    border-radius: 12px;
}
.info {
    display: flex;
    align-items: row;
}

h6 {
    font-size: 0.8em;
}
</style>

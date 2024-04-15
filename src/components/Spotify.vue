<script>
import { RESTAPI } from '../service/api.js';
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
            RESTAPI.ObterSpotify()
                .then((response) => {
                    if (response.data.currentTrack) {
                        this.currentTrack = {
                            name: response.data.currentTrack.item.name,
                            artist: response.data.currentTrack.item.artists[0].name,
                            album: response.data.currentTrack.item.album.name
                        };

                        console.log(this.currentTrack);
                    }

                    if (response.data.lastTrack) {
                        const lastItem = response.data.lastTrack.items[0].track;
                        this.lastTrack = {
                            name: lastItem.name,
                            artist: lastItem.artists[0].name,
                            album: lastItem.album.name
                        };

                        console.log(this.lastTrack);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.toast.add({
                        severity: 'error',
                        summary: error,
                        life: 3000
                    });
                });
        }
    }
};
</script>

<template>
    <div class="container">
        <h2 v-if="currentTrack">Currently Playing:</h2>
        <div v-if="currentTrack">
            <p>{{ currentTrack.name }} by {{ currentTrack.artist }}</p>
            <p>Album: {{ currentTrack.album }}</p>
        </div>
        <h2 v-else>Last Played Track:</h2>
        <div v-if="!currentTrack && lastTrack">
            <p>{{ lastTrack.name }} by {{ lastTrack.artist }}</p>
            <p>Album: {{ lastTrack.album }}</p>
        </div>
        <div v-else>
            <p>No track information available.</p>
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
</style>

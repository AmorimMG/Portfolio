<script>
import axios from 'axios';

export default {
    data() {
        return {
            currentTrack: null,
            lastTrack: null
        };
    },
    async mounted() {
        await this.getAccessToken();
        if (this.accessToken) {
            await this.getCurrentTrack();
            if (!this.currentTrack) {
                await this.getLastTrack();
            }
        }
    },
    methods: {
        async getAccessToken() {
            try {
                const response = await axios.post('https://accounts.spotify.com/api/token', `grant_type=client_credentials&client_id=${import.meta.env.VITE_SPOTIFY_CLIENT_ID_KEY}&client_secret=${import.meta.env.VITE_SPOTIFY_SECRET_KEY}&scope=user-read-recently-played`, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                if (response.data && response.data.access_token) {
                    this.accessToken = response.data.access_token;
                }
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        },
        async getCurrentTrack() {
            try {
                const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing?market=BR', {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    }
                });
                if (response.data && response.data.item) {
                    this.currentTrack = {
                        name: response.data.item.name,
                        artist: response.data.item.artists[0].name,
                        album: response.data.item.album.name
                    };
                }
            } catch (error) {
                console.error('Error fetching currently playing track:', error);
            }
        },
        async getLastTrack() {
            try {
                const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
                    headers: {
                        Authorization: `Bearer ${this.accessToken}`
                    },
                    params: {
                        limit: 1 // Retrieve only the last played track
                    }
                });
                if (response.data && response.data.items && response.data.items.length > 0) {
                    const lastItem = response.data.items[0].track;
                    this.lastTrack = {
                        name: lastItem.name,
                        artist: lastItem.artists[0].name,
                        album: lastItem.album.name
                    };
                }
            } catch (error) {
                console.error('Error fetching last played track:', error);
            }
        }
    }
};
</script>

<template>
    <div>
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

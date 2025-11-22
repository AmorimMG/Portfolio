<script setup>
import Button from 'primevue/button';
import Slider from 'primevue/slider';
import { computed, onMounted, ref, watch } from 'vue';
import CustomDialog from './CustomDialog.vue';

defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible']);

const audioRef = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.75);
const currentTrackIndex = ref(0);
const openMusicPlayer = ref(false);

const playlist = ref([
    {
        id: 1,
        title: 'Just A Joke',
        artist: 'Unknown Artist',
        src: '/sounds/JustAJoke.mp3',
        artwork: 'https://source.unsplash.com/random/400x400?music',
        artworkStatus: 'loading'
    },
    {
        id: 2,
        title: 'Epic Cinematic',
        artist: 'AudioJungle',
        src: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_Epic_Cinematic.mp3',
        artwork: 'https://source.unsplash.com/random/400x400?epic',
        artworkStatus: 'loading'
    },
    {
        id: 3,
        title: 'Motivation',
        artist: 'AlexiAction',
        src: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/AlexiAction/Anomalia/AlexiAction_-_Motivation.mp3',
        artwork: 'https://source.unsplash.com/random/400x400?motivation',
        artworkStatus: 'loading'
    },
    {
        id: 4,
        title: 'Inspiration',
        artist: 'AudioLibrary',
        src: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_Inspiration.mp3',
        artwork: 'https://source.unsplash.com/random/400x400?inspiration',
        artworkStatus: 'loading'
    },
    {
        id: 5,
        title: 'Uplifting Beats',
        artist: 'DJ Inspiro',
        src: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_Uplifting_Beats.mp3',
        artwork: 'https://source.unsplash.com/random/400x400?uplifting',
        artworkStatus: 'loading'
    },
    {
        id: 6,
        title: 'Chill Vibes',
        artist: 'DJ Chill',
        src: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_Chill_Vibes.mp3',
        artwork: 'https://source.unsplash.com/random/400x400?chill',
        artworkStatus: 'loading'
    }
]);

const currentTrack = computed(() => playlist.value[currentTrackIndex.value]);

const togglePlay = () => {
    if (!audioRef.value) return;
    if (isPlaying.value) {
        audioRef.value.pause();
    } else {
        audioRef.value.play();
    }
    isPlaying.value = !isPlaying.value;
};

const playTrack = (index) => {
    currentTrackIndex.value = index;
    // Auto-play next track
    watch(currentTrack, (newTrack) => {
        // Reset artwork status for the new track to show loading spinner
        if (newTrack.artworkStatus === 'error') {
            newTrack.artworkStatus = 'loading';
        }
        if (audioRef.value) {
            audioRef.value.play().then(() => isPlaying.value = true);
        }
    }, { once: true });
};

const nextTrack = () => {
    const nextIndex = (currentTrackIndex.value + 1) % playlist.value.length;
    playTrack(nextIndex);
};

const prevTrack = () => {
    const prevIndex = (currentTrackIndex.value - 1 + playlist.value.length) % playlist.value.length;
    playTrack(prevIndex);
};

const updateTime = (event) => {
    currentTime.value = event.target.currentTime;
    duration.value = event.target.duration;
};

const seek = (event) => {
    if (!audioRef.value) return;
    const width = event.currentTarget.clientWidth;
    const clickX = event.offsetX;
    const durationValue = audioRef.value.duration;
    audioRef.value.currentTime = (clickX / width) * durationValue;
};

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

watch(volume, (newVolume) => {
    if (audioRef.value) {
        audioRef.value.volume = newVolume;
    }
});

const closeModal = () => {
    emit('update:visible', false);
    openMusicPlayer.value = false;
};

const onImgLoad = (track) => {
    track.artworkStatus = 'loaded';
};

const onImgError = (track) => {
    track.artworkStatus = 'error';
};

onMounted(() => {
    if (audioRef.value) {
        audioRef.value.volume = volume.value;
    }
});

</script>

<template>
            <Button v-if="!visible" text class="w-full h-full" @click="openMusicPlayer = true"
            style="width: 100%; height: 100%; justify-content: center">
            <!-- You might want a specific icon here -->
        </Button>
    <CustomDialog :visible="visible || openMusicPlayer" @update:visible="closeModal" :maximized="false" header="Music Player" :style="{ width: '380px' }">
        <div class="music-player">
            <div class="artwork-container">
                <div v-if="currentTrack.artworkStatus === 'loading'" class="fallback-icon-container">
                    <i class="pi pi-spin pi-spinner fallback-icon"></i>
                </div>
                <img 
                    v-show="currentTrack.artworkStatus !== 'error'"
                    :src="currentTrack.artwork" 
                    alt="Artwork" 
                    class="artwork-img" 
                    @load="onImgLoad(currentTrack)"
                    @error="onImgError(currentTrack)" 
                />
                <div v-if="currentTrack.artworkStatus === 'error'" class="fallback-icon-container">
                    <i class="pi pi-headphones fallback-icon"></i>
                </div>
                <div class="artwork-overlay"></div>
            </div>

            <div class="track-info">
                <h3 class="track-title">{{ currentTrack.title }}</h3>
                <p class="track-artist">{{ currentTrack.artist }}</p>
            </div>

            <div class="progress-bar-container" @click="seek">
                <div class="progress-bar" :style="{ width: (currentTime / duration) * 100 + '%' }"></div>
            </div>
            <div class="time-display">
                <span>{{ formatTime(currentTime) }}</span>
                <span>{{ formatTime(duration || 0) }}</span>
            </div>

            <div class="controls">
                <Button icon="pi pi-step-backward" class="p-button-rounded p-button-text" @click="prevTrack" />
                <Button :icon="isPlaying ? 'pi pi-pause' : 'pi pi-play'" class="p-button-rounded play-button" @click="togglePlay" />
                <Button icon="pi pi-step-forward" class="p-button-rounded p-button-text" @click="nextTrack" />
            </div>

            <div class="volume-control">
                <i class="pi pi-volume-down"></i>
                <Slider v-model="volume" :min="0" :max="1" :step="0.01" class="volume-slider" />
                <i class="pi pi-volume-up"></i>
            </div>

            <div class="playlist">
                <div v-for="(track, index) in playlist" :key="track.id" class="playlist-item" :class="{ active: index === currentTrackIndex }" @click="playTrack(index)">
                    <div class="playlist-artwork-wrapper">
                        <div v-if="track.artworkStatus === 'loading'" class="fallback-icon-container">
                            <i class="pi pi-spin pi-spinner fallback-icon"></i>
                        </div>
                        <img 
                            v-show="track.artworkStatus !== 'error'"
                            :src="track.artwork" 
                            alt="artwork" 
                            class="playlist-artwork" 
                            @load="onImgLoad(track)"
                            @error="onImgError(track)"
                        />
                        <div v-if="track.artworkStatus === 'error'" class="fallback-icon-container">
                            <i class="pi pi-headphones fallback-icon"></i>
                        </div>
                    </div>
                    <div class="playlist-track-info">
                        <div class="playlist-title">{{ track.title }}</div>
                        <div class="playlist-artist">{{ track.artist }}</div>
                    </div>
                </div>
            </div>

            <audio ref="audioRef" :src="currentTrack.src" @timeupdate="updateTime" @ended="nextTrack" @loadedmetadata="updateTime"></audio>
        </div>
    </CustomDialog>
</template>

<style scoped>
.music-player {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 25px;
    background: rgba(44, 62, 80, 0.85);
    backdrop-filter: blur(15px) saturate(180%);
    -webkit-backdrop-filter: blur(15px) saturate(180%);
    color: white;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);
    height: 100%;
}

.artwork-container {
    position: relative;
    width: 220px;
    height: 220px;
    margin-bottom: 25px;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease;
}

.artwork-container:hover {
    transform: scale(1.05);
}

.artwork-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #2c3e50; /* Added background to prevent flash of empty space */
}

.fallback-icon-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2c3e50; /* Cor de fundo do player */
}

.fallback-icon {
    font-size: 5rem; /* Tamanho grande para a arte principal */
    color: #bdc3c7;
}

.playlist-artwork-wrapper .fallback-icon {
    font-size: 1.8rem; /* Tamanho menor para a playlist */
}


.artwork-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 50%);
}

.track-info {
    text-align: center;
    margin-bottom: 20px;
}

.track-title {
    font-size: 1.6em;
    font-weight: 600;
    margin: 0;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

.track-artist {
    font-size: 1em;
    color: #ecf0f1;
    margin: 5px 0 0;
}

.progress-bar-container {
    width: 100%;
    height: 8px;
    background-color: rgba(52, 73, 94, 0.7);
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 8px;
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #5dade2);
    border-radius: 4px;
    transition: width 0.1s linear;
    box-shadow: 0 0 10px #3498db;
}

.time-display {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 0.85em;
    color: #bdc3c7;
    margin-bottom: 20px;
}

.controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    margin-bottom: 25px;
}

.controls .p-button {
    color: #ecf0f1;
    transition: all 0.3s ease;
}

.controls .p-button:hover {
    color: #3498db;
    background: rgba(255,255,255,0.1);
}

.play-button {
    width: 65px;
    height: 65px;
    background: linear-gradient(145deg, #3a506b, #2c3e50);
    box-shadow: 5px 5px 10px #253444, -5px -5px 10px #33485c;
    border: none;
}

.play-button:hover {
    background: linear-gradient(145deg, #2c3e50, #3a506b);
}

.volume-control {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 25px;
}

.volume-control .pi {
    color: #bdc3c7;
}

.volume-slider {
    flex-grow: 1;
}

.playlist {
    width: 100%;
    flex-grow: 1; /* Faz a playlist ocupar o espaço restante */
    overflow-y: auto;
    border-top: 1px solid rgba(52, 73, 94, 0.5);
    padding-top: 15px;
}

/* Custom scrollbar for playlist */
.playlist::-webkit-scrollbar {
  width: 6px;
}
.playlist::-webkit-scrollbar-track {
  background: transparent;
}
.playlist::-webkit-scrollbar-thumb {
  background: #34495e;
  border-radius: 3px;
}
.playlist::-webkit-scrollbar-thumb:hover {
  background: #4a627a;
}

.playlist-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 5px;
}

.playlist-item:hover {
    background-color: rgba(52, 73, 94, 0.7);
}

.playlist-item.active {
    background-color: #3498db;
    box-shadow: 0 0 15px rgba(52, 152, 219, 0.5);
}

.playlist-artwork-wrapper {
    width: 45px;
    height: 45px;
    border-radius: 6px;
    margin-right: 12px;
    position: relative;
    overflow: hidden;
    background-color: #34495e; /* Placeholder enquanto a imagem carrega */
}

.playlist-artwork {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #34495e; /* Added background to prevent flash of empty space */
}

.playlist-track-info {
    flex-grow: 1;
    min-width: 0;
}

.playlist-title {
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.playlist-artist {
    font-size: 0.9em;
    color: #bdc3c7;
}
</style>

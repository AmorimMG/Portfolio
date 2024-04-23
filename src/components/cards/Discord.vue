<script setup>
import { ref, onMounted } from 'vue';
import { RESTAPI } from '../../service/api.js';
import { useToast } from 'primevue/usetoast';

const spotifyData = ref();
const discordData = ref();
const online = ref(false);
const toast = useToast();

const props = defineProps({
    isGlitchActive: Boolean
});

const getDiscordInfo = () => {
    RESTAPI.ObterDiscord()
        .then((response) => {
            console.log(response);
            discordData.value = response.data;

            spotifyData.value = discordData.value.data.spotify;

            console.log(spotifyData.value);
            if (discordData.value.data.discord_status === 'online') {
                online.value = true;
            } else {
                online.value = false;
            }
        })
        .catch((error) => {
            console.log(error);
            toast.add({
                severity: 'error',
                summary: error,
                life: 3000
            });
        });
};

onMounted(() => {
    getDiscordInfo();
    setInterval(getDiscordInfo, 150000);
});
</script>

<template>
    <div class="card mb-0 center" :style="{ backgroundColor: online ? '#35AC8C' : '#FF5733' }">
        {{ discordData?.discord_status }}
        <h2 :class="{ glitch: props.isGlitchActive }" v-if="online"><span class="dot"></span> ONLINE</h2>
        <h2 :class="{ glitch: props.isGlitchActive }" v-else><span class="dot"></span> OFFLINE</h2>
    </div>
</template>

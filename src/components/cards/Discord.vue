<script setup>
import { ref, onMounted } from 'vue';
import { RESTAPI } from '../../service/api.js';
import { useToast } from 'primevue/usetoast';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CardEffect from '../CardEffect.vue';

const spotifyData = ref();
const discordData = ref();
const online = ref(false);
const toast = useToast();

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
    <div class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="card mb-0 center" :style="{ padding: 0 }">
                <div class="center flex-column gap-2">
                    <div class="center">
                        <div class="title-container gap-3"><i class="pi pi-discord"></i> Discord</div>
                    </div>
                    <div class="flex flex-row gap-2">
                        <VueNeonLight color="#ff00ff" size="30px" :flash="false" style="color: white" v-if="online">ONLINE</VueNeonLight>
                        <VueNeonLight size="30px" style="color: white" v-else>OFFLINE</VueNeonLight>
                        <span class="dot"></span>
                    </div>
                </div>
            </div>
        </CardEffect>
    </div>
</template>

<style scoped>
.title-container {
    display: flex;
    width: 150px;
    align-items: center;
    justify-content: start;
}

.dot {
    height: 20px;
    width: 20px;
    background-color: red;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
}
</style>

<script setup>
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from "vue";
import { RESTAPI } from "../../service/api.js";
import VueNeonLight from "../VueNeonLight/vue-neon-light.vue";

const spotifyData = ref();
const discordData = ref();
const online = ref(false);
const toast = useToast();

const getDiscordInfo = () => {
	RESTAPI.ObterDiscord()
		.then((response) => {
			discordData.value = response.data;

			spotifyData.value = discordData.value.data.spotify;

			if (discordData.value.data.discord_status === "online") {
				online.value = true;
			} else {
				online.value = false;
			}
		})
		.catch((error) => {
			console.log(error);
			toast.add({
				severity: "error",
				summary: error,
				life: 3000,
			});
		});
};

onMounted(() => {
	getDiscordInfo();
	setInterval(getDiscordInfo, 150000);
});
</script>

<template>
    <div class="w-full h-full center flex-column gap-3">
        <div class="center">
            <div class="gap-2"><i class="pi pi-discord"></i> Discord</div>
        </div>
        <div class="flex flex-row gap-2">
            <VueNeonLight color="#ff00ff" size="15px" :flash="false" style="color: white" v-if="online">ONLINE</VueNeonLight>
            <VueNeonLight size="15px" style="color: white" v-else>OFFLINE</VueNeonLight>
            <span class="dot"></span>
        </div>
    </div>
</template>
<style scoped>
.dot {
    height: 10px;
    width: 10px;
    background-color: red;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { RESTAPI } from '../../service/api.js';
import { useToast } from 'primevue/usetoast';

const isHoveredGithub = ref(false);
const isHoveredInstagram = ref(false);
const isHoveredLinkedin = ref(false);
const isHoveredSteam = ref(false);
const steamData = ref();

const toast = useToast();

const getSteamInfo = async (steamid, steamkey) => {
    RESTAPI.ObterSteam(steamid, steamkey)
        .then((response) => {
            steamData.value = response.data.response.players[0];
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
    getSteamInfo();
});
</script>
<template>
  <div id="ClusterLinks" class="col-6 lg:col-6 xl:col-3 center">  
    <div class="cluster" style="margin: 10px">
        <div class="little-card center" style="background-color: #9730a3">
            <a
                style="background-image: url('/src/assets/images/instagram.svg'); background-size: cover"
                class="relative"
                href="https://www.instagram.com/amorim.gg_/"
                target="_blank"
                rel="noopener noreferrer"
                @mouseenter="isHoveredInstagram = true"
                @mouseleave="isHoveredInstagram = false"
                :class="{ lights: isHoveredInstagram }"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    class="stroke-white dark:stroke-gray-900 bottom-0 right-0 m-2 md:mb-5 xl:m-5 rotate-45 mb-2 mr-2 w-8 h-8 lg:w-14 lg:h-14 md:w-10 md:h-10 hover:text-white"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                </svg>
            </a>
        </div>
        <div class="little-card center" style="background-color: #0274b3">
            <a
                style="background-image: url('/src/assets/images/linkedin.svg'); background-size: cover"
                class="relative"
                href="https://www.linkedin.com/in/gabrielamorim0/"
                target="_blank"
                rel="noopener noreferrer"
                @mouseenter="isHoveredLinkedin = true"
                @mouseleave="isHoveredLinkedin = false"
                :class="{ lights: isHoveredLinkedin }"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    class="stroke-white dark:stroke-gray-900 bottom-0 right-0 m-2 md:mb-5 xl:m-5 rotate-45 mb-2 mr-2 w-8 h-8 lg:w-14 lg:h-14 md:w-10 md:h-10 hover:text-white"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                </svg>
            </a>
        </div>
        <div class="little-card center" @mouseenter="isHoveredSteam = true" @mouseleave="isHoveredSteam = false" :class="{ hover: isHoveredSteam }" style="background-size: cover" :style="{ backgroundImage: 'url(/src/assets/images/steamlogo.jpg)' }">
            <a
                style="background-image: url('https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1892420/6a93ba5ed4cda296ae84002f871148f43727abdc.gif'); background-size: cover"
                class="relative"
                :href="steamData?.profileurl"
                target="_blank"
                rel="noopener noreferrer"
                @mouseenter="isHoveredSteam = true"
                @mouseleave="isHoveredSteam = false"
                :class="{ lights: isHoveredSteam, backgroundImage: steamData?.avatarfull }"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    class="stroke-white dark:stroke-gray-900 bottom-0 right-0 m-2 md:mb-5 xl:m-5 rotate-45 mb-2 mr-2 w-8 h-8 lg:w-14 lg:h-14 md:w-10 md:h-10 hover:text-white"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                </svg>
            </a>
        </div>
        <div class="little-card center" style="background-color: #f9cf87">
            <a
                style="background-image: url('/src/assets/images/github.svg'); background-size: cover"
                class="relative"
                href="https://github.com/AmorimMG"
                target="_blank"
                rel="noopener noreferrer"
                @mouseenter="isHoveredGithub = true"
                @mouseleave="isHoveredGithub = false"
                :class="{ lights: isHoveredGithub }"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    aria-hidden="true"
                    class="stroke-white dark:stroke-gray-900 bottom-0 right-0 m-2 md:mb-5 xl:m-5 rotate-45 mb-2 mr-2 w-8 h-8 lg:w-14 lg:h-14 md:w-10 md:h-10 hover:text-white"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z"></path>
                </svg>
            </a>
        </div>
    </div>
</div>  
</template>

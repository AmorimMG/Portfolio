<script setup>
import { ref, onMounted, watchEffect, watch, onUnmounted } from 'vue';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import FloatLabel from 'primevue/floatlabel';
import Textarea from 'primevue/textarea';
import DashboardTimeline from '../components/HeatMap.vue';
import ThreeJSComponent from '../components/ThreeJS.vue';
import MapboxMap from '../components/Mapbox.vue';
import Chart from '../components/Chart.vue';
import Terminal from '../components/Terminal.vue';
import Stack from '../components/Stack.vue';
import Spotify from '../components/Spotify.vue';
import { formatMessage } from '../service/localization';
import { setLanguageCookie, getLanguageCookie, setDarkThemeCookie } from '../service/session';
import { RESTAPI } from '../service/api.js';
import AppConfig from '../layout/AppConfig.vue';

const toast = useToast();

const discordData = ref();
const steamData = ref();
const spotifyData = ref();
const overlayPanel = ref();
const currentTime = ref();
const appConfigRef = ref();
const lastFMData = ref(null);
const iframe = ref(null);

const isDay = ref(false);
const overlayActive = ref(true);
const online = ref(false);
const lastFMVisible = ref(false);
const emailVisible = ref(false);
const cvVisible = ref(false);
const isStarted = ref(false);
const isHoveredGithub = ref(false);
const isHoveredInstagram = ref(false);
const isHoveredLinkedin = ref(false);
const isHoveredMail = ref(false);
const isHoveredSteam = ref(false);
const showImage = ref(false);
const isGlitchActive = ref(false);
const isGlitchPageActive = ref(false);

const name = ref('');
const email = ref('');
const message = ref('');

const isSmallScreen = ref(false);
const isMediumScreen = ref(false);

const dropdownValues = ref([
    { name: 'Português', code: 'BR', value: 'pt' },
    { name: 'Español', code: 'ES', value: 'es' },
    { name: 'English', code: 'US', value: 'en' }
]);

const defaultLanguage = dropdownValues.value.find((item) => item.value === getLanguageCookie());

const dropdownValue = ref(defaultLanguage || dropdownValues.value[0]);

const translations = ref({
    gblHi: '',
    gblAboutMe: '',
    gblInterests: '',
    gblSpotify: '',
    gblBrazil: ''
});

function updateTranslations(language) {
    translations.value.gblHi = formatMessage('gblHi', language);
    translations.value.gblAboutMe = formatMessage('gblAboutMe', language);
    translations.value.gblInterests = formatMessage('gblInterests', language);
    translations.value.gblSpotify = formatMessage('gblSpotify', language);
    translations.value.gblBrazil = formatMessage('gblBrazil', language);

    applyGlitchEffect();
}

function downloadIframeContent(iframeId) {
    var iframe = document.getElementById(iframeId);

    if (!iframe) {
        console.error('Iframe not found');
        return;
    }

    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    if (!iframeDoc) {
        console.error('Cannot access iframe document');
        return;
    }

    var blob = new Blob([iframeDoc.documentElement.outerHTML], { type: 'text/html' });

    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'iframe_content.html';

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

const updateScreenSize = () => {
    isSmallScreen.value = window.innerWidth <= 991;
    isMediumScreen.value = window.innerWidth >= 992 && window.innerWidth < 1960;

    console.log(isMediumScreen.value);
    console.log(isSmallScreen.value);
};

const openCV = () => {
    cvVisible.value = true;
};

const openLastFM = () => {
    lastFMVisible.value = true;
};

const openEmail = () => {
    emailVisible.value = true;
};

const closePopup = () => {
    cvVisible.value = false;
    lastFMVisible.value = false;
    emailVisible.value = false;
};

const toggle = (event) => {
    overlayPanel.value.toggle(event);
};

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

const getLastFMInfo = (lastFMUsername, lastFMApiKey) => {
    RESTAPI.ObterLastFM(lastFMUsername, lastFMApiKey)
        .then((response) => {
            console.log(response);
            lastFMData.value = response.data.weeklytrackchart.track;
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

const toggleOverlay = () => {
    applyGlitchPageEffect();
    overlayActive.value = !overlayActive.value;

    if (overlayActive.value === true) {
        setDarkThemeCookie(overlayActive.value);
    } else {
        setDarkThemeCookie(overlayActive.value);
    }

    return overlayActive.value;
};

const getCurrentTime = () => {
    const brazilTime = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const timeComponents = brazilTime.split(', ')[1].split(':');
    let hour = parseInt(timeComponents[0]);
    let meridiem = 'AM';

    if (hour >= 12) {
        meridiem = 'PM';
        hour -= 12;
    }

    if (hour === 0) {
        hour = 12;
    }

    currentTime.value = `${hour}:${timeComponents[1]} ${meridiem}`;
    isDay.value = hour >= 6 && hour < 18;
};

const applyGlitchEffect = () => {
    isGlitchActive.value = true;
    setTimeout(() => {
        isGlitchActive.value = false;
    }, 2000);
};

const applyGlitchPageEffect = () => {
    isGlitchPageActive.value = true;
    setTimeout(() => {
        isGlitchPageActive.value = false;
    }, 2000);
};

const sendEmail = async () => {
    const body = {
        name: name.value,
        email: email.value,
        message: message.value
    };

    RESTAPI.EnviarEmail(body)
        .then((response) => {
            if (response.ok) {
                toast.add('Email sent successfully');
                name.value = '';
                email.value = '';
                message.value = '';
            } else {
                toast.add('Failed to send email');
            }
        })
        .catch((error) => {
            toast.add({
                severity: 'error',
                summary: error,
                life: 3000
            });
        });
};

onMounted(() => {
    updateScreenSize();
    getCurrentTime();
    getDiscordInfo();
    getLastFMInfo('RecNove');
    getSteamInfo();

    setInterval(getDiscordInfo, 150000);
    setInterval(getCurrentTime, 1000);
    setTimeout(() => {
        isStarted.value = true;
    }, 2000);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize);
});

watchEffect(() => {
    const cookieValue = getLanguageCookie();
    if (cookieValue) {
        updateTranslations(cookieValue);
    } else {
        setLanguageCookie('en');
        updateTranslations('en');
    }
});

watch(dropdownValue, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        setLanguageCookie(newValue.value);
        updateTranslations(newValue.value);
    }
});
</script>

<template>
    <div v-if="!isStarted" class="center" style="intro-div">
        <img class="gif-container" src="/src/assets/images/glitchIntroduction.gif" />
        <div class="black-screen"></div>
    </div>
    <transition name="fade">
        <div :class="{ glitch: isGlitchPageActive }" v-show="isStarted" class="grid">
            <div class="col-12 lg:col-12 xl:col-6 header">
                <div class="card mb-0" style="user-select: text" @mouseenter="showImage = true" @mouseleave="showImage = false">
                    <div class="mb-3" style="text-align: start; position: relative">
                        <h3 :class="{ glitch: isGlitchActive }" class="center">{{ translations.gblHi }}</h3>
                        <br />
                        <p :class="{ glitch: isGlitchActive }" style="font-size: 18px">
                            {{ translations.gblAboutMe }}
                            <a href="https://www.fiap.com.br/" target="_blank" rel="noopener noreferrer" style="color: #abcb1a" class="underline" @mouseenter="toggle" @mouseleave="toggle">FIAP</a>
                        </p>
                        <br />
                        <p :class="{ glitch: isGlitchActive }" style="font-size: 15px">
                            {{ translations.gblInterests }}
                        </p>
                        <img :class="{ 'animated-image': true, show: showImage, 'animated-image-hide': !showImage }" src="/src/assets/images/profilePic.png" alt="Image" />
                    </div>
                </div>
            </div>
            <div class="col-6 lg:col-6 xl:col-3 opcoes">
                <!-- <h6 class="lights">Opções</h6> -->
                <div class="cluster" style="margin: 0 !important">
                    <div class="little-card center">
                        <Dropdown :showClear="false" v-model="dropdownValue" :options="dropdownValues" optionLabel="name" class="dropdown flex align-items-center">
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex align-items-center">
                                    <img :alt="slotProps.value.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.value.code.toLowerCase()}`" style="width: 40px" />
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                            <template #dropdownicon>
                                <i class="pi pi-chevron-down"></i>
                            </template>
                            <template #option="slotProps">
                                <div class="flex align-items-center">
                                    <img :alt="slotProps.option.label" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`mr-2 flag flag-${slotProps.option.code.toLowerCase()}`" />
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                        </Dropdown>
                    </div>
                    <div class="little-card center">
                        <div class="center" style="cursor: pointer">
                            <button class="p-btn p-link layout-topbar-button" type="button" @click="appConfigRef.onDarkModeChange(toggleOverlay(!overlayActive))" :class="{ rotate: overlayActive, 'rotate-reverse': !overlayActive }">
                                <img id="bulb" src="/src/assets/images/bulb.png" width="25px" style="cursor: pointer" />
                            </button>
                        </div>
                    </div>
                    <div class="little-card center">
                        <div class="center">
                            <button class="p-btn p-link layout-topbar-button" type="button" @click="appConfigRef.onConfigButtonClick()" style="">
                                <i class="pi pi-cog" style="font-size: 25px"></i>
                            </button>
                            <app-config ref="appConfigRef"></app-config>
                        </div>
                    </div>
                    <div class="little-card center" style="background-size: cover" :style="{ backgroundImage: !isDay ? 'url(/src/assets/images/day.jpg)' : 'url(/src/assets/images/night.jpg)' }">
                        <div class="center">
                            <h6 :class="{ glitch: isGlitchActive }" class="greenLights">{{ currentTime }}</h6>
                            <h6 :class="{ glitch: isGlitchActive }" class="greenLights">{{ translations.gblBrazil }}</h6>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-6 lg:col-6 xl:col-3 links">
                <!-- <h6 class="lights">Links</h6> -->
                <div class="cluster" style="margin: 0 !important">
                    <div class="little-card center" style="background-color: #9730a3">
                        <a
                            style="background-image: url('/src/assets/images/instagram.svg'); background-size: cover; width: 50%; height: 50%"
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
                            style="background-image: url('/src/assets/images/linkedin.svg'); background-size: cover; width: 50%; height: 50%"
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
                    <div
                        class="little-card center"
                        @mouseenter="isHoveredSteam = true"
                        @mouseleave="isHoveredSteam = false"
                        :class="{ hover: isHoveredSteam }"
                        style="background-size: cover"
                        :style="{ backgroundImage: 'url(/src/assets/images/steamlogo.jpg)' }"
                    >
                        <a
                            style="background-image: url('https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1892420/6a93ba5ed4cda296ae84002f871148f43727abdc.gif'); background-size: cover; width: 50%; height: 50%"
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
                            style="background-image: url('/src/assets/images/github.svg'); background-size: cover; width: 50%; height: 50%"
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
            <div class="col-8 lg:col-8 xl:col-3 spotify">
                <!--                 <div v-if="spotifyData" class="card" style="background-color: #1db954">
                    <div class="spotify">
                        <h5 class="lights spotify-title">{{ translations.gblSpotify }}...</h5>
                        <div class="spotify-texts">
                            <p :class="{ glitch: isGlitchActive }" style="color: white; text-overflow: ellipsis">
                                {{ spotifyData?.song }}
                            </p>
                            <p :class="{ glitch: isGlitchActive }" style="color: white; text-overflow: ellipsis">
                                {{ spotifyData?.album }}
                            </p>
                        </div>
                        <div class="img">
                            <img :src="spotifyData?.album_art_url" class="spotify-img" />
                        </div>
                    </div>
                </div>
                <div v-else class="card mb-0 center" style="background-color: #ff5733">
                    <h2 :class="{ glitch: isGlitchActive }" class="lights">SPOTIFY</h2>
                    <h6 :class="{ glitch: isGlitchActive }" class="lights">OFFLINE</h6>
                </div> -->
                <Spotify />
            </div>
            <div class="col-4 lg:col-4 xl:col-3 online">
                <div class="card mb-0 center" :style="{ backgroundColor: online ? '#35AC8C' : '#FF5733' }">
                    {{ discordData?.discord_status }}
                    <h2 :class="{ glitch: isGlitchActive }" v-if="online"><span class="dot"></span> ONLINE</h2>
                    <h2 :class="{ glitch: isGlitchActive }" v-else><span class="dot"></span> OFFLINE</h2>
                </div>
            </div>
            <div class="col-4 lg:col-4 xl:col-3 email">
                <div class="card mb-0 center" style="background-color: #7225d6; padding: 0" @mouseenter="isHoveredMail = true" @mouseleave="isHoveredMail = false">
                    <Button @click="openEmail()" style="width: 100%; height: 100%; background-color: #7225d6; border: none; justify-content: center">
                        <img src="/src/assets/images/Mail.svg" width="50%" :class="{ lights: isHoveredMail }" />
                    </Button>
                </div>
            </div>
            <div class="col-4 lg:col-4 xl:col-3 localizacao">
                <div class="card mb-0 center" style="padding: 0; opacity: 0.5">
                    <h3 :class="{ glitch: isGlitchActive }" class="lights" style="opacity: 1; position: absolute">Tracking Offline <span class="red-dot"></span></h3>
                    <MapboxMap />
                </div>
            </div>
            <div class="col-4 lg:col-4 xl:col-3 space-between">
                <div class="card mb-0 center" style="padding: 0">
                    <Button @click="openCV()" style="width: 100%; height: 100%; justify-content: center">
                        <h2 :class="{ glitch: isGlitchActive }">CV</h2>
                    </Button>
                </div>
            </div>
            <div class="col-4 lg:col-4 xl:col-3 space-between">
                <div class="card mb-0 center" style="padding: 0">
                    <Button @click="openLastFM()" style="width: 100%; height: 100%; justify-content: center">
                        <h2 :class="{ glitch: isGlitchActive }">Last.FM Statics</h2>
                    </Button>
                </div>
            </div>
            <div id="Threejs" class="col-4 lg:col-4 xl:col-3">
                <div class="card mb-0 flex justify-content-center align-items-center">
                    <ThreeJSComponent />
                </div>
            </div>
            <div class="col-12 lg:col-12 xl:col-6">
                <div class="mb-0 center" style="width: 100%; height: 100%">
                    <Terminal :class="{ 'custom-terminal': overlayActive, 'custom-terminal-white': !overlayActive }" />
                </div>
            </div>
            <div class="col-12 lg:col-12 xl:col-6">
                <Stack />
            </div>
            <div id="Anilist" class="col-12 lg:col-12 xl:col-12">
                <div class="card mb-0 center">
                    <h2 class="lights">Anilist</h2>
                    <a href="https://anilist.co/user/RecNove/" target="_blank" rel="noopener noreferrer">
                        <dashboard-timeline />
                    </a>
                </div>
            </div>
            <OverlayPanel ref="overlayPanel">
                <div class="flex flex-column gap-3 w-25rem">
                    <div>
                        <span class="font-medium text-900 block mb-2">Share this document</span>
                        <InputGroup>
                            <InputText value="https://www.fiap.com.br/" readonly class="w-25rem"></InputText>
                            <InputGroupAddon>
                                <i class="pi pi-copy"></i>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div>
                        <span class="font-medium text-900 block mb-2">Invite Member</span>
                        <InputGroup>
                            <Chips disabled></Chips>
                            <Button label="Invite" icon="pi pi-users"></Button>
                        </InputGroup>
                    </div>
                    <div>
                        <span class="font-medium text-900 block mb-2">Team Members</span>
                        <ul class="list-none p-0 m-0 flex flex-column gap-3">
                            <li v-for="member in members" :key="member.name" class="flex align-items-center gap-2">
                                <img :src="`https://primefaces.org/cdn/primevue/images/avatar/${member.image}`" />
                                <div>
                                    <span class="font-medium">{{ member.name }}</span>
                                    <div class="text-sm text-color-secondary">{{ member.email }}</div>
                                </div>
                                <div class="flex align-items-center gap-2 text-color-secondary ml-auto text-sm">
                                    <span>{{ member.role }}</span>
                                    <i class="pi pi-angle-down"></i>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </OverlayPanel>
            <Dialog v-model="cvVisible" @update:visible="closePopup()" :maximized="true" :visible="cvVisible" :modal="true" class="p-dialog-maximized">
                <template #header>
                    <div class="inline-flex align-items-center justify-content-center gap-2">
                        {{ translations.gblCV }}
                    </div>
                    <Button @click="downloadIframeContent('iframe')">Download PDF</Button>
                </template>
                <div class="popup-content" style="height: 100%">
                    <iframe id="iframe" class="iframe" :ref="iframe" src="https://www.amorim.pro/cv" scrolling="auto"></iframe>
                </div>
            </Dialog>
            <Dialog v-model="lastFMVisible" @update:visible="closePopup()" :maximized="true" :visible="lastFMVisible" :modal="true" class="p-dialog-maximized">
                <template #header>
                    <div class="inline-flex align-items-center justify-content-center gap-2">
                        <h2>Your Weekly Track Chart</h2>
                    </div>
                </template>
                <div class="popup-content" style="height: 100%; height: 100% !important; overflow-y: auto !important; overflow-x: hidden !important">
                    <Chart />
                </div>
            </Dialog>
            <Dialog v-model="emailVisible" @update:visible="closePopup()" :maximized="true" :visible="emailVisible" :modal="true">
                <template #header>
                    <div class="inline-flex align-items-center justify-content-center gap-2">Contact Form</div>
                </template>
                <div class="popup-content" style="width: 100%">
                    <form @submit.prevent="sendEmail">
                        <div class="p-fluid">
                            <div class="p-field col">
                                <FloatLabel>
                                    <InputText id="name" v-model="name" required />
                                    <label for="name">Name</label>
                                </FloatLabel>
                            </div>
                            <div class="p-field col">
                                <FloatLabel>
                                    <InputText id="email" type="email" v-model="email" required />
                                    <label for="email">Email</label>
                                </FloatLabel>
                            </div>
                            <div class="p-field col">
                                <FloatLabel>
                                    <Textarea id="message" v-model="message" rows="5" required />
                                    <label for="message">Message</label>
                                </FloatLabel>
                            </div>
                            <div class="p-field col">
                                <Button type="submit" label="Submit" />
                            </div>
                        </div>
                    </form>
                </div>
            </Dialog>
        </div>
    </transition>
</template>

<style src="./styles.scss"></style>

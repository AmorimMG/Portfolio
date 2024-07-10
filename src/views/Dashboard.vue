<script setup>
import { ref, onMounted, watch, provide } from 'vue';
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import InputText from 'primevue/inputtext';
import Background from '../components/Background.vue';
import DashboardTimeline from '../components/cards/HeatMap.vue';
import ThreeJSComponent from '../components/cards/ThreeJS.vue';
import Terminal from '../components/cards/Terminal.vue';
import Stack from '../components/cards/Stack.vue';
import Spotify from '../components/cards/Spotify.vue';
import Discord from '../components/cards/Discord.vue';
import CVModal from '../components/cards/modals/CVModal.vue';
import LastFMModal from '../components/cards/modals/LastFMModal.vue';
import EmailModal from '../components/cards/modals/EmailModal.vue';
import ClusterLinks from '../components/cards/ClusterLinks.vue';
import ClusterOpcoes from '../components/cards/ClusterOpcoes.vue';
import Introduction from '../components/cards/Introduction.vue';
/* import Actitivies from '../components/cards/Activities.vue'; */
/* import MapboxMap from '../components/Mapbox.vue'; */

import { formatMessage } from '../service/localization';
import { setLanguageCookie, getLanguageCookie, setDarkThemeCookie } from '../service/session';
/* import discordData from '../service/getDiscord'; */

import Mail from '/src/assets/images/Mail.png';

const overlayPanel = ref();
const language = ref();
const dropdownValue = ref();

const overlayActive = ref(null);
const lastFMVisible = ref(false);
const emailVisible = ref(false);
const cvVisible = ref(false);
const isStarted = ref(false);
const isHoveredMail = ref(false);
const isGlitchActive = ref(false);
const isGlitchPageActive = ref(false);

const translations = ref({
    gblHi: '',
    gblAboutMe: '',
    gblInterests: '',
    gblSpotify: '',
    gblBrazil: '',
    gblCV: ''
});

function updateTranslations(languages) {
    if (languages) {
        language.value = languages;
    } else if (languages?.value) {
        language.value = languages.value;
    } else {
        language.value = 'pt'; // lingua padrão
    }
    translations.value.gblHi = formatMessage('gblHi', language.value);
    translations.value.gblAboutMe = formatMessage('gblAboutMe', language.value);
    translations.value.gblInterests = formatMessage('gblInterests', language.value);
    translations.value.gblSpotify = formatMessage('gblSpotify', language.value);
    translations.value.gblBrazil = formatMessage('gblBrazil', language.value);
    translations.value.gblCV = formatMessage('gblCV', language.value);

    applyGlitchEffect();
    translations.value = { ...translations.value };
}

provide('translations', {
    translations,
    updateTranslations
});

const closePopup = () => {
    cvVisible.value = false;
    lastFMVisible.value = false;
    emailVisible.value = false;
};

const toggle = (event) => {
    overlayPanel.value.toggle(event);
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

const handleToggleOverlay = (overlayActives) => {
    applyGlitchPageEffect();

    overlayActive.value = !overlayActives;

    if (overlayActive.value === true) {
        setDarkThemeCookie(overlayActive.value);
    } else {
        setDarkThemeCookie(overlayActive.value);
    }
};

const handleDropdownValueChanged = (newValue) => {
    dropdownValue.value = newValue;
    updateTranslations(dropdownValue.value.value);
};

onMounted(() => {
    console.log(getLanguageCookie());
    updateTranslations(getLanguageCookie() ?? 'pt');

    setTimeout(() => {
        isStarted.value = true;
    }, 2000);
});

watch(dropdownValue, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        setLanguageCookie(newValue.value);
    }
});
</script>

<template>
    <div class="layout-main-container">
    <Background />
    <div v-if="!isStarted" class="center" style="intro-div">
        <img class="gif-container" src="/src/assets/images/glitchIntroduction.gif" />
        <div class="black-screen"></div>
    </div>
    <transition name="fade">
        <div :class="{ glitch: isGlitchPageActive }" v-show="isStarted" class="grid">
            <div class="col-12 lg:col-12 xl:col-6">
                <Introduction :translations="translations" :isGlitchActive="isGlitchActive" @toggle="toggle" />
            </div>
            <div id="ClusterOpcoes" class="col-6 lg:col-6 xl:col-3">
                <ClusterOpcoes :translations="translations.gblBrazil" @update-dropdown-value="handleDropdownValueChanged" @toggleOverlay="handleToggleOverlay" :overlayActive="overlayActive" :isGlitchActive="isGlitchActive"></ClusterOpcoes>
            </div>
            <div id="ClusterLinks" class="col-6 lg:col-6 xl:col-3">
                <ClusterLinks />
            </div>
            <div ref="spotifyRef" id="Spotify" class="col-8 lg:col-8 xl:col-3">
                <Spotify />
            </div>
            <div id="Discord" class="col-4 lg:col-4 xl:col-3">
                <Discord :isGlitchActive="isGlitchActive" />
            </div>
            <div id="Mail" class="col-4 lg:col-4 xl:col-3">
                <div class="card mb-0 center" style="padding: 0; background-color: #7225d6" @mouseenter="isHoveredMail = true" @mouseleave="isHoveredMail = false">
                    <Button @click="emailVisible = true" style="width: 100%; height: 100%; background-color: #7225d6; border: none; justify-content: center">
                        <img :src="Mail" width="50%" :class="{ lights: isHoveredMail }" />
                    </Button>
                </div>
            </div>
            <div id="Mapbox" class="col-4 lg:col-4 xl:col-3" style="position: relative">
                <div class="card mb-0 center" style="padding: 0">
                    <MapboxMap />
                    <h5 :class="{ glitch: isGlitchActive }" class="lights" style="position: absolute">Tracking Offline <span class="red-dot"></span></h5>
                </div>
            </div>
            <div id="CV" class="col-4 lg:col-4 xl:col-3">
                <div class="card mb-0 center" style="padding: 0">
                    <Button @click="cvVisible = true" style="width: 100%; height: 100%; justify-content: center">
                        <h2 :class="{ glitch: isGlitchActive }">CV</h2>
                    </Button>
                </div>
            </div>
            <div id="LastFM" class="col-4 lg:col-4 xl:col-3">
                <div class="card mb-0 center" style="padding: 0">
                    <Button @click="lastFMVisible = true" style="width: 100%; height: 100%; justify-content: center">
                        <h2 :class="{ glitch: isGlitchActive }">Last.FM Statics</h2>
                    </Button>
                </div>
            </div> 
            <!--  <Actitivies :discordData="discordData()" /> -->
            <div id="Threejs" class="col-4 lg:col-4 xl:col-3">
                <ThreeJSComponent />
            </div>
            <div id="Terminal" class="col-12 lg:col-12 xl:col-6">
                <Terminal :class="{ 'custom-terminal': overlayActive, 'custom-terminal-white': !overlayActive }" />
            </div>
            <div id="Stack" class="col-12 lg:col-12 xl:col-6">
                <Stack />
            </div>
            <div id="Anilist" class="col-12 lg:col-12 xl:col-12">
                <dashboard-timeline />
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
            <CVModal :visible="cvVisible" :header="translations.gblCV" @close="closePopup()" />
            <LastFMModal :visible="lastFMVisible" :header="translations.gblCV" @close="closePopup()" />
            <EmailModal :visible="emailVisible" :header="translations.gblCV" @close="closePopup()" />
        </div>
    </transition>
</div>
</template>

<style src="./styles.scss"></style>

<script setup>
//#region imports
import { ref, onMounted, watch, provide } from 'vue';
import draggable from 'vuedraggable';

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
import ProjectsModal from '../components/cards/modals/ProjectsModal.vue';
import ClusterLinks from '../components/cards/ClusterLinks.vue';
import ClusterOpcoes from '../components/cards/ClusterOpcoes.vue';
import Introduction from '../components/cards/Introduction.vue';
import MapboxMap from '../components/Mapbox.vue';
/* import Actitivies from '../components/cards/Activities.vue'; */

import { formatMessage } from '../service/localization';
import { setLanguageCookie, getLanguageCookie, setDarkThemeCookie } from '../service/session';
/* import discordData from '../service/getDiscord'; */

//#endregion

//#region variables
const overlayPanel = ref();
const language = ref();
const dropdownValue = ref();
const isStarted = ref(false);
const isGlitchActive = ref(false);

const translations = ref({
    gblHi: '',
    gblAboutMe: '',
    gblInterests: '',
    gblSpotify: '',
    gblBrazil: '',
    gblCV: ''
});

const items = ref([
    {
        label: 'Translate',
        icon: 'pi pi-language'
    },
    {
        label: 'Speech',
        icon: 'pi pi-volume-up',
        items: [
            {
                label: 'Start',
                icon: 'pi pi-caret-right'
            },
            {
                label: 'Stop',
                icon: 'pi pi-pause'
            }
        ]
    },
    {
        separator: true
    },
    {
        label: 'Print',
        icon: 'pi pi-print'
    }
]);

const componentMap = {
    Introduction,
    ClusterLinks,
    ClusterOpcoes,
    Spotify,
    Discord,
    ThreeJSComponent,
    MapboxMap,
    EmailModal,
    CVModal,
    LastFMModal,
    ProjectsModal,
    Terminal,
    Stack,
    DashboardTimeline
};

const cards = ref([
    { id: 1, name: 'Introduction' },
    { id: 2, name: 'ClusterLinks' },
    { id: 3, name: 'ClusterOpcoes' },
    { id: 4, name: 'Spotify' },
    { id: 5, name: 'Discord' },
    { id: 6, name: 'ThreeJSComponent' },
    { id: 7, name: 'MapboxMap' },
    { id: 8, name: 'EmailModal' },
    { id: 9, name: 'CVModal' },
    { id: 10, name: 'LastFMModal' },
    { id: 11, name: 'ProjectsModal' },
    { id: 12, name: 'Terminal' },
    { id: 13, name: 'Stack' },
    { id: 14, name: 'DashboardTimeline' }
]);

//#endregion

//#region methods
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

const applyGlitchEffect = () => {
    isGlitchActive.value = true;
    setTimeout(() => {
        isGlitchActive.value = false;
    }, 2000);
};

onMounted(() => {
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
//#endregion
</script>

<template>
    <div class="layout-main-container">
    <Background />
    <ContextMenu global :model="items" />
    <div v-if="!isStarted" class="center" style="intro-div">
        <img class="gif-container" src="/src/assets/images/glitchIntroduction.gif" />
        <div class="black-screen"></div>
    </div>
    <transition name="fade">
        <div v-show="isStarted" class="grid justify-content-center">
             <draggable class="grid col-12" v-model="cards" item-key="id" group="cards" animation="200">
                <template #item="{ element }">
                        <component :class="{ glitch: isGlitchActive }" :is="componentMap[element.name]" :translations="translations" :isGlitchActive="isGlitchActive" />
                </template>
            </draggable> 
            <!--  <Actitivies :discordData="discordData()" /> -->
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
        </div>
    </transition>
    <SpeedDial :model="items" :radius="120" type="quarter-circle" direction="up-right" :style="{ position: 'fixed', left: '10px', bottom: '10px' }" />
</div>
<ScrollTop />
</template>
<style src="./styles.scss"></style>

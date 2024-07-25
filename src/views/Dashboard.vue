<script setup>
//#region imports
import { ref, onMounted, watch, provide } from 'vue';
import draggable from 'vuedraggable';

import AppTopbar from '../layout/AppTopbarDashboard.vue';

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
import IA from '../components/cards/IA.vue';
import Weather from '../components/cards/Weather.vue';
import Blog from '../components/cards/Blog.vue';

/* import Actitivies from '../components/cards/Activities.vue'; */
/* import discordData from '../service/getDiscord'; */
//#endregion

//#region variables
const overlayPanel = ref();
const isStarted = ref(false);
const isGlitchActive = ref(false);

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
    ClusterLinks,
    Spotify,
    Discord,
    ThreeJSComponent,
    MapboxMap,
    EmailModal,
    CVModal,
    LastFMModal,
    IA,
    Weather,
    Blog,
    ProjectsModal,
    Terminal,
    Stack,
    DashboardTimeline
};

const cards = ref([
    { id: 1, name: 'ClusterLinks', colSpan: 1, rowSpan: 1 },
    { id: 3, name: 'Spotify', colSpan: 2, rowSpan: 2 },
    { id: 4, name: 'Discord', colSpan: 1, rowSpan: 1 },
    { id: 5, name: 'ThreeJSComponent', colSpan: 1, rowSpan: 1 },
    { id: 6, name: 'MapboxMap', colSpan: 1, rowSpan: 1 },
    { id: 7, name: 'EmailModal', colSpan: 1, rowSpan: 1 },
    { id: 8, name: 'CVModal', colSpan: 1, rowSpan: 1 },
    { id: 9, name: 'LastFMModal', colSpan: 1, rowSpan: 1 },
    { id: 10, name: 'Weather', colSpan: 1, rowSpan: 1 },
    { id: 11, name: 'Blog', colSpan: 1, rowSpan: 1 },
    { id: 12, name: 'ProjectsModal', colSpan: 1, rowSpan: 1 },
    { id: 13, name: 'IA', colSpan: 2, rowSpan: 2 },
    { id: 14, name: 'Terminal', colSpan: 1, rowSpan: 2 },
    { id: 15, name: 'Stack', colSpan: 1, rowSpan: 1 },
    { id: 16, name: 'DashboardTimeline', colSpan: 4, rowSpan: 1 }
]);

//#endregion

//#region methods

const applyGlitchEffect = () => {
    isGlitchActive.value = true;
    setTimeout(() => {
        isGlitchActive.value = false;
    }, 2000);
};

onMounted(() => {
    setTimeout(() => {
        isStarted.value = true;
    }, 2000);
});
//#endregion
</script>

<template>
    <div class="layout-main-container">
        <!--  <Background /> -->
        <ContextMenu global :model="items" />
        <div v-if="!isStarted" class="center">
            <img class="gif-container" src="/src/assets/images/glitchIntroduction.gif" />
            <div class="black-screen"></div>
        </div>
        <transition name="fade">
            <div v-show="isStarted" class="grid components-container justify-content-center">
                <!-- <app-topbar :applyGlitchEffect="applyGlitchEffect" /> -->
                <div id="Introduction" class="col-4 lg:col-3 xl:col-3 p-0">
                    <Introduction class="col-2" :isGlitchActive="isGlitchActive" />
                </div>
                <draggable class="draggable col-12 lg:col-9 xl:col-9 p-5 pr-3" v-model="cards" item-key="id" group="cards" animation="200">
                    <template #item="{ element }">
                        <component
                            style="width: 100%"
                            :class="{ glitch: isGlitchActive }"
                            :is="componentMap[element.name]"
                            :isGlitchActive="isGlitchActive"
                            :style="{
                                'grid-column': 'span ' + element.colSpan,
                                'grid-row': 'span ' + element.rowSpan
                            }"
                        />
                    </template>
                </draggable>
                <!--  <Actitivies :discordData="discordData()" /> -->
            </div>
        </transition>

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
    <ScrollTop />
</template>
<style src="./styles.scss"></style>

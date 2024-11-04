<script>
import SelectionArea from "@viselect/vue";
import { ref } from "vue";
import draggable from 'vuedraggable';
import { componentMap, apps as initialApps } from '../data/appsDock';

import ClusterLinks from '../components/Cards/ClusterLinks.vue';
import Discord from '../components/Cards/Discord.vue';
import GithubHeatMap from '../components/Cards/HeatMap.vue';
import IA from '../components/Cards/IA.vue';
import Spotify from '../components/Cards/Spotify.vue';
import Stack from '../components/Cards/Stack.vue';
import ThreeJSComponent from '../components/Cards/ThreeJS.vue';
import Weather from '../components/Cards/Weather.vue';
import MapboxMap from '../components/Mapbox.vue';
import CVModal from '../components/Modals/CVModal.vue';
import DashboardModal from '../components/Modals/DashboardModal.vue';
import EmailModal from '../components/Modals/EmailModal.vue';
import LastFMModal from '../components/Modals/LastFMModal.vue';
import ProjectsModal from '../components/Modals/ProjectsModal.vue';
import PointerlockModal from "../components/ThreeJSGame/PointerlockModal.vue";

export default {
    components: { SelectionArea, draggable, ClusterLinks, Discord, GithubHeatMap, IA, Spotify, Stack, ThreeJSComponent, Weather, MapboxMap, CVModal, DashboardModal, EmailModal, LastFMModal, PointerlockModal, ProjectsModal },

    data() {
        return {
            selected: new Set(),
            apps: ref(initialApps)
        };
    },

    computed: {
        getComponent() {
            return (name) => componentMap[name] || 'div';
        }
    },

    methods: {
        extractIds(els) {
            return els
              .map((v) => v.getAttribute("data-key"))
              .filter(Boolean)
              .map(Number);
        },

        onStart({ event, selection }) {
            if (!event?.ctrlKey && !event?.metaKey) {
              selection.clearSelection();
              this.selected.clear();
            }
        },

        onMove({ store: { changed: { added, removed } } }) {
            this.extractIds(added).forEach((id) => this.selected.add(id));
            this.extractIds(removed).forEach((id) => this.selected.delete(id));
        },

        range(to, offset = 0) {
            return new Array(to).fill(0).map((_, i) => offset + i);
        },
    },
};
</script>

<template>
    <SelectionArea
        class="container"
        :options="{ selectables: '.selectable' }"
        :on-move="onMove"
        :on-start="onStart"
    >
        <draggable class="draggableApps" v-model="apps" item-key="id" group="apps" animation="200">
            <template #item="{ element }">
                <div class="app-container" :class="{ selected: selected.has(element.id)}">
                    <component
                        class="app-card"
                        :is="getComponent(element.name)"
                        :style="{
                            'grid-column': 'span ' + element.colSpan,
                            'grid-row': 'span ' + element.rowSpan,
                        }"
                    />
                    <div class="app-icon-wrapper selectable" 
                        :key="element.id"
                        :data-key="element.id"
                        >
                        <img :src="element.icon" style="width: 50px" />
                        <div class="app-title">{{ element.title }}</div>
                    </div>
                </div>
            </template>
        </draggable>

<!-- <div
        v-for="id in range(400, 84)"
        :key="id"
        :data-key="id"
        class="selectable"
        :class="{ selected: selected.has(id) }"
    /> -->
</SelectionArea>
</template>

<style>
.draggableApps {
    margin-bottom: 20vh;
    display: inherit;
    grid-gap: 5px;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    grid-auto-flow: column;
}

.app-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    transition: background-color 0.3s ease;
}

.app-container:hover {
    outline: 1px solid #007ad9;
    outline-offset: -2px;
    background-color: rgba(0, 0, 0, 0.2);
}

.app-title {
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.app-card {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    opacity: 0;
}

.app-icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: -80px;
}

.container {
    padding: 0.5rem;
    display: grid;
    grid-gap: 0.5rem;
    grid-template-columns: repeat(20, 1fr);
    flex-wrap: wrap;
    width: 100vw;
    height: 100vh;
    border-radius: 0.5rem;
    user-select: none;
}

.container > div {
    border-radius: 0.25rem;
}

.selected {
    background-color: #4f90f2;
    width: 100%;
    height: 100%;
}

.selection-area {
    background: #4f90f22d;
    border: 1px solid #4f90f2;
}
</style>

<script>
import { useAppsStore } from '@/stores/useAppsStore';
import { useTrashStore } from '@/stores/useTrashStore';

import SelectionArea from '@viselect/vue';

import { ref } from 'vue';
import draggable from 'vuedraggable';
import { componentMap } from '../data/appsDock';

import { useI18n } from 'vue-i18n';
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
import CameraModal from '../components/Modals/CameraModal.vue';
import EmailModal from '../components/Modals/EmailModal.vue';
import LastFMModal from '../components/Modals/LastFMModal.vue';
import PortfolioModal from '../components/Modals/PortfolioModal.vue';
import ProjectsModal from '../components/Modals/ProjectsModal.vue';
import PointerlockModal from '../components/ThreeJSGame/PointerlockModal.vue';

export default {
    components: {
        SelectionArea,
        draggable,
        ClusterLinks,
        Discord,
        GithubHeatMap,
        IA,
        Spotify,
        Stack,
        ThreeJSComponent,
        Weather,
        MapboxMap,
        CVModal,
        PortfolioModal,
        EmailModal,
        LastFMModal,
        PointerlockModal,
        ProjectsModal,
        CameraModal
    },
    setup() {
        const { t } = useI18n();
        const appsStore = useAppsStore();
        const trashStore = useTrashStore();
        const contextMenuRef = ref(null);

        return { appsStore, trashStore, contextMenuRef };
    },
    data() {
        return {
            selected: new Set(),
            contextApp: null,
            trash: [],
            contextItems: [
                {
                    label: 'Renomear',
                    icon: 'pi pi-pencil',
                    command: () => this.renameApp(this.contextApp)
                },
                {
                    label: 'Remover',
                    icon: 'pi pi-trash',
                    command: () => {
                        if (this.contextApp) this.appsStore.removeApp(this.contextApp);
                    }
                }
            ]
        };
    },
    computed: {
        filledGrid: {
            get() {
                return this.appsStore.apps;
            },
            set(val) {
                this.appsStore.apps = val;
            }
        },
        getComponent() {
            return (name) => componentMap[name] || 'div';
        }
    },
    methods: {
        onAppRightClick(event, app) {
            event.preventDefault();
            this.contextApp = app;
            this.$refs.contextMenuRef.show(event);
        },
        renameApp(app) {
            if (!app) return;
            const newName = prompt('Novo nome:', app.title);
            if (newName) app.title = newName;
        },
        extractIds(els) {
            return els
                .filter((v) => v && v.getAttribute)
                .map((v) => v.getAttribute('data-key'))
                .filter(Boolean)
                .map(Number);
        },
        onStart({ event, selection }) {
            if (!event?.ctrlKey && !event?.metaKey) {
                selection.clearSelection();
                this.selected.clear();
            }
        },
        restoreApp(app) {
            if (!app) return;
            this.appsStore.restoreApp(app);
            this.trashStore.trash = this.trash.filter((a) => a && a.id !== app.id);
        },
        deleteApp(app) {
            if (!app) return;
            this.trash = this.trash.filter((a) => a && a.id !== app.id);
        },
        onMove({
            store: {
                changed: { added, removed }
            }
        }) {
            this.extractIds(added).forEach((id) => this.selected.add(id));
            this.extractIds(removed).forEach((id) => this.selected.delete(id));
        },

        range(to, offset = 0) {
            return new Array(to).fill(0).map((_, i) => offset + i);
        }
    }
};
</script>

<template>
    <SelectionArea class="container" :options="{ selectables: '.selectable' }" :on-move="onMove" :on-start="onStart">
        <draggable v-model="filledGrid" item-key="id" :move="() => true"
            :component-data="{ tag: 'div', class: 'draggableApps' }"
            :clone="(original) => ({ ...original, id: Date.now() })">
            <template #item="{ element, index }">
                <div v-if="element && element.id !== null" class="app-container"
                    :class="{ selected: selected.has(element.id) }" @contextmenu="onAppRightClick($event, element)">
                    <component class="app-card" :is="getComponent(element.name)" :style="{
                        'grid-column': 'span ' + element.colSpan,
                        'grid-row': 'span ' + element.rowSpan
                    }" />
                    <div class="app-icon-wrapper selectable" :key="element.id" :data-key="element.id">
                        <img loading="lazy" :src="element.icon" width="50px" height="50px" />
                        <div class="app-title">{{ element.title }}</div>
                    </div>
                </div>
                <div v-else class="empty-slot"></div>
            </template>
        </draggable>

        <ContextMenu ref="contextMenuRef" :model="contextItems" />
    </SelectionArea>
</template>

<style>
.empty-slot {
    width: 100px;
    height: 100px;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
}

/* Animação de entrada (pop-in) */
.app-enter-active {
    transition: all 0.3s ease;
}

.app-enter-from {
    opacity: 0;
    transform: scale(0.8);
}

.app-enter-to {
    opacity: 1;
    transform: scale(1);
}

/* Animação de saída (pop-out) */
.app-leave-active {
    transition: all 0.3s ease;
    position: absolute;
    /* evita quebra de layout durante saída */
}

.app-leave-from {
    opacity: 1;
    transform: scale(1);
}

.app-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

.draggableApps {
    margin-bottom: 22vh;
    display: grid;
    grid-gap: 5px;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-auto-flow: column;
    /*  grid-auto-flow: row; */
}

.app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    transition: background-color 0.3s ease;
    width: 100px;
    height: 100px;
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
    flex-wrap: wrap;
    width: 100vw;
    height: 100vh;
    border-radius: 0.5rem;
    user-select: none;
    max-width: none;
}

.container>div {
    border-radius: 0.25rem;
}

.selected {
    background-color: #4f90f2;
    height: 100px;
    width: 100px;
}

.selection-area {
    background: #4f90f22d;
    border: 1px solid #4f90f2;
}

@media (max-width: 991px) {
    .draggableApps {
        grid-template-columns: repeat(4, 1fr);
        grid-auto-flow: row;
    }

    .container {
        padding: 0;
    }

    .app-icon-wrapper>img {
        width: 60px !important;
    }
}
</style>

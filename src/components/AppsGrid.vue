<script>
import { useAppsStore } from '@/stores/useAppsStore';
import { useTrashStore } from '@/stores/useTrashStore';

import SelectionArea from '@viselect/vue';

import { onMounted, onUnmounted, ref } from 'vue';
import draggable from 'vuedraggable';
import { componentMap } from '../data/appsDock';

import { useI18n } from 'vue-i18n';
import ClusterLinks from '../components/AmorimWebsite/Cards/ClusterLinks.vue';
import Discord from '../components/AmorimWebsite/Cards/Discord.vue';
import GithubHeatMap from '../components/AmorimWebsite/Cards/HeatMap.vue';
import IA from '../components/AmorimWebsite/Cards/IA.vue';
import Spotify from '../components/AmorimWebsite/Cards/Spotify.vue';
import Stack from '../components/AmorimWebsite/Cards/Stack.vue';
import ThreeJSComponent from '../components/AmorimWebsite/Cards/ThreeJS.vue';
import Weather from '../components/AmorimWebsite/Cards/Weather.vue';
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

        onMounted(() => {
            appsStore.loadIcons();
            appsStore.updateSlots();
            window.addEventListener('resize', () => appsStore.updateSlots());
        });

        onUnmounted(() => {
            window.removeEventListener('resize', () => appsStore.updateSlots());
        });

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
        onSelection({
            store: {
                changed: { added, removed }
            }
        }) {
            this.extractIds(added).forEach((id) => this.selected.add(id));
            this.extractIds(removed).forEach((id) => this.selected.delete(id));
        },
        onMoveItem({ relatedContext, draggedContext }) {
            if (!draggedContext || !draggedContext.element) return true;

            const draggedElement = draggedContext.element;

            if (this.selected.size > 0 && this.selected.has(draggedElement.id)) {
                // Get the current indices of all selected items
                const selectedIndices = [...this.selected].map((id) => this.filledGrid.findIndex((app) => app.id === id)).sort((a, b) => a - b);

                // Get all selected apps in their original order
                const selectedApps = selectedIndices.map((index) => this.filledGrid[index]);

                // Create a copy of the grid without the selected items
                const newGrid = [...this.filledGrid];

                // Remove items from highest index to lowest to maintain correct indices
                for (let i = selectedIndices.length - 1; i >= 0; i--) {
                    newGrid.splice(selectedIndices[i], 1);
                }

                // Calculate the correct insertion index
                let insertIndex = relatedContext.index;
                if (insertIndex > draggedContext.index) {
                    insertIndex -= selectedIndices.filter((index) => index < insertIndex).length;
                }

                // Insert all selected items at once
                newGrid.splice(insertIndex, 0, ...selectedApps);

                // Update the grid
                this.filledGrid = newGrid;

                return false;
            }

            return true; // Allow default drag behavior for single items
        },
        range(to, offset = 0) {
            return new Array(to).fill(0).map((_, i) => offset + i);
        },
        handleResize() {
            this.appsStore.updateSlots();
        }
    }
};
</script>

<template>
    <SelectionArea class="container" :options="{ selectables: '.selectable' }" :on-move="onSelection"
        :on-start="onStart">
        <draggable v-model="filledGrid" item-key="id" :move="onMoveItem"
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
                        <img loading="lazy" :src="element.icon" width="50px" height="50px" style="height: 50px" />
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
    /*     width: 100px;
    height: 100px;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem; */
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
    grid-gap: 10px;
    grid-template-rows: repeat(auto-fill, 100px);
    grid-auto-columns: 100px;
    grid-auto-flow: column;
    width: fit-content;
    max-width: 80vw;
    /* Adicione esta linha para limitar a largura a 80% da viewport */
    height: 78vh;
    margin-left: 0.5rem;
    max-width: 80%;
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
        max-width: 100%;
        /* Mantenha largura total em mobile */
        grid-template-rows: repeat(auto-fill, minmax(100px, 1fr));
        grid-template-columns: repeat(4, 1fr);
        grid-auto-flow: row;
        grid-gap: 1px;
        width: 100%;
    }

    .container {
        padding: 0;
    }

    .app-icon-wrapper>img {
        width: 50px !important;
    }
}
</style>

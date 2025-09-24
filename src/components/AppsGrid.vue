<script>
import { useAppsStore } from '@/stores/useAppsStore';
import { useTrashStore } from '@/stores/useTrashStore';

import SelectionArea from '@viselect/vue';

import { onMounted, onUnmounted, ref } from 'vue';
import draggable from 'vuedraggable';
import { componentMap } from '../data/appsDock';

import { useI18n } from 'vue-i18n';
import LoginToast from './LoginToast.vue';
import ContextMenu from 'primevue/contextmenu';
import { getUserCookie } from '../service/session.js';

export default {
    components: {
        SelectionArea,
        draggable,
        LoginToast,
        ContextMenu,
        ...componentMap
    },
    setup() {
        const { t } = useI18n();
        const appsStore = useAppsStore();
        const trashStore = useTrashStore();
        const contextMenuRef = ref(null);
        const loginToastRef = ref(null);
        const userLoggedIn = ref(!!getUserCookie());

        const checkLoginStatus = () => {
            userLoggedIn.value = !!getUserCookie();
        };

        const canAccessApp = (app) => {
            if (!app.locked) return true;
            const userSession = getUserCookie();
            return !!userSession && userLoggedIn.value;
        };

        onMounted(() => {
            appsStore.loadIcons();
            appsStore.updateSlots();
            window.addEventListener('resize', () => appsStore.updateSlots());
            
            const loginCheckInterval = setInterval(checkLoginStatus, 1000);
            
            const interceptAppEvents = (event) => {
                if (event.type === 'appOpen' && event.detail?.app) {
                    const app = event.detail.app;
                    if (!canAccessApp(app)) {
                        event.preventDefault();
                        event.stopPropagation();
                        console.warn('Acesso negado via evento customizado:', app.name);
                        return false;
                    }
                }
            };
            
            document.addEventListener('appOpen', interceptAppEvents, true);
            
            onUnmounted(() => {
                window.removeEventListener('resize', () => appsStore.updateSlots());
                document.removeEventListener('appOpen', interceptAppEvents, true);
                clearInterval(loginCheckInterval);
            });
        });

        return { appsStore, trashStore, contextMenuRef, loginToastRef, userLoggedIn, canAccessApp };
    },        data() {
        return {
            selected: new Set(),
            contextApp: null,
            trash: [],
            pendingLockedApp: null,
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
    },        computed: {
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
        },
        isUserLoggedIn() {
            return this.userLoggedIn;
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
                .filter((v) => v && v.getAttribute && v.getAttribute('data-key'))
                .map((v) => v.getAttribute('data-key'))
                .filter(Boolean)
                .map(Number)
                .filter((id) => {
                    const app = this.filledGrid.find(app => app.id === id);
                    return app && !this.appsStore.isEmptySlot(app);
                });
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

            if (this.appsStore.isEmptySlot(draggedElement)) {
                return false;
            }

            if (this.selected.size > 0 && this.selected.has(draggedElement.id)) {
                const selectedIndices = [...this.selected].map((id) => this.filledGrid.findIndex((app) => app.id === id)).sort((a, b) => a - b);

                const selectedApps = selectedIndices.map((index) => this.filledGrid[index]);

                const newGrid = [...this.filledGrid];

                for (let i = selectedIndices.length - 1; i >= 0; i--) {
                    newGrid.splice(selectedIndices[i], 1);
                }

                let insertIndex = relatedContext.index;
                if (insertIndex > draggedContext.index) {
                    insertIndex -= selectedIndices.filter((index) => index < insertIndex).length;
                }

                newGrid.splice(insertIndex, 0, ...selectedApps);

                this.filledGrid = newGrid;

                return false;
            }

            return true;
        },
        onDragStart(evt) {
            const draggedElement = this.filledGrid[evt.oldIndex];
            if (this.appsStore.isEmptySlot(draggedElement)) {
                evt.preventDefault();
                return false;
            }
            return true;
        },
        onAppClick(app) {
            if (!this.canAccessApp(app)) {
                this.pendingLockedApp = app;
                this.$refs.loginToastRef.show();
                return;
            }
            
            this.openAppNormally(app);
        },
        
        onAppContainerClick(event, app) {
            event.preventDefault();
            event.stopPropagation();
          
            this.onAppClick(app);
        },
        
        openAppNormally(app) {
            if (!this.canAccessApp(app)) {
                console.warn('Tentativa de acesso negada:', app.name);
                return;
            }
            
            const currentUserSession = getUserCookie();
            if (app.locked && (!currentUserSession || !this.isUserLoggedIn)) {
                console.warn('Sessão inválida detectada:', app.name);
                this.userLoggedIn = false; // Reset do estado
                return;
            }
            
            this.$nextTick(() => {
                const appElement = document.querySelector(`[data-key="${app.id}"]`);
                if (appElement) {
                    const appCard = appElement.closest('.app-container').querySelector('.app-card');
                    if (appCard) {
                        const button = appCard.querySelector('button');
                        if (button) {
                            if (app.locked && !this.canAccessApp(app)) {
                                console.warn('Bloqueio final ativado:', app.name);
                                return;
                            }
                            button.click();
                            return;
                        }
                    }
                    
                    const event = new CustomEvent('appOpen', { detail: { app } });
                    appElement.dispatchEvent(event);
                }
            });
        },
        onLoginSuccess() {
            this.userLoggedIn = true;
            if (this.pendingLockedApp) {
                console.log('App unlocked:', this.pendingLockedApp.name);
                this.openAppNormally(this.pendingLockedApp);
                this.pendingLockedApp = null;
            }
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
            :clone="(original) => ({ ...original, id: Date.now() })"
            :disabled="false"
            :item-key-path="'id'"
            @start="onDragStart">
            <template #item="{ element, index }">
                <div v-if="element && element.id !== null" class="app-container"
                    :class="{ 
                        selected: selected.has(element.id),
                        'locked-app': element.locked && !isUserLoggedIn 
                    }" 
                    @contextmenu="onAppRightClick($event, element)"
                    @click="onAppContainerClick($event, element)">
                    
                    <component 
                        class="app-card" 
                        :is="getComponent(element.name)" 
                        :style="{
                            'grid-column': 'span ' + element.colSpan,
                            'grid-row': 'span ' + element.rowSpan,
                            'pointer-events': (element.locked && !isUserLoggedIn) ? 'none' : 'auto'
                        }"
                        @click.stop.prevent="element.locked && !isUserLoggedIn ? null : null" />
                    
                    <div v-if="element.locked && !isUserLoggedIn" 
                         class="security-overlay"
                         @click.stop.prevent="onAppClick(element)">
                    </div>
                    
                    <div class="app-icon-wrapper selectable" :key="element.id" :data-key="element.id"
                        :title="element.locked ? (isUserLoggedIn ? 'App desbloqueado - Clique para abrir' : 'App bloqueado - Clique para fazer login') : ''">
                        <div class="app-icon-container">
                            <img loading="lazy" :src="element.icon" width="50px" height="50px" style="height: 50px" />
                            <div v-if="element.locked" class="lock-overlay" :class="{ 'unlocked': isUserLoggedIn }">
                                <i class="lock-icon pi" :class="isUserLoggedIn ? 'pi-unlock' : 'pi-lock'"></i>
                            </div>
                        </div>
                        <div class="app-title">{{ element.title }}</div>
                    </div>
                </div>
                <div v-else class="empty-slot" :data-index="index"></div>
            </template>
        </draggable>

        <ContextMenu ref="contextMenuRef" :model="contextItems" />
        <LoginToast ref="loginToastRef" @login-success="onLoginSuccess" />
    </SelectionArea>
</template>

<style>
.empty-slot {
    width: 100px;
    height: 100px;
    user-select: none;
    cursor: default;

    /* Opcional: mostrar visualmente que é um slot vazio */
    /* 
    border: 1px dashed rgba(255, 255, 255, 0.1);
    background-color: rgba(255, 255, 255, 0.02);
    border-radius: 0.5rem; 
    */
}

.empty-slot:hover {
    outline: none !important;
    background-color: transparent !important;
}

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

.app-leave-active {
    transition: all 0.3s ease;
    position: absolute;
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
    cursor: pointer;
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

.app-icon-container {
    position: relative;
    display: inline-block;
}

.lock-overlay {
    position: absolute;
    top: -5px;
    right: -5px;
    background: linear-gradient(135deg, #ff6b6b, #ff8787);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #ffffff;
    animation: pulse 2s infinite;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.lock-overlay.unlocked {
    background: linear-gradient(135deg, #51cf66, #69db7c);
    animation: none;
}

.lock-icon {
    color: #ffffff;
    font-size: 10px;
    font-weight: bold;
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

.app-container .app-icon-container img {
    transition: all 0.3s ease;
}

.app-container:has(.lock-overlay:not(.unlocked)) {
    opacity: 0.7;
    filter: grayscale(0.3);
}

.app-container:has(.lock-overlay:not(.unlocked)):hover {
    opacity: 0.9;
    filter: grayscale(0.1);
    transform: scale(1.05);
}

.app-container:has(.lock-overlay:not(.unlocked)) .app-title {
    opacity: 0.8;
}

.app-container:has(.lock-overlay.unlocked) {
    opacity: 1;
    filter: none;
}

.app-container:has(.lock-overlay.unlocked):hover {
    transform: scale(1.02);
}

.security-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    cursor: pointer;
    background: transparent;
}

.locked-app {
    position: relative;
}

.locked-app .app-card {
    pointer-events: none !important;
    user-select: none !important;
}

.locked-app .app-card * {
    pointer-events: none !important;
    user-select: none !important;
}

.locked-app .app-card::before,
.locked-app .app-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    pointer-events: none;
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

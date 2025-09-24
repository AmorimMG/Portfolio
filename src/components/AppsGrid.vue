<script>
import { useAppsStore } from '@/stores/useAppsStore';
import { useTrashStore } from '@/stores/useTrashStore';

import SelectableDraggableGrid from './SelectableDraggableGrid.vue';

import { onMounted, onUnmounted, ref } from 'vue';
import { componentMap } from '../data/appsDock';

import { useI18n } from 'vue-i18n';
import LoginToast from './LoginToast.vue';
import ContextMenu from 'primevue/contextmenu';
import { getUserCookie } from '../service/session.js';

export default {
    components: {
        SelectableDraggableGrid,
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
    },
    data() {
        return {
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
    watch: {
        'appsStore.apps': {
            handler(newApps) {
                // Atualiza a grid quando a store muda
                this.$nextTick(() => {
                    this.refreshGrid();
                });
            },
            deep: true,
            immediate: false
        }
    },
    methods: {
        onContextMenu(event, app) {
            event.preventDefault();
            this.contextApp = app;
            this.$refs.contextMenuRef.show(event);
        },
        renameApp(app) {
            if (!app) return;
            const newName = prompt('Novo nome:', app.title);
            if (newName) app.title = newName;
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
        onSelectionChange({ selectedIds, selectedItems }) {
            // Pode ser usado para feedback visual ou outras funcionalidades
            console.log('Seleção alterada:', selectedIds, selectedItems);
        },
        onItemsUpdated(newItems) {
            console.log('📝 AppsGrid: Updating store with new items');
            this.appsStore.apps = newItems;
            // Força atualização dos slots se necessário
            // TEMPORARIAMENTE COMENTADO PARA TESTE
            // this.$nextTick(() => {
            //     this.appsStore.updateSlots();
            // });
        },
        onItemClick({ event, item: app, index }) {
            // Se não estiver usando modificadores para seleção múltipla, abre o app
            if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
                setTimeout(() => {
                    if (!this.canAccessApp(app)) {
                        this.pendingLockedApp = app;
                        this.$refs.loginToastRef.show();
                        return;
                    }
                    
                    this.openAppNormally(app);
                }, 200); // Pequeno delay para permitir duplo clique
            }
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
        refreshGrid() {
            // Método para forçar atualização da grid
            if (this.$refs.selectableDraggableGrid) {
                this.$refs.selectableDraggableGrid.refreshList();
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
    <div class="container">
        <SelectableDraggableGrid
            ref="selectableDraggableGrid"
            v-model="filledGrid"
            item-key="id"
            selectable-class="selectable"
            :multi-select="true"
            :drag-enabled="true"
            @selection-change="onSelectionChange"
            @item-click="onItemClick"
            @contextmenu="onContextMenu"
            @update:model-value="onItemsUpdated"
        >
            <template #item="{ element, selected }">
                <div v-if="element && element.id !== null" class="app-container"
                    :class="{ 
                        selected: selected,
                        'locked-app': element.locked && !isUserLoggedIn 
                    }">
                    
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
                         class="security-overlay">
                    </div>
                    
                    <div class="app-icon-wrapper" 
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
            </template>
        </SelectableDraggableGrid>

        <ContextMenu ref="contextMenuRef" :model="contextItems" />
        <LoginToast ref="loginToastRef" @login-success="onLoginSuccess" />
    </div>
</template>

<style>
/* Estilos removidos - agora controlados pelo SelectableDraggableGrid */

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

/* Hover agora é controlado pelo SelectableDraggableGrid */

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
    width: 100vw;
    height: 100vh;
    border-radius: 0.5rem;
    user-select: none;
    max-width: none;
}

/* Seleção agora é controlada pelo SelectableDraggableGrid */

@media (max-width: 991px) {
    .container {
        padding: 0;
    }

    .app-icon-wrapper>img {
        width: 50px !important;
    }
}
</style>

<script setup>
import FileIcon from '@/assets/images/dock/file.png';
import FolderIcon from '@/assets/images/dock/Folder.svg';
import { useConfigModalStore } from '@/stores/configModal';
import { useAppsStore } from '@/stores/useAppsStore';
import { useToast } from 'primevue/usetoast';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { widgets as initialWidgets } from '../../data/appsDock';
import DockTopbar from './DockTopBar.vue';

import { getLanguageCookie, setLanguageCookie } from '../../service/session';

const emit = defineEmits(['update:modelValue']);
const { locale } = useI18n();
const selectRef = ref(null);
const appsStore = useAppsStore();

const isMobile = ref(window.innerWidth <= 768);
const widgets = ref(initialWidgets);
const configModalStore = useConfigModalStore();
const background = ref(configModalStore.getBackground());

const toast = useToast();

const items = ref([
    {
        label: 'New Folder',
        icon: 'pi pi-folder',
        command: () => {
            const newApp = {
                name: 'NewAppComponent',
                icon: FolderIcon,
                colSpan: 1,
                rowSpan: 1,
                title: null
            };

            appsStore.addApp(newApp);
        }
    },
    {
        label: 'New File',
        icon: 'pi pi-file',
        command: () => {
            const newApp = {
                name: 'NewAppComponent',
                icon: FileIcon,
                colSpan: 1,
                rowSpan: 1,
                title: null
            };

            appsStore.addApp(newApp);
        }
    },
    {
        label: 'Translate',
        icon: 'pi pi-language',
        items: [
            {
                label: 'Português',
                icon: 'pi pi-language',
                command: () => {
                    setLanguageCookie('pt');
                    locale.value = 'pt';
                }
            },
            {
                label: 'Espanõl',
                icon: 'pi pi-language',
                command: () => {
                    setLanguageCookie('es');
                    locale.value = 'es';
                }
            },
            {
                label: 'English',
                icon: 'pi pi-language',
                command: () => {
                    setLanguageCookie('en');
                    locale.value = 'en';
                }
            }
        ]
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

watchEffect(() => {
    background.value = configModalStore.getBackground();

    const cookieValue = getLanguageCookie();
    locale.value = cookieValue || 'en';
});

const updateScreenSize = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
    window.addEventListener('resize', updateScreenSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize);
});
</script>

<template>
    <div class="dock-demo">
        <ContextMenu global :model="items" />
        <Toast position="top-center" group="tc" />
        <DockTopbar v-model="background" />
        <div class="dock-window dock-advanced overflow-hidden">
            <transition name="fade" mode="out-in">
                <div class="w-full h-full absolute inset-0 z-0 bg-cover bg-center" :key="background" :style="{ 'background-image': `url(${background})` }"></div>
            </transition>

            <div class="relative z-10 wrapper flex justify-content-between">
                <div class="apps">
                    <AppsGrid ref="selectRef" />
                </div>
                <div class="widgets mr-8">
                    <draggable class="draggableWidgets" v-model="widgets" item-key="id" group="widgets" animation="200">
                        <template #item="{ element }">
                            <component
                                class="app-widgets"
                                :is="componentMap[element.name]"
                                :style="{
                                    'grid-column': 'span ' + element.colSpan,
                                    'grid-row': 'span ' + element.rowSpan
                                }"
                            />
                        </template>
                    </draggable>
                </div>
            </div>
            <!--   <DockBottombar /> -->
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
    /* fade-enter é a classe aplicada antes da entrada e fade-leave-to após a saída */
    opacity: 0;
}

.dock-demo {
    padding: 0;
    height: 100vh;
    user-select: none;
}

.dock-demo > .dock-window {
    width: 100%;
    height: 100vh;
    position: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
}

.dock-demo .p-menubar {
    padding: 0;
    border-radius: 0;
}

.apps {
    width: 100vw;
    height: 100vh;
}

.widgets {
    position: absolute;
    right: 0;
}

.draggableWidgets {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    grid-template-rows: repeat(1, 1fr);
    grid-auto-flow: column;
}

.app-widgets {
    width: 250px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.app-widgets * {
    font-size: 1rem !important;
    padding: 0;
    border: none;
    border-radius: 12px;
    text-align: center;
}

.app-widgets > .h-full .card {
    width: 250px;
}

@media (max-width: 991px) {
    .draggableWidgets {
        grid-template-columns: repeat(4, 1fr);
        grid-auto-flow: row;
        display: none;
    }

    .widgets {
        margin-right: 0;
        right: auto;
        position: fixed;
    }

    .wrapper {
        margin-top: 50px;
    }
}
</style>

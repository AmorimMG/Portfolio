<script setup>
import FileIcon from '@/assets/images/dock/file.png';
import FolderIcon from '@/assets/images/dock/folder.svg';
import { setLanguageCookie } from '@/service/session';
import { useAppsStore } from '@/stores/useAppsStore';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DockBottomBar from './DockBottomBar.vue';
import DockContent from './DockContent.vue';
import DockTopbar from './DockTopBar.vue';

const appsStore = useAppsStore();

const { locale } = useI18n();

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
</script>

<template>
    <div class="dock-demo">
        <ContextMenu global :model="items" />
        <DockTopbar />
        <DockContent />
        <DockBottomBar />
    </div>
</template>

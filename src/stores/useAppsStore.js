import { apps as initialApps } from '@/data/appsDock';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTrashStore } from './useTrashStore';

export const useAppsStore = defineStore('apps', () => {
    const { t } = useI18n();
    const trashStore = useTrashStore();

    const GRID_SIZE = 40;

    const apps = ref(Array(GRID_SIZE).fill({ id: null }));

    initialApps.slice(0, GRID_SIZE).forEach((app, index) => {
        apps.value[index] = {
            ...app,
            id: Date.now() + Math.random(),
            title: t(`apps.${app.title}`)
        };
    });

    function addApp(newApp) {
        const emptyIndex = apps.value.findIndex((slot) => slot.id === null); // Verifique se o slot está vazio
        if (emptyIndex === -1) return;

        if (!newApp.title) {
            const newName = t('newName');
            const appName = prompt(newName);
            newApp.title = appName;
        }

        apps.value[emptyIndex] = {
            ...newApp,
            id: Date.now(),
            title: newApp.title
        };
    }

    function removeApp(app) {
        const index = apps.value.findIndex((a) => a?.id === app.id);
        if (index !== -1) {
            apps.value[index] = null;
            trashStore.addToTrash(app);
        }
    }

    function restoreApp(app) {
        addApp(app);
        trashStore.removeFromTrash(app);
    }

    return {
        apps,
        addApp,
        removeApp,
        restoreApp
    };
});

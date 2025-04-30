import { apps as initialApps } from '@/data/appsDock';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTrashStore } from './useTrashStore';

export const useAppsStore = defineStore('apps', () => {
    const { t } = useI18n();
    const trashStore = useTrashStore();
    const apps = ref(
        initialApps.map((app) => ({
            ...app,
            id: Date.now() + Math.random(),
            title: t(`apps.${app.title}`)
        }))
    );

    function addApp(newApp) {
        if (!newApp.title) {
            const newName = t('newName');
            const appName = prompt(newName);
            newApp.title = appName;
        }
        if (newApp)
            apps.value.push({
                ...newApp,
                id: Date.now(),
                title: newApp.title
            });
    }

    function removeApp(app) {
        apps.value = apps.value.filter((a) => a.id !== app.id);
        trashStore.addToTrash(app);
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

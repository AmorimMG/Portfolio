import { apps as initialApps } from '@/data/appsDock';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RESTAPI } from '../service/api.js';
import { useTrashStore } from './useTrashStore';

const getGameIcon = async (gameName) => {
    try {
        const response = await RESTAPI.RecebeIconeJogo(gameName);
        return response.data.imageUrl;
    } catch (e) {
        console.log(e);
    }
};
export const useAppsStore = defineStore('apps', () => {
    const { t } = useI18n();
    const trashStore = useTrashStore();

    const EMPTY_SLOT = { id: null };
    const apps = ref([]);

    function calculateTotalSlots() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const slotSize = 110;
        const columns = Math.floor(viewportWidth / slotSize);
        const rows = Math.floor((viewportHeight * 0.78) / slotSize);
        return columns * rows;
    }

    function updateSlots() {
        const totalSlots = calculateTotalSlots();
        const currentApps = apps.value.filter((app) => app.id !== null);
        apps.value = Array(totalSlots).fill(EMPTY_SLOT);

        currentApps.forEach((app, index) => {
            if (index < totalSlots) {
                apps.value[index] = app;
            }
        });

        if (currentApps.length === 0) {
            initialApps.forEach((app, index) => {
                if (index < totalSlots) {
                    apps.value[index] = {
                        ...app,
                        id: Date.now() + Math.random(),
                        title: t(`apps.${app.title}`)
                    };
                }
            });
        }
    }

    // Inicializa os slots
    updateSlots();

    function addApp(newApp) {
        const emptyIndex = apps.value.findIndex((slot) => slot.id === null);
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
        if (!app || app.id == null) return;

        const index = apps.value.findIndex((a) => a?.id === app.id);
        if (index !== -1) {
            apps.value[index] = EMPTY_SLOT;
            trashStore.addToTrash(app);
        }
    }

    function restoreApp(app) {
        addApp(app);
        trashStore.removeFromTrash(app);
    }

    async function loadIcons() {
        const doomIcon = await getGameIcon('Doom');
        this.apps = this.apps.map((app) => (app.name === 'DoomModal' ? { ...app, icon: doomIcon } : app));
    }

    return {
        apps,
        addApp,
        removeApp,
        restoreApp,
        updateSlots,
        loadIcons
    };
});

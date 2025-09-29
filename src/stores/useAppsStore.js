import { apps as initialApps } from '@/data/appsDock';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RESTAPI } from '../service/api.js';
import { useFileSystemStore } from './useFileSystemStore';
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
    let fileSystemStore = null; // Lazy loading para evitar problemas de dependência circular

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

        const appData = {
            ...newApp,
            id: Date.now(),
            title: newApp.title
        };

        apps.value[emptyIndex] = appData;

        // Se o app representa um arquivo do desktop, criar no sistema de arquivos
        if (newApp.createOnDesktop && !fileSystemStore) {
            fileSystemStore = useFileSystemStore();
        }
        
        if (newApp.createOnDesktop && fileSystemStore) {
            fileSystemStore.createFile(`${newApp.title}.app`, JSON.stringify({
                type: 'application',
                component: newApp.component,
                icon: newApp.icon,
                title: newApp.title
            }), '/home/amorim/Desktop');
        }

        return appData;
    }

    function removeApp(app) {
        if (!app || app.id == null) return;

        const index = apps.value.findIndex((a) => a?.id === app.id);
        if (index !== -1) {
            apps.value[index] = EMPTY_SLOT;
            trashStore.addToTrash(app);

            // Se o app tinha arquivo no desktop, remover também
            if (app.desktopFile && !fileSystemStore) {
                fileSystemStore = useFileSystemStore();
            }
            
            if (app.desktopFile && fileSystemStore) {
                fileSystemStore.removeItem(app.desktopFile, '/home/amorim/Desktop');
            }
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

    function isEmptySlot(app) {
        return !app || app.id === null;
    }

    function syncWithFileSystem() {
        if (!fileSystemStore) {
            fileSystemStore = useFileSystemStore();
        }

        // Primeiro, sincronizar apps existentes para o sistema de arquivos
        syncAppsToFileSystem();

        // Escutar mudanças no desktop
        const unsubscribe = fileSystemStore.onFileSystemChange((event) => {
            if (event.path.startsWith('/home/amorim/Desktop') && event.path.endsWith('.app')) {
                const fileName = event.path.split('/').pop();
                const appName = fileName.replace('.app', '');

                if (event.operation === 'create') {
                    // Criar app baseado no arquivo (apenas se não foi criado por nós)
                    const existingApp = apps.value.find(a => a.desktopFile === fileName);
                    if (!existingApp) {
                        const fileContent = fileSystemStore.readFile(event.path);
                        if (fileContent.success) {
                            try {
                                const appData = JSON.parse(fileContent.content);
                                addApp({
                                    ...appData,
                                    desktopFile: fileName
                                });
                            } catch (error) {
                                console.error('Error parsing app file:', error);
                            }
                        }
                    }
                } else if (event.operation === 'delete') {
                    // Remover app correspondente
                    const app = apps.value.find(a => a.desktopFile === fileName);
                    if (app) {
                        removeApp(app);
                    }
                }
            }
        });

        return unsubscribe;
    }

    function syncAppsToFileSystem() {
        if (!fileSystemStore) {
            fileSystemStore = useFileSystemStore();
        }

        // Garantir que o diretório Desktop existe
        fileSystemStore.createDirectory('Desktop', '/home/amorim');

        // Sincronizar cada app existente para o sistema de arquivos
        apps.value.forEach(app => {
            if (app.id !== null && !app.desktopFile) {
                const fileName = `${app.title.replace(/[^a-zA-Z0-9]/g, '_')}.app`;
                const appData = {
                    type: 'application',
                    title: app.title,
                    name: app.name,
                    icon: app.icon,
                    component: app.name,
                    locked: app.locked || false,
                    colSpan: app.colSpan || 1,
                    rowSpan: app.rowSpan || 1
                };

                const result = fileSystemStore.createFile(
                    fileName, 
                    JSON.stringify(appData, null, 2), 
                    '/home/amorim/Desktop'
                );

                if (result.success) {
                    app.desktopFile = fileName;
                }
            }
        });
    }

    return {
        apps,
        addApp,
        removeApp,
        restoreApp,
        updateSlots,
        loadIcons,
        isEmptySlot,
        syncWithFileSystem,
        syncAppsToFileSystem
    };
});

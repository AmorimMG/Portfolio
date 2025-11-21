<script setup>
import FileIcon from '@/assets/images/dock/file.png';
import FolderIcon from '@/assets/images/dock/Folder.svg';
import { setLanguageCookie } from '@/service/session';
import { useAppsStore } from '@/stores/useAppsStore';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import DockBottomBar from './DockBottomBar.vue';
import DockContent from './DockContent.vue';
import DockTopbar from './DockTopBar.vue';

const appsStore = useAppsStore();

const { locale } = useI18n();

// Referência para o ContextMenu
const contextMenu = ref(null);

// Variáveis para controlar o long press
let touchTimer = null;
let touchStartX = 0;
let touchStartY = 0;
const LONG_PRESS_DURATION = 500; // 500ms para considerar long press
const MOVE_THRESHOLD = 10; // pixels de movimento permitidos

// Detecta se é mobile
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
};

// Função para abrir o menu de contexto
const openContextMenu = (event) => {
    if (contextMenu.value) {
        contextMenu.value.show(event);
    }
};

// Handlers para long press
const handleTouchStart = (event) => {
    if (!isMobile()) return;
    
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    
    // Inicia o timer para long press
    touchTimer = setTimeout(() => {
        // Cria um evento sintético para o ContextMenu
        const syntheticEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            preventDefault: () => {},
            stopPropagation: () => {}
        };
        
        // Vibração háptica (se disponível)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        openContextMenu(syntheticEvent);
    }, LONG_PRESS_DURATION);
};

const handleTouchMove = (event) => {
    if (!touchTimer) return;
    
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX);
    const deltaY = Math.abs(touch.clientY - touchStartY);
    
    // Se o usuário moveu o dedo muito, cancela o long press
    if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
        clearTimeout(touchTimer);
        touchTimer = null;
    }
};

const handleTouchEnd = () => {
    if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
    }
};

onMounted(() => {
    // Adiciona os event listeners no elemento raiz
    const dockElement = document.querySelector('.dock-demo');
    if (dockElement && isMobile()) {
        dockElement.addEventListener('touchstart', handleTouchStart, { passive: true });
        dockElement.addEventListener('touchmove', handleTouchMove, { passive: true });
        dockElement.addEventListener('touchend', handleTouchEnd, { passive: true });
        dockElement.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    }
});

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
        <ContextMenu ref="contextMenu" global :model="items" />
        <DockTopbar />
        <DockContent />
        <DockBottomBar />
    </div>
</template>

<style scoped>
/* Feedback visual para long press em mobile */
@media (max-width: 768px) {
    .dock-demo {
        -webkit-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
    }
    
    .dock-demo:active {
        opacity: 0.95;
    }
}
</style>

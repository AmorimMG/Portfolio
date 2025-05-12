<script setup>
import AmorimIcon from '@/assets/images/cards/profilePic.png';
import Dock from 'primevue/dock';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { PhotoService } from '../../service/ThirdPartyEndpoints';
import FileSystemModal from '../Modals/FileSystemModal.vue';
import PortfolioModal from '../Modals/PortfolioModal.vue';
import TerminalModal from '../Modals/TerminalModal.vue';
import TrashModal from '../Modals/TrashModal.vue';
import VscodeModal from '../Modals/VscodeModal.vue';

const isMobile = ref(window.innerWidth <= 768);
const FileSystemOpen = ref(false);
const TrashOpen = ref(false);
const displayFinder = ref(false);
const displayTerminal = ref(false);
const displayPhotos = ref(false);
const vscodeModalOpen = ref(false);
const portfolioModalOpen = ref(false);
const images = ref();
const toast = useToast();
const items = ref([
    /* 	{
            label: "Finder",
            icon: "https://primefaces.org/cdn/primevue//images/dock/finder.svg",
            command: () => {
                displayFinder.value = true;
            },
        }, */
    {
        label: 'Terminal',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/terminal.svg',
        command: () => {
            displayTerminal.value = true;
        }
    },
    {
        label: 'Folder',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Files_App_icon_iOS.png',
        command: () => {
            FileSystemOpen.value = true;
        }
    },
    {
        label: 'App Store',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/appstore.svg',
        command: () => {
            toast.add({
                severity: 'error',
                summary: 'An unexpected error occurred while signing in.',
                detail: 'UNTRUSTED_CERT_TITLE',
                group: 'tc',
                life: 3000
            });
        }
    },
    {
        label: 'Safari',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/safari.svg',
        command: () => {
            toast.add({
                severity: 'warn',
                summary: 'Safari has stopped working',
                group: 'tc',
                life: 3000
            });
        }
    },
    {
        label: 'Vscode',
        icon2: 'https://carleton.ca/scs/wp-content/uploads/vscode-1.png',
        icon: 'https://timingapp.com/cdn-cgi/image/format=auto,width=256/img/app-icons/com.microsoft.VSCode/icon_128x128_2x.png',
        command: () => {
            vscodeModalOpen.value = true;
        }
    },
    {
        label: 'Photos',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/photos.svg',
        command: () => {
            displayPhotos.value = true;
        }
    },
    {
        label: 'GitHub',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/github.svg',
        command: () => {
            window.open('https://github.com/AmorimMG', '_blank');
        }
    },
    {
        label: 'Trash',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/trash.png',
        command: () => {
            TrashOpen.value = true;
        }
    },
    {
        label: 'Amorim',
        icon: AmorimIcon,
        command: () => {
            portfolioModalOpen.value = true;
        }
    }
]);
const responsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 3
    },
    {
        breakpoint: '768px',
        numVisible: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);

const filteredItems = computed(() => {
    return isMobile.value ? items.value.slice(0, 4) : items.value;
});

const updateScreenSize = () => {
    isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
    window.addEventListener('resize', updateScreenSize);
    try {
        const data = await PhotoService.getImages();
        images.value = data;
    } catch (error) {
        console.error('Failed to fetch images:', error);
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', updateScreenSize);
});

const onDockItemClick = (event, item) => {
    if (item.command) {
        item.command();
    }

    event.preventDefault();
};

watch(FileSystemOpen, (newValue) => {
    if (!newValue) {
        emit('close');
    }
});

watch(TrashOpen, (newValue) => {
    if (!newValue) {
        emit('close');
    }
});

const emit = defineEmits(['close', 'update:visible']);

const closeModalTerminal = () => {
    displayTerminal.value = false;
};
</script>

<template>
    <Dock style="margin-bottom: 5rem" :model="filteredItems">
        <template #item="{ item }">
            <a v-tooltip.top="item.label" href="#" class="p-dock-item-link" @click="onDockItemClick($event, item)">
                <img loading="lazy" :alt="item.label" :src="item.icon" style="width: 50px" />
            </a>
        </template>
    </Dock>
    <TerminalModal @close="displayTerminal = false" v-model:visible="displayTerminal" />
    <FileSystemModal @close="FileSystemOpen = false" v-model:visible="FileSystemOpen" />
    <TrashModal @close="TrashOpen = false" v-model:visible="TrashOpen" />
    <VscodeModal @close="vscodeModalOpen = false" v-model:visible="vscodeModalOpen" />
    <PortfolioModal @close="portfolioModalOpen = false" v-model:visible="portfolioModalOpen" />
    <Galleria v-model:visible="displayPhotos" :value="images" :responsiveOptions="responsiveOptions" :numVisible="2"
        containerStyle="width: 400px" :circular="true" :fullScreen="true" :showThumbnails="false"
        :showItemNavigators="true">
        <template #item="slotProps">
            <img loading="lazy" :src="slotProps.item.url" :alt="slotProps.item.alt" style="width: 100%" />
        </template>
    </Galleria>
    <Dialog v-model:visible="displayFinder" header="Finder" :breakpoints="{ '960px': '50vw' }"
        :style="{ width: '40vw' }" :maximizable="true">
        <Tree :value="items" />
    </Dialog>
</template>
<style scoped>
.p-dock {
    z-index: 10;
}

.dialog-terminal {
    overflow-x: hidden;
}

.p-dock-item {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
}

.p-dock .p-dock-list {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-dock-item-link {
    transition: all 0.2s ease-out;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
}

.p-dock-item-link img {
    width: 50px;
    height: 50px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.p-dock-item-link:hover img {
    transform: scale(2);
    margin: 0 1rem;
}

/* Adjacent items animation */
.p-dock-item-link:hover+.p-dock-item .p-dock-item-link img {
    transform: scale(1.5);
}

/* Previous item animation */
.p-dock-item:has(+ .p-dock-item .p-dock-item-link:hover) .p-dock-item-link img {
    transform: scale(1.5);
}
</style>

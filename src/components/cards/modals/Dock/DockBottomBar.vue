<script setup>
import { ref, onMounted } from 'vue';
import { PhotoService } from '../../../../service/ThirdPartyEndpoints';
import { useToast } from 'primevue/usetoast';
import Terminal from '../../Terminal.vue';
import draggable from 'vuedraggable';

const displayFinder = ref(false);
const displayTerminal = ref(false);
const displayPhotos = ref(false);
const images = ref();
const toast = useToast();
const items = ref([
    {
        label: 'Finder',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/finder.svg',
        command: () => {
            displayFinder.value = true;
        }
    },
    {
        label: 'Terminal',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/terminal.svg',
        command: () => {
            displayTerminal.value = true;
        }
    },
    {
        label: 'App Store',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/appstore.svg',
        command: () => {
            toast.add({ severity: 'error', summary: 'An unexpected error occurred while signing in.', detail: 'UNTRUSTED_CERT_TITLE', group: 'tc', life: 3000 });
        }
    },
    {
        label: 'Safari',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/safari.svg',
        command: () => {
            toast.add({ severity: 'warn', summary: 'Safari has stopped working', group: 'tc', life: 3000 });
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
        icon: 'https://primefaces.org/cdn/primevue//images/dock/github.svg'
    },
    {
        label: 'Trash',
        icon: 'https://primefaces.org/cdn/primevue//images/dock/trash.png',
        command: () => {
            toast.add({ severity: 'info', summary: 'Empty Trash', life: 3000 });
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

onMounted(async () => {
    try {
        const data = await PhotoService.getImages();
        images.value = data;
    } catch (error) {
        console.error('Failed to fetch images:', error);
    }
});

const onDockItemClick = (event, item) => {
    if (item.command) {
        item.command();
    }

    event.preventDefault();
};
</script>

<template>
    <Dock style="margin-bottom: 6rem" :model="items">
        <template #item="{ item }">
            <a v-tooltip.top="item.label" href="#" class="p-dock-item-link" @click="onDockItemClick($event, item)">
                <img :alt="item.label" :src="item.icon" style="width: 50px" />
            </a>
        </template>
    </Dock>
    <Dialog class="dialog-terminal" v-model:visible="displayTerminal" header="Terminal" :breakpoints="{ '960px': '50vw' }" :style="{ width: '40vw' }" :maximizable="true">
        <Terminal class="w-full h-full" />
    </Dialog>
    <Dialog v-model:visible="displayFinder" header="Finder" :breakpoints="{ '960px': '50vw' }" :style="{ width: '40vw' }" :maximizable="true">
        <Tree :value="items" />
    </Dialog>
    <Galleria v-model:visible="displayPhotos" :value="images" :responsiveOptions="responsiveOptions" :numVisible="2" containerStyle="width: 400px" :circular="true" :fullScreen="true" :showThumbnails="false" :showItemNavigators="true">
        <template #item="slotProps">
            <img :src="slotProps.item.url" :alt="slotProps.item.alt" style="width: 100%" />
        </template>
    </Galleria>
</template>
<style scoped>
.draggable-dock {
    width: 100%;
    margin-bottom: 200px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
}

.draggable-dock > a:hover {
    transform: scale(1.2);
}
.p-terminal .p-component {
    border: none !important;
    width: 100% !important;
    height: 100% !important;
}

.dialog-terminal {
    overflow-x: hidden;
}
</style>

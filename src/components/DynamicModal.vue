<script>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import { defineComponent, nextTick, ref } from 'vue';
import { useLayout } from '../../src/layout/composables/layout';

const cvVisible = ref(false);
const loading = ref(true);
const scale = ref(1);
const showButtons = ref(true);
const iframeSrc = ref('');
const { onMenuToggle } = useLayout();

export const openModal = (url) => {
    onMenuToggle();
    cvVisible.value = true;
    iframeSrc.value = url;

    nextTick(() => {
        const iframe = document.getElementById('iframe');
        if (iframe) {
            iframe.style.visibility = 'hidden';
            setTimeout(() => {
                iframe.style.visibility = 'visible';
            }, 0);
        }
    });
};

export const closeModal = () => {
    cvVisible.value = false;
};

export default defineComponent({
    name: 'IframeModal',
    components: {
        ProgressSpinner,
        Button,
        Dialog
    },
    setup() {
        const zoomIn = () => {
            scale.value += 0.1;
            applyZoom();
        };

        const zoomOut = () => {
            if (scale.value > 0.1) {
                scale.value -= 0.1;
                applyZoom();
            }
        };

        const applyZoom = () => {
            const iframe = document.getElementById('iframe');
            if (iframe) {
                iframe.style.transform = `scale(${scale.value})`;
                iframe.style.transformOrigin = '0 0';
                iframe.style.width = `${100 / scale.value}%`;
                iframe.style.height = `${100 / scale.value}%`;
            }
        };

        const onIframeLoad = () => {
            loading.value = false;
        };

        const toggleButtons = () => {
            showButtons.value = !showButtons.value;
        };

        const closeModal = () => {
            cvVisible.value = false;
        };

        return {
            cvVisible,
            loading,
            scale,
            showButtons,
            iframeSrc,
            zoomIn,
            zoomOut,
            applyZoom,
            onIframeLoad,
            toggleButtons,
            closeModal,
            openModal,
            onMenuToggle
        };
    }
});
</script>

<template>
    <Dialog v-model:visible="cvVisible" :maximized="true" :modal="true" class="p-dialog-maximized">
        <div class="zoom-controls">
            <div class="flex gap-1" v-if="showButtons">
                <Button v-tooltip.top="'Sidebar Toggler'" icon="pi pi-bars" class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()" />
                <Button v-tooltip.top="'Zoom Out'" icon="pi pi-search-minus" severity="help" @click="zoomOut" />
                <Button v-tooltip.top="'Zoom In'" icon="pi pi-search-plus" severity="help" @click="zoomIn" />
                <Button v-tooltip.top="'Close'" icon="pi pi-times" severity="danger" @click="closeModal"></Button>
            </div>
            <Button v-if="!showButtons" v-tooltip.top="'Menu Toggler'" icon="pi pi-ellipsis-v" @click="toggleButtons()" />
            <Button v-if="showButtons" v-tooltip.top="'Menu Toggler'" icon="pi pi-ellipsis-h" @click="toggleButtons()" />
        </div>
        <div class="flex justify-content-center align-items-center">
            <ProgressSpinner class="h-full" v-if="loading" />
        </div>
        <div class="iframe-container" :class="{ hidden: !cvVisible }" style="width: 100%; height: 100%; overflow: hidden; position: absolute; top: 0; left: 0">
            <iframe id="iframe" class="iframe" ref="iframe" :src="iframeSrc" scrolling="auto" style="border: none" @load="onIframeLoad"></iframe>
        </div>
    </Dialog>
</template>

<style scoped>
.zoom-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    gap: 10px;
}

.iframe-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.iframe {
    width: 100%;
    height: 100%;
    border: none;
    transform-origin: 0 0;
}

.p-dialog-content {
    padding: 0;
}

.progress-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;
}

.hidden {
    display: none;
}

.layout-sidebar {
    z-index: 9999 !important;
}
</style>

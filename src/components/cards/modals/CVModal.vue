<script>
import { ref } from 'vue';

export default {
    props: {
        header: String
    },
    data() {
        return {
            scale: 1,
            cvVisible: ref(false)
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.cvVisible = false;
        },
        zoomIn() {
            this.scale += 0.1;
            this.applyZoom();
        },
        zoomOut() {
            if (this.scale > 0.1) {
                this.scale -= 0.1;
                this.applyZoom();
            }
        },
        applyZoom() {
            const iframe = this.$refs.iframe;
            if (iframe) {
                iframe.style.transform = `scale(${this.scale})`;
                iframe.style.transformOrigin = '0 0';
                iframe.style.width = `${100 / this.scale}%`;
                iframe.style.height = `${100 / this.scale}%`
            }
        }
    }
};
</script>

<template>    
<div class="col-4 lg:col-4 xl:col-3">
   <div class="card mb-0 center" style="padding: 0">
        <Button v-tooltip.top="'Curriculum'"
        @click="cvVisible = true" style="width: 100%; height: 100%; justify-content: center">
            <h2 :class="{ glitch: isGlitchActive }">CV</h2>
        </Button>
    </div>
    <Dialog :visible="cvVisible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
        <template #header>
            <div class="inline-flex align-items-center justify-content-center gap-2">
                {{ header }}
            </div>
        </template>
        <div class="popup-content" style="height: 100%; position: relative;">
            <div class="zoom-controls">
                <Button @click="zoomIn">Zoom In</Button>
                <Button @click="zoomOut">Zoom Out</Button>
            </div>
            <div class="iframe-container" style="width: 100%; height: 100%; overflow: hidden;">
                <iframe id="iframe" class="iframe" ref="iframe" src="https://www.amorim.pro/cv" scrolling="auto" style="border: none;"></iframe>
            </div>
        </div>
    </Dialog>
</div>
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
}

.iframe {
    width: 100%;
    height: 100%;
    border: none;
    transform-origin: 0 0;
}

</style>

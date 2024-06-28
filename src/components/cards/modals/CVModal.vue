<script>
export default {
    props: {
        visible: Boolean,
        header: String
    },
    data() {
        return {
            scale: 1
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
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
    <Dialog :visible="visible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
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

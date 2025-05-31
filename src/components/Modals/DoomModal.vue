<script>
import CardEffect from '../CardEffect.vue';
import DosPlayer from '../DosPlayer.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CustomDialog from './CustomDialog.vue';

export default {
    components: { CardEffect, VueNeonLight, CustomDialog, DosPlayer },
    data() {
        return {
            piVisible: false,
            iframeKey: 0
        };
    },
    computed: {
        isVisible() {
            return this.piVisible;
        }
    },
    methods: {
        onHide() {
            this.piVisible = false;
            this.$emit('close');
            this.iframeKey++;
        }
    }
};
</script>
<template>
    <div class="col-span-4 lg:col-span-4 xl:col-span-3 pb-0">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button text @click="piVisible = true" style="width: 100%; height: 100%; justify-content: center">
                    <VueNeonLight :flash="false" color="#ff00ff90"> Doom </VueNeonLight>
                </Button>
            </div>
        </CardEffect>
        <CustomDialog :visible="piVisible" @update:visible="onHide()" :maximized="true" :modal="true"
            class="dialog-terminal p-dialog-maximized" :contentStyle="{ height: 'calc(100vh - 2rem)' }">
            <div class="iframe-container">
                <DosPlayer :game="'doom.jsdos'" :visible="isVisible" />
            </div>
        </CustomDialog>
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
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    overflow: hidden;
}

.iframe {
    width: 100%;
    height: 100%;
    border: none;
    transform-origin: 0 0;
}

:deep(.p-dialog.p-dialog-maximized) {
    padding: 1rem;
}

:deep(.p-dialog-content) {
    padding: 0;
    overflow: hidden;
}

.p-dialog-content {
    padding: 0;
}
</style>

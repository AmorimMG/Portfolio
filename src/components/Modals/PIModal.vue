<script>
import { ref } from 'vue';
import CardEffect from '../CardEffect.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CustomDialog from './CustomDialog.vue';

export default {
    components: {
        CardEffect,
        VueNeonLight,
        CustomDialog
    },
    data() {
        return {
            piVisible: ref(false)
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.piVisible = false;
        }
    }
};
</script>

<template>
    <div class="col-span-4 lg:col-span-4 xl:col-span-3 pb-0">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button text @click="piVisible = true" style="width: 100%; height: 100%; justify-content: center">
                    <VueNeonLight :flash="false" color="#ff00ff90"> pi </VueNeonLight>
                </Button>
            </div>
        </CardEffect>
        <CustomDialog :visible="piVisible" @update:visible="onHide()" :maximized="true" :modal="true"
            class="dialog-terminal p-dialog-maximized" contentStyle="width: 100%; height: 100%;">
            <div class="iframe-container" style="width: 100%; height: 100%; overflow: hidden">
                <iframe id="iframe" class="iframe" ref="iframe" src="https://pi.amorim.pro" scrolling="auto"
                    style="border: none"></iframe>
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
</style>

<script>
import { ref } from "vue";
import CardEffect from "../CardEffect.vue";
import VueNeonLight from "../VueNeonLight/vue-neon-light.vue";

export default {
	components: {
		CardEffect,
		VueNeonLight,
	},
	data() {
		return {
			piVisible: ref(false),
		};
	},
	methods: {
		onHide() {
			this.$emit("close");
			this.piVisible = false;
		},
	},
};
</script>

<template>
    <div class="col-4 lg:col-4 xl:col-3 pb-0">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button text @click="piVisible = true" style="width: 100%; height: 100%; justify-content: center">
                    <VueNeonLight :flash="false" color="#ff00ff90">{{$t('pi')}}</VueNeonLight>
                </Button>
            </div>
        </CardEffect>
        <Dialog :visible="piVisible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
             <div class="zoom-controls">
<!--                 <Button @click="zoomIn">Zoom In</Button>
                <Button @click="zoomOut">Zoom Out</Button> -->
                <Button v-tooltip.top="'Close'" icon="pi pi-times" severity="danger" @click="onHide()"></Button>
            </div>
            <div class="iframe-container" style="width: 100%; height: 100%; overflow: hidden">
                <iframe id="iframe" class="iframe" ref="iframe" src="https://pi.amorim.pro" scrolling="auto" style="border: none"></iframe>
            </div>
        </Dialog>
    </div>
</template>

<style>
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

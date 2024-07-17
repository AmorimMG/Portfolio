<script>
import { ref } from 'vue';

export default {
    props: {
        header: String
    },
    data() {
        return {
            scale: 1,
            projectsVisible: ref(false)
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.projectsVisible = false;
        }
    }
};
</script>

<template>
    <div class="col-4 lg:col-4 xl:col-3">
        <div class="card mb-0 center" style="padding: 0">
            <Button v-tooltip.top="'My Projects'" @click="projectsVisible = true" style="width: 100%; height: 100%; justify-content: center">
                <h2 :class="{ glitch: isGlitchActive }">Projects</h2>
            </Button>
        </div>
        <Dialog :visible="projectsVisible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
            <template #header>
                <div class="inline-flex align-items-center justify-content-center gap-2">AmorimMG</div>
            </template>
            <div class="popup-content">
                <div class="grid gap-4">
                    <div class="col-3 lg:col-3 xl:col-4 center" v-tooltip.top="'RPG'" style="background-color: #9730a3">

                    </div>
                    <div class="col-3 lg:col-3 xl:col-4 center" v-tooltip.top="'Whatsapp Clone'" style="background-color: #9730a3">

                    </div>
                    <div class="col-3 lg:col-3 xl:col-4 center" v-tooltip.top="'Ecommerce'" style="background-color: #9730a3">

                    </div>
                    <div class="col-3 lg:col-3 xl:col-4 center" v-tooltip.top="'RAWG'" style="background-color: #9730a3">

                    </div>
                    <div class="col-3 lg:col-3 xl:col-4 center" v-tooltip.top="'Netflix'" style="background-color: #9730a3">

                    </div>
                    <div class="col-3 lg:col-3 xl:col-4 center" v-tooltip.top="'Snake'" style="background-color: #9730a3">

                    </div>
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

<script>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import CardEffect from '../../CardEffect.vue';
import Projects from '../../Projects.vue';
import { projetos as projetos } from '../../../data/projetos';

export default {
    components: {
        CardEffect,
        Projects,
        draggable
    },
    data() {
        return {
            projectsVisible: ref(false),
            projects: ref(projetos)
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
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button @click="projectsVisible = true" style="width: 100%; height: 100%; justify-content: center">
                    <h2 style="color: white">Projects</h2>
                </Button>
            </div>
        </CardEffect>
        <Dialog :visible="projectsVisible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
            <template #header>
                <div class="inline-flex align-items-center justify-content-center gap-2">AmorimMG</div>
            </template>
            <div class="popup-content">
                <draggable class="grid" v-model="projects" item-key="id" group="projects" animation="200">
                    <template #item="{ element }">
                        <Projects class="center col-4" :img="element.img" :title="element.title" :subtitle="element.subtitle" :description="element.description" />
                    </template>
                </draggable>
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

.popup-content {
    overflow-x: hidden;
}

.p-dialog-content {
    padding: 0;
    overflow-x: hidden;
}

.grid {
    padding: 50px;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

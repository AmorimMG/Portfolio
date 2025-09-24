<script>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import { RESTAPI } from '../../service/api';
import CardEffect from '../CardEffect.vue';
import Projects from '../Projects.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CustomDialog from './CustomDialog.vue';

export default {
    components: {
        CardEffect,
        Projects,
        draggable,
        VueNeonLight,
        CustomDialog
    },
    data() {
        return {
            projectsVisible: ref(false),
            projects: ref('')
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.projectsVisible = false;
        }
    },
    created() {
        RESTAPI.ProjetoObterTodos().then((response) => {
            this.projects = response.data;
        });
    }
};
</script>

<template>
    <div class="w-full sm:w-1/3 lg:w-1/3 xl:w-1/4 pb-0">
        <CardEffect>
            <div class="card mb-0 flex justify-center items-center p-0">
                <Button text @click="projectsVisible = true" class="w-full h-full flex justify-center items-center">
                    <VueNeonLight :flash="false" class="text-white">
                        {{ $t('projects') }}
                    </VueNeonLight>
                </Button>
            </div>
        </CardEffect>

        <CustomDialog :visible="projectsVisible" @update:visible="onHide()" :maximized="true" :modal="true" class="dialog-terminal p-dialog-maximized">
            <div class="overflow-x-hidden" style="background: rgba(40, 33, 59, 0.9); backdrop-filter: blur(10px)">
                <draggable class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-12" v-model="projects" item-key="id" group="projects" animation="200">
                    <template #item="{ element }">
                        <Projects class="flex justify-center items-center" :languages="element.languages" :img="element.img" :title="element.title" :subtitle="element.subtitle" :description="element.description" :link="element.link" />
                    </template>
                </draggable>
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
</style>

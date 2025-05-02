<script>
import { ref } from 'vue';
import ModalHeader from '../Modals/ModalHeader.vue';
import ThreeJS from '../ThreeJSGame/Pointerlock.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';

export default {
    components: {
        VueNeonLight,
        ThreeJS,
        ModalHeader
    },
    data() {
        return {
            pointerlockVisible: ref(false),
            immersive: ref(false)
        };
    },
    methods: {
        onHide() {
            this.pointerlockVisible = false;
        }
    }
};
</script>

<template>
    <Button text class="w-full h-full" @click="pointerlockVisible = true"
        style="width: 100%; height: 100%; justify-content: center">
        <VueNeonLight size="15px" :flash="false" style="color: white"></VueNeonLight>
    </Button>
    <Dialog v-if="pointerlockVisible" :visible="pointerlockVisible" @update:visible="onHide" :maximized="true"
        :modal="true" :closable="false" :unstyled="true" class="p-dialog-maximized" style="z-index: 10"
        :contentStyle="'overflow-y: hidden'">
        <template #header>
            <ModalHeader @close="onHide" />
        </template>
        aaaaaaaaaaaaaaaaaaa
        <ThreeJS />
    </Dialog>
</template>

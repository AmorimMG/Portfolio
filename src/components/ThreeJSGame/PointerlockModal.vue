<script>
import { ref } from 'vue';
import CustomDialog from '../Modals/CustomDialog.vue';
import Pointerlock from '../ThreeJSGame/Pointerlock.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';

export default {
    components: {
        VueNeonLight,
        Pointerlock,
        CustomDialog
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
    <div class="pointerlock-root" v-bind="$attrs">
        <Button text class="w-full h-full" @click="pointerlockVisible = true"
            style="width: 100%; height: 100%; justify-content: center">
            <VueNeonLight size="15px" :flash="false" style="color: white"></VueNeonLight>
        </Button>
        <CustomDialog v-if="pointerlockVisible" :visible="pointerlockVisible" @update:visible="onHide" :maximized="true"
            :modal="true" :closable="false" :unstyled="true" class="p-dialog-maximized" style="z-index: 10"
            :contentStyle="'overflow-y: hidden'">
            <Pointerlock />
        </CustomDialog>
    </div>
</template>

<script>
import { ref } from 'vue';
import CardEffect from '../CardEffect.vue';
import Severence from '../Severence.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CustomDialog from './CustomDialog.vue';

export default {
    components: {
        CardEffect,
        VueNeonLight,
        CustomDialog,
        Severence
    },
    data() {
        return {
            severenceVisible: ref(false)
        };
    },
    methods: {
        onHide() {
            this.$emit('close');
            this.severenceVisible = false;
        }
    }
};
</script>

<template>
    <div class="col-span-4 lg:col-span-4 xl:col-span-3 pb-0">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button text @click="severenceVisible = true"
                    style="width: 100%; height: 100%; justify-content: center">
                    <VueNeonLight :flash="false" color="#ff00ff90"> Severence </VueNeonLight>
                </Button>
            </div>
        </CardEffect>
        <CustomDialog :visible="severenceVisible" @update:visible="onHide()" :maximized="true" :modal="true"
            class="dialog-terminal p-dialog-maximized">
            <Severence />
        </CustomDialog>
    </div>
</template>

<style scoped></style>

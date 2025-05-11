<script setup>
import CardEffect from '../CardEffect.vue';
import TerminalComponent from '../Cards/TerminalComponent.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CustomDialog from './CustomDialog.vue';

const props = defineProps({
    visible: Boolean
});

const emit = defineEmits(['update:visible']);

const closeModal = () => {
    emit('update:visible', false);
};
</script>

<template>
    <div class="col-span-4 lg:col-span-4 xl:col-span-3 pb-0">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button text @click="cvVisible = true" style="width: 100%; height: 100%; justify-content: center">
                    <VueNeonLight :flash="false" color="#ff00ff90"> Terminal </VueNeonLight>
                </Button>
            </div>
        </CardEffect>
        <CustomDialog :visible="props.visible" @update:visible="closeModal" tentStyle="width: 100%; height: 100%">
            <TerminalComponent :isCard="false" class="w-full h-full" />
        </CustomDialog>
    </div>
</template>

<style scoped></style>

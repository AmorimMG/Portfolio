<script setup>
import Portfolio from '../AmorimWebsite/Portfolio.vue';
import CustomDialog from './CustomDialog.vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close', 'update:visible']);

const closeModal = () => {
    emit('update:visible', false);
};
</script>

<template>
    <CustomDialog class="dialog-terminal p-dialog-maximized"
        contentStyle="width: 100%; height: 100%; background-color: #000000cc !important; overflow-y: none;"
        :visible="props.visible" @update:visible="closeModal" :breakpoints="{ '960px': '50vw' }"
        :style="{ width: '90vw', height: '90vh' }">
        <Portfolio ref="el" class="layout-main-container" />
    </CustomDialog>
</template>

<style scoped></style>

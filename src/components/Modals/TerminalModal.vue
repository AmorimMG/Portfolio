<script setup>
import TerminalComponent from '../Cards/TerminalComponent.vue';
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
    <CustomDialog :visible="props.visible" @update:visible="closeModal" tentStyle="width: 100%; height: 100%">
        <TerminalComponent :isCard="false" class="w-full h-full" />
    </CustomDialog>
</template>

<style scoped></style>

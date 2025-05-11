<script setup>
import CustomDialog from '../Modals/CustomDialog.vue';

const props = defineProps({
    visible: Boolean
});

const emit = defineEmits(['update:visible']);

const closeModal = () => {
    emit('update:visible', false);
};
</script>

<template>
    <CustomDialog :visible="props.visible" @update:visible="closeModal">
        <iframe src="https://stackblitz.com/github.com/AmorimMG/Portfolio?embed=1&file=src/views/Dashboard.vue&hideNavigation=1&theme=dark" class="vscode-wrapper" title="VS Code for macOS Web"></iframe>
    </CustomDialog>
</template>

<style scoped>
.vscode-wrapper {
    width: 100%;
    height: 100%;
}
</style>

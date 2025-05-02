<script setup>
import System from './System.vue';

const props = defineProps({
    visible: Boolean
});

const emit = defineEmits(['hide']);

const onHide = () => {
    emit('hide');
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="onHide" :showHeader="false" :maximized="true" :modal="true"
        class="p-dialog-maximized" contentStyle="overflow-y: hidden;">
        <System />
    </Dialog>
</template>

<style scoped></style>

<script setup>
    import Dock from './Dock.vue';
    
const props = defineProps({
	visible: Boolean,
});

const emit = defineEmits(["hide"]);

const onHide = () => {
	emit("hide");
};
</script>

<template>
    <Dialog :visible="visible" @update:visible="onHide" :showHeader="false" :maximized="true" :modal="true" class="p-dialog-maximized" contentStyle="overflow-y: hidden;">
        <Dock />
    </Dialog>
</template>

<style scoped>
</style>

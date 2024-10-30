<script>
import DynamicModal from './components/DynamicModal.vue';
import NeonCursor from './components/NeonCursor.vue';

export default {
    components: {
        DynamicModal,
        NeonCursor
    }
};
</script>

<template>
    <Message class="absolute top-0 w-full z-5" style="color: white" severity="info" icon="pi pi-info">In Development</Message>
    <Toast />
    <router-view />
    <DynamicModal />
<!--     <NeonCursor /> -->
</template>

<style scoped></style>

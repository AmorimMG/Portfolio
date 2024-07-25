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
    <router-view />
    <DynamicModal />
<!--     <NeonCursor /> -->
</template>

<style scoped></style>

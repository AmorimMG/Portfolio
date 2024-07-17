<script>
import DynamicModal from './components/DynamicModal.vue';

export default {
    components: {
        DynamicModal
    }
};
</script>

<template>
    <router-view />
    <DynamicModal />
</template>

<style scoped></style>

<script>
import DynamicModal from './components/DynamicModal.vue';

export default {
    components: {
        DynamicModal
    }
};
</script>

<template>
    <Toast />
    <router-view />
    <DynamicModal />
</template>

<style>
body {
    user-select: none;
}
</style>

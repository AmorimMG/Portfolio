<script>
import DynamicModal from './components/DynamicModal.vue';
import FullscreenButton from './components/FullscreenButton.vue';

export default {
    components: {
        DynamicModal,
        FullscreenButton
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

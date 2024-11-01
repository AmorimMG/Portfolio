<script>
import { useToast } from "primevue/usetoast";
import DynamicModal from './components/DynamicModal.vue';

export default {
    components: {
        DynamicModal
    },
    mounted(){
        useToast().add({ severity: 'warn', summary: 'Warn Message', detail: 'This Project is in Development' });
    }
};
</script>

<template>
    <Toast />
    <router-view />
    <DynamicModal />
    <NeonCursor />
</template>

<style>
body{
    user-select: none;
}
</style>

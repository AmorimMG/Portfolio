<script setup>
import { useToast } from "primevue/usetoast";
import { onMounted } from "vue";

onMounted(() => {
    useToast().removeAllGroups();
});

</script>

<template>
     <div class="iframe-container" style="width: 100%; height: 83vh; overflow: hidden; top: 0; left: 0">
        <iframe id="iframe" class="iframe" ref="iframe" src="https://glance.amorim.pro" scrolling="auto" style="border: none" ></iframe>
     </div>
</template>

<style scoped>

.iframe-container {
    width: 100%;
    height: 100%;
}

.iframe {
    width: 100%;
    height: 100%;
    border: none;
    transform-origin: 0 0;
}
</style>

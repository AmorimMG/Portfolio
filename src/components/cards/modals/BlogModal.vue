<script setup>
import { ref } from 'vue';
import CardEffect from '../../CardEffect.vue';
import VueNeonLight from '../../VueNeonLight/vue-neon-light.vue';
import Dock from './Dock/Dock.vue';

const blogVisible = ref(false);

const onHide = () => {
    blogVisible.value = false;
};
</script>

<template>
    <div class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button text @click="blogVisible = true" style="width: 100%; height: 100%; justify-content: center">
                    <VueNeonLight size="30px" :flash="false" style="color: white">Blog</VueNeonLight>
                </Button>

                Read more ->
            </div>
        </CardEffect>

        <Dialog :visible="blogVisible" @update:visible="onHide()" :maximized="true" :modal="true" class="p-dialog-maximized">
            <template #header>
                <div class="inline-flex align-items-center justify-content-center gap-2">Dock</div>
            </template>
            <div class="popup-content">
                <Dock />
            </div>
        </Dialog>
    </div>
</template>

<style scoped></style>

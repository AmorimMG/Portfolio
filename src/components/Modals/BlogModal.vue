<script setup>
import { ref } from 'vue';
import CardEffect from '../CardEffect.vue';
import VueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import FileSystemModal from './FileSystemModal.vue';

const fileSystemOpen = ref(false);
</script>

<template>
    <div class="col-span-4 lg:col-span-4 xl:col-span-3">
        <CardEffect>
            <div class="card mb-0 center" style="padding: 0">
                <Button text @click="fileSystemOpen = true" style="width: 100%; height: 100%; justify-content: center">
                    <VueNeonLight :flash="false" style="color: white">{{ $t('blog') }}</VueNeonLight>
                </Button>
            </div>
        </CardEffect>
        <FileSystemModal @close="fileSystemOpen = false" v-model:visible="fileSystemOpen" modalType="documents" />
    </div>
</template>

<style scoped></style>

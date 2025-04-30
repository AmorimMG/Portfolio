<script setup>
import { ref } from "vue";
import CardEffect from "./CardEffect.vue";

const props = defineProps({
    img: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    languages: [{
        type: String,
        required: true
    }]
});

const imageLoaded = ref(false);

const handleImageLoad = () => {
    imageLoaded.value = true;
};
</script>

<template>
    <CardEffect>
        <Card style="width: 25rem; overflow: hidden">
            <template #header>
                <div style="width: 100%; height: 200px; position: relative; overflow: hidden;">
                    <Skeleton v-if="!imageLoaded" width="100%" height="100%" class="border-round"
                        style="position: absolute; top: 0; left: 0; z-index: 1;" />
                    <img loading="lazy" v-show="imageLoaded" :alt="title" :src="props.img" height="200px"
                        style="width: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 2;"
                        @load="handleImageLoad" />
                </div>
            </template>
            <template #title>{{ props.title }}</template>
            <template #subtitle>
                <div class="flex justify-content-between align-items-center">
                    <div>
                        {{ props.subtitle }}
                    </div>
                    <div class="flex gap-3 mt-1">
                        <Tag class="p-2" v-for="language in languages" :value="language" :key="language"
                            severity="success"></Tag>
                    </div>
                </div>
            </template>
            <template #content>
                <p class="m-0">{{ props.description }}</p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <a class="w-full" :href="props.link" target="_blank" rel="noopener noreferrer">
                        <Button label="Open" outlined class="w-full" />
                    </a>
                </div>
            </template>
        </Card>
    </CardEffect>
</template>

<script setup>
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
</script>

<template>
    <CardEffect>
        <Card style="width: 25rem; overflow: hidden">
            <template #header>
                <img height="200px" :alt="title" :src="props.img" />
            </template>
            <template #title>{{ props.title }}</template>
            <template #subtitle>
                <div class="flex justify-content-between align-items-center">
                    <div>
                        {{ props.subtitle }}
                    </div>
                    <div class="flex gap-3 mt-1">
                        <Tag class="p-2" v-for="language in languages" :value="language" :key="language" severity="success" ></Tag>
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

<style></style>

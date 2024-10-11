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
});
</script>

<template>
    <CardEffect>
        <Card style="width: 25rem; overflow: hidden">
            <template #header>
                <img height="200px" :alt="title" :src="props.img" />
            </template>
            <template #title>{{ props.title }}</template>
            <template #subtitle>{{ props.subtitle }}</template>
            <template #content>
                <p class="m-0">{{ props.description }}</p>
            </template>
            <template #footer>
                <div class="flex gap-4 mt-1">
                    <Button label="Open" outlined class="w-full" />
                </div>
            </template>
        </Card>
    </CardEffect>
</template>

<style></style>

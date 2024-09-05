<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import VueWordCloud from "vuewordcloud";
import CardEffect from "../CardEffect.vue";
import VueNeonLight from "../VueNeonLight/vue-neon-light.vue";

const wrapper = ref(null);
const cloudSize = ref(300);
const isVisible = ref(false);
const loading = ref(false);

const words = ref([
	["Vue", 19],
	["React", 15],
	["JavaScript", 12],
	["TypeScript", 10],
	["HTML", 8],
	["CSS", 8],
	["Node.js", 7],
	["Express", 6],
	["MongoDB", 5],
	["Git", 4],
	["Webpack", 3],
	["Docker", 3],
	["Python", 9],
	["Java", 8],
	["C#", 7],
	["PHP", 6],
	["Ruby", 5],
	["Go", 4],
	["Rust", 3],
	["Swift", 3],
	["Kotlin", 3],
	["SQL", 6],
	["PostgreSQL", 5],
	["Redis", 4],
	["GraphQL", 5],
	["REST API", 7],
	["AWS", 6],
	["Azure", 5],
	["Google Cloud", 4],
	["Kubernetes", 4],
	["Jenkins", 3],
	["GitLab CI", 3],
	["Ansible", 3],
	["Terraform", 3],
	["Sass", 4],
	["Less", 3],
	["Tailwind CSS", 5],
	["Bootstrap", 4],
	["Jest", 4],
	["Mocha", 3],
	["Cypress", 3],
	["Selenium", 3],
]);

const colorFunction = (word, weight) => {
	if (weight > 15) return "#FF1493"; // DeepPink
	if (weight > 12) return "#4169E1"; // RoyalBlue
	if (weight > 9) return "#00CED1"; // DarkTurquoise
	if (weight > 7) return "#FFA500"; // Orange
	if (weight > 5) return "#32CD32"; // LimeGreen
	if (weight > 3) return "#FF69B4"; // HotPink
	return "#9370DB"; // MediumPurple
};

const rotationFunction = () => {
	const rand = Math.random();
	if (rand < 0.3) return 0;
	if (rand < 0.6) return 90;
	return 270;
};

const getFontSize = (weight) => {
	// Adjust these values as needed
	if (weight > 15) return "25px";
	if (weight > 12) return "22px";
	if (weight > 10) return "20px";
	if (weight > 7) return "15px";
	if (weight > 5) return "10px";
	if (weight > 3) return "8px";
	return "10px";
};

const onWordClick = (word) => {
	console.log("Clicked word:", word);
};

const updateCloudSize = () => {
	if (wrapper.value) {
		const card = wrapper.value.closest(".card");
		if (card) {
			const cardHeight = card.clientHeight;
			const cardWidth = card.clientWidth;
			const size = Math.min(cardHeight, cardWidth, 800);
			cloudSize.value = size > 0 ? size : 300;
		}
	}
};

const checkVisibility = () => {
	if (wrapper.value) {
		const rect = wrapper.value.getBoundingClientRect();
		isVisible.value = rect.top < window.innerHeight && rect.bottom >= 0;
	}
};

onMounted(() => {
	nextTick(() => {
		updateCloudSize();
		checkVisibility();
		window.addEventListener("resize", updateCloudSize);
		window.addEventListener("scroll", checkVisibility);
	});
});

watch(isVisible, (newValue) => {
	if (newValue) {
		nextTick(updateCloudSize);
	}
});

const wordCloudStyle = computed(() => ({
	display: loading.value ? "none" : "block",
}));

const onWordCloudLoaded = () => {
	loading.value = false;
};
</script>

<template>
    <div class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="card">
                <div class="stack-wrapper" ref="wrapper">
                    <ProgressSpinner v-if="loading" />
                    <vue-word-cloud :style="wordCloudStyle" :words="words" :color="colorFunction" font-family="Roboto" :rotation="rotationFunction" :spacing="1" :font-size-ratio="4" @loaded="onWordCloudLoaded">
                        <template #default="{ text, weight, word }">
                            <div :title="text" style="cursor: pointer" @click="onWordClick(word)">
                                <VueNeonLight :size="getFontSize(weight)" :flash="false" :color="colorFunction(word, weight)">
                                    {{ text }}
                                </VueNeonLight>
                            </div>
                        </template>
                    </vue-word-cloud>
                </div>
            </div>
        </CardEffect>
    </div>
</template>

<style scoped>
.card {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0 !important;
}

.stack-wrapper {
    max-width: 100%;
    max-height: 100%;
    width: 80%;
    height: 110%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

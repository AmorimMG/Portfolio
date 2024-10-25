<script setup>
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
//#region imports
import { onMounted, ref } from "vue";
import draggable from "vuedraggable";
import Background from "../components/Background.vue";
import Introduction from "../components/Cards/Introduction.vue";
import { componentMap, cards as initialCards } from "../data/cardsDashboard";
//#endregion

//#region variables
const cards = ref(initialCards);
const isStarted = ref(false);
const menuVisible = ref(true);

const items = ref([
	{
		label: "Translate",
		icon: "pi pi-language",
	},
	{
		label: "Speech",
		icon: "pi pi-volume-up",
		items: [
			{
				label: "Start",
				icon: "pi pi-caret-right",
			},
			{
				label: "Stop",
				icon: "pi pi-pause",
			},
		],
	},
	{
		separator: true,
	},
	{
		label: "Print",
		icon: "pi pi-print",
	},
]);

const toggleMenu = () => {
	menuVisible.value = !menuVisible.value;
};

//#endregion

//#region methods

onMounted(() => {
	setTimeout(() => {
		isStarted.value = true;
	}, 2000);
});

//#endregion
</script>

<template>
    <button id="toggleMenuButton" class="p-btn p-link layout-topbar-button" type="button" @click="toggleMenu()">
        <FontAwesomeIcon style="font-size: 20px" :icon="faBars" />
    </button>

    <div class="layout-main-container">
        <Background />
        <ContextMenu global :model="items" />
        <div v-if="!isStarted" class="center">
            <img class="gif-container" src="/src/assets/images/Cards/glitchIntroduction.gif" />
            <div class="black-screen"></div>
        </div>
        <div :class="{ 'hidden': !isStarted, 'fade-in': isStarted }" class="grid components-container justify-content-center">
            <!-- <app-topbar :applyGlitchEffect="applyGlitchEffect" /> -->
            
            <div id="Introduction" class="col-4 lg:col-3 xl:col-3 p-0">
                <Introduction :menuVisible="menuVisible" @update:menuVisible="menuVisible = $event" />
            </div>
            <draggable
                class="draggable col-12 lg:col-9 xl:col-9"
                v-model="cards"
                item-key="id"
                group="cards"
                animation="200"
                >
                <template #item="{ element }">
                    <div
                    class="grid"
                    style="width: 100%; height: 100%;"
                    :style="{
                        'grid-column': 'span ' + element.colSpan,
                        'grid-row': 'span ' + element.rowSpan
                    }"
                    >
                    <!-- Check if there are two components to stack -->
                    <template v-if="element.firstComponentName && element.secondComponentName">
                        <div class="col-12 lg:col-9 xl:col-9 w-full" style="display: flex; flex-direction: column; gap: 1rem;">
                            <component class="w-full p-0" :class="{ 'aspect-ratio-2-1': true }" style="flex: 1" :is="componentMap[element.firstComponentName]" />
                            <component class="w-full p-0" :class="{ 'aspect-ratio-2-1': true }" style="flex: 1"  :is="componentMap[element.secondComponentName]" />
                        </div>
                    </template>

                    <!-- Render single component -->
                    <template v-else>
                        <component
                        style="width: 100%"
                        :is="componentMap[element.name]"
                        :style="{
                            'grid-column': 'span ' + element.colSpan,
                            'grid-row': 'span ' + element.rowSpan
                        }"
                    />
                    </template>
                    </div>
                </template>
            </draggable>
        </div>
    </div>
    <ScrollTop />
</template>

<style src="./styles.scss"></style>

<style scoped>
.black-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 999;
}

.gif-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
}

.grid{
    margin-left: 0;
    margin-right: 0
}

.hidden {
    display: none;
}

.fade-in {
    animation: fadeIn 0.5s;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>

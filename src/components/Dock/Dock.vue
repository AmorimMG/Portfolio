<script setup>
import { ref, watchEffect } from 'vue';
import { widgets as initialWidgets } from '../../data/appsDock';
import Select from '../Select.vue';
import DockBottombar from './DockBottomBar.vue';
import DockTopbar from './DockTopBar.vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    modelValue: {
        type: String,
        default: 'https://primefaces.org/cdn/primevue/images/dock/window.jpg',
    },
});

const widgets = ref(initialWidgets);

const background = ref(props.modelValue);

const items = ref([
    {
		label: "New Folder",
		icon: "pi pi-folder",
	},
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

watchEffect(() => {
    background.value = props.modelValue;
})
</script>

<template>
    <div class="dock-demo">
        <ContextMenu global :model="items" />
        <Toast position="top-center" group="tc" />
        <DockTopbar @hide="onHide" v-model="background" />
        <div class="dock-window dock-advanced" :style="{ 'background-image': `url(${background})` }">
            <div class="wrapper flex justify-content-between flex-wrap">
                <div class="apps">
                    <Select />
                </div>
            </div>
            <DockBottombar />
        </div>
    </div>
</template>

<style scoped>
.dock-demo {
    padding: 0;
    height: 100vh;
    user-select: none;
}

.draggableApps {
    display: grid;
    grid-gap: 5px;
    width: 100%;
    grid-template-rows: repeat(5, 1fr);
    grid-auto-flow: column;
}

.draggableWidgets {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    grid-template-rows: repeat(3, 1fr);
    grid-auto-flow: column;
}

.app-card {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    opacity: 0;
}

.app-card * {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    flex-flow: wrap;
}

.app-icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: -80px;
}

.app-widgets {
    width: 250px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.app-widgets * {
    font-size: 1rem !important;
    padding: 0;
    border: none;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    text-align: center;
}

.app-widgets > .h-full .card {
    width: 250px;
}

.dock-demo > .dock-window {
    width: 100%;
    height: 100vh;
    position: fixed;
    background-repeat: no-repeat;
    background-size: cover;
}

.dock-demo .p-menubar {
    padding: 0;
    border-radius: 0;
}

.widgets{
    position: absolute;
    right: 0;
}
</style>

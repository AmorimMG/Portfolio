<script setup>
import { ref, watchEffect } from 'vue';
import draggable from 'vuedraggable';
import { componentMap, widgets as initialWidgets } from '../../data/appsDock';
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
            <div class="wrapper flex justify-content-between">
                <div class="apps">
                    <Select />
                </div>
                <div class="widgets mr-8">
                    <draggable class="draggableWidgets" v-model="widgets" item-key="id" group="widgets" animation="200">
                        <template #item="{ element }">
                            <component
                                class="app-widgets"
                                :is="componentMap[element.name]"
                                :style="{
                                    'grid-column': 'span ' + element.colSpan,
                                    'grid-row': 'span ' + element.rowSpan,
                                }"
                            />
                        </template>
                    </draggable>
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

.apps{
    width: 100vw;
    height: 100vh;
}

.widgets{
    position: absolute;
    right: 0;
}

.draggableWidgets {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
    grid-template-rows: repeat(3, 1fr);
    grid-auto-flow: column;
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

</style>

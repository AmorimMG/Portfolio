<script setup>
import { ref, watchEffect } from 'vue';
import draggable from 'vuedraggable';
import { componentMap, apps as initialApps, widgets as initialWidgets } from '../../data/appsDock';
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
const apps = ref(initialApps);

const background = ref(props.modelValue);

watchEffect(() => {
    background.value = props.modelValue;
})
</script>

<template>
    <div class="dock-demo">
        <Toast position="top-center" group="tc" />
        <DockTopbar @hide="onHide" v-model="background" />
        <div class="dock-window dock-advanced" :style="{ 'background-image': `url(${background})` }">
            <div class="wrapper flex justify-content-between flex-wrap">
                <div class="apps">
                    <draggable class="draggableApps" v-model="apps" item-key="id" group="apps" animation="200">
                        <template #item="{ element }">
                            <div class="app-container">
                                <component
                                    class="app-card"
                                    :is="componentMap[element.name]"
                                    :style="{
                                        'grid-column': 'span ' + element.colSpan,
                                        'grid-row': 'span ' + element.rowSpan,
                                    }"
                                />
                                <div class="app-icon-wrapper">
                                    <img :src="element.icon" style="width: 50px" />
                                    <div class="app-title">{{ element.title }}</div>
                                </div>
                            </div>
                        </template>
                    </draggable>
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

.app-container:hover {
    outline: 1px solid #007ad9;
    outline-offset: -2px;
    background-color: rgba(0, 0, 0, 0.2);
}

.app-title {
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
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

.dock-demo {
    padding: 0;
    height: 100vh;
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
</style>

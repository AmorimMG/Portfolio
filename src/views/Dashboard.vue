<script setup>
//#region imports
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import Introduction from '../components/cards/Introduction.vue';
import { componentMap, cards as initialCards } from '../utils/cardsDashboard';
//#endregion

//#region variables
const cards = ref(initialCards);
const overlayPanel = ref();
const isStarted = ref(false);
const isGlitchActive = ref(false);

const items = ref([
    {
        label: 'Translate',
        icon: 'pi pi-language'
    },
    {
        label: 'Speech',
        icon: 'pi pi-volume-up',
        items: [
            {
                label: 'Start',
                icon: 'pi pi-caret-right'
            },
            {
                label: 'Stop',
                icon: 'pi pi-pause'
            }
        ]
    },
    {
        separator: true
    },
    {
        label: 'Print',
        icon: 'pi pi-print'
    }
]);

//#endregion

//#region methods

const applyGlitchEffect = () => {
    isGlitchActive.value = true;
    setTimeout(() => {
        isGlitchActive.value = false;
    }, 2000);
};

onMounted(() => {
    setTimeout(() => {
        isStarted.value = true;
    }, 2000);
});
//#endregion
</script>

<template>
    <div class="layout-main-container">
        <!--  <Background /> -->
        <ContextMenu global :model="items" />
        <div v-if="!isStarted" class="center">
            <img class="gif-container" src="/src/assets/images/glitchIntroduction.gif" />
            <div class="black-screen"></div>
        </div>
        <transition name="fade">
            <div v-show="isStarted" class="grid components-container justify-content-center">
                <!-- <app-topbar :applyGlitchEffect="applyGlitchEffect" /> -->
                <div id="Introduction" class="col-4 lg:col-3 xl:col-3 p-0">
                    <Introduction class="col-2" :isGlitchActive="isGlitchActive" />
                </div>
                <draggable class="draggable col-12 lg:col-9 xl:col-9" v-model="cards" item-key="id" group="cards" animation="200">
                    <template #item="{ element }">
                        <component
                            style="width: 100%"
                            :class="{ glitch: isGlitchActive }"
                            :is="componentMap[element.name]"
                            :isGlitchActive="isGlitchActive"
                            :style="{
                                'grid-column': 'span ' + element.colSpan,
                                'grid-row': 'span ' + element.rowSpan
                            }"
                        />
                    </template>
                </draggable>
                <!--  <Actitivies :discordData="discordData()" /> -->
            </div>
        </transition>
    </div>
    <ScrollTop />
</template>
<style src="./styles.scss"></style>

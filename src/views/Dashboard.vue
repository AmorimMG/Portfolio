<script setup>
//#region imports
import { ref, onMounted } from 'vue';
import draggable from 'vuedraggable';
import Introduction from '../components/cards/Introduction.vue';
import { componentMap, cards as initialCards } from '../data/cardsDashboard';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
//#endregion

//#region variables
const cards = ref(initialCards);
const isStarted = ref(false);
const menuVisible = ref(true);

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
        <!--  <Background /> -->
        <ContextMenu global :model="items" />
        <div v-if="!isStarted" class="center">
            <img class="gif-container" src="/src/assets/images/cards/glitchIntroduction.gif" />
            <div class="black-screen"></div>
        </div>
        <transition name="fade">
            <div v-show="isStarted" class="grid components-container justify-content-center">
                <!-- <app-topbar :applyGlitchEffect="applyGlitchEffect" /> -->
                <draggable :disabled="true" class="draggable col-12 lg:col-9 xl:col-9" v-model="cards" item-key="id" group="cards" animation="200">
                    <template #item="{ element }">
                        <component
                            style="width: 100%"
                            :is="componentMap[element.name]"
                            :style="{
                                'grid-column': 'span ' + element.colSpan,
                                'grid-row': 'span ' + element.rowSpan
                            }"
                        />
                    </template>
                </draggable>
                <div id="Introduction" class="col-4 lg:col-3 xl:col-3 p-0">
                    <Introduction :menuVisible="menuVisible" @update:menuVisible="menuVisible = $event" />
                </div>
            </div>
        </transition>
    </div>
    <ScrollTop />
</template>
<style src="./styles.scss"></style>

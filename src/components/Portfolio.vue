<script setup>
//#region imports
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { onMounted, ref } from 'vue';
import draggable from 'vuedraggable';
import Background from '../components/Background.vue';
import Introduction from '../components/Cards/Introduction.vue';
import { componentMap, cards as initialCards } from '../data/cardsDashboard';
//#endregion

//#region variables
const cards = ref(initialCards);
const isStarted = ref(false);
const menuVisible = ref(true);
const showOverlay = ref(true);

const toggleMenu = () => {
    menuVisible.value = showOverlay.value = !menuVisible.value;
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
    <div class="portfolio-root" v-bind="$attrs">
        <button id="toggleMenuButton" class="p-btn p-link layout-topbar-button" type="button" aria-label="Toggle menu"
            @click="toggleMenu()">
            <FontAwesomeIcon style="font-size: 20px; color: black" :icon="faBars" />
        </button>

        <div class="layout-main-container">
            <Background />
            <transition name="fade">
                <div v-if="!isStarted" id="components-container" class="grid components-container justify-center">
                    <img loading="lazy" class="gif-container" src="@/assets/images/cards/glitchIntroduction.gif" />
                    <div class="black-screen"></div>
                </div>
            </transition>
            <div id="components-container" :class="{ hidden: !isStarted, 'fade-in': isStarted }"
                class="grid grid-cols-12 gap-4 justify-center">
                <div :style="{ display: menuVisible ? 'flex' : 'none' }" id="Introduction"
                    class="col-span-12 lg:col-span-3 xl:col-span-3 p-0">
                    <Introduction :menuVisible="menuVisible" @update:menuVisible="menuVisible = $event" />
                </div>
                <draggable :style="{ display: !menuVisible ? 'grid' : '' }" id="draggableCards"
                    class="draggable col-span-12 lg:col-span-9 xl:col-span-9 grid grid-cols-12 gap-4 overflow-hidden"
                    v-model="cards" item-key="id" group="cards" animation="200">
                    <template #item="{ element }">
                        <div class="grid" style="width: 100%; height: 100%" :style="{
                            'grid-column': 'span ' + element.colSpan,
                            'grid-row': 'span ' + element.rowSpan
                        }">
                            <!-- Check if there are two components to stack -->
                            <template v-if="element.firstComponentName && element.secondComponentName">
                                <div class="col-span-12 lg:col-span-9 xl:col-span-9 w-full"
                                    style="display: flex; flex-direction: column; gap: 1rem">
                                    <component class="w-full max-w-full overflow-hidden p-0"
                                        :class="{ 'aspect-ratio-2-1': true }" style="flex: 1"
                                        :is="componentMap[element.firstComponentName]" />
                                    <component class="w-full max-w-full overflow-hidden p-0"
                                        :class="{ 'aspect-ratio-2-1': true }" style="flex: 1"
                                        :is="componentMap[element.secondComponentName]" />
                                </div>
                            </template>

                            <!-- Render single component -->
                            <template v-else>
                                <component class="w-full max-w-full overflow-hidden" style="width: 100%"
                                    :is="componentMap[element.name]" :style="{
                                        'grid-column': 'span ' + element.colSpan,
                                        'grid-row': 'span ' + element.rowSpan
                                    }" />
                            </template>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
        <ScrollTop />
    </div>
</template>

<style src="../views/styles.scss"></style>

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

.grid {
    margin-left: 0;
    margin-right: 0;
}

.hidden {
    display: none;
}

.fade-in {
    animation: fadeIn 0.5s;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>

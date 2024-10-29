<script setup lang="ts">
import { ref, watch } from 'vue';
import AnaglyphText from '../components/Anaglyth.vue';

import image1 from '../assets/images/intro/1.png';
import image2 from '../assets/images/intro/2.png';
import image3 from '../assets/images/intro/3.png';
import image4 from '../assets/images/intro/4.png';
import image5 from '../assets/images/intro/5.png';

const images2 = ref([
    { id: 1, url: image1, title: '1thd', path: '/pointerlock' },
    { id: 2, url: image2, title: 'image2', path: '/game' },
    { id: 3, url: image3, title: 'image3', path: '/threejs' },
    { id: 4, url: image4, title: 'image4', path: '/dashboard' },
    { id: 5, url: image5, title: 'image5', path: '/dock' }
]);

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

const currentChannel = ref(images2.value[0]);
const activeIndex = ref(2);
const bgEffectClass = ref('');
const imgEffectClass = ref('');

const applyBgEffect = () => {
    bgEffectClass.value = 'bg-effect';
    imgEffectClass.value = 'img-effect';
    setTimeout(() => {
        bgEffectClass.value = '';
        imgEffectClass.value = '';
    }, 200);
};

watch(activeIndex, (newIndex, oldIndex) => {
    currentChannel.value = images2.value[newIndex];
    applyBgEffect();
});

const next = () => {
    activeIndex.value = activeIndex.value === images2.value.length - 1 ? images2.value.length - 1 : activeIndex.value + 1;
};
const prev = () => {
    activeIndex.value = activeIndex.value === 0 ? 0 : activeIndex.value - 1;
};
</script>

<template>
    <div class="page">
        <AnaglyphText class="center" text="Portfolios" />
        <div :class="['center w-full', bgEffectClass]">
            <img class="tv" src="@/assets/images/intro/tv.webp" />
            <Galleria
                v-model:activeIndex="activeIndex"
                class="channels"
                :value="images2"
                :responsiveOptions="responsiveOptions"
                :showThumbnails="false"
                containerStyle="max-width: 400px"
                :numVisible="5"
                :circular="true"
                :showIndicators="false"
                :changeItemOnIndicatorHover="true"
                :transitionInterval="2000"
            >
                <template #item="slotProps">
                    <img :class="['channel', imgEffectClass]" width="400px" height="400px" :src="slotProps.item.url" :alt="slotProps.item.id" />
                </template>
            </Galleria>
        </div>
        <div>
            <img class="controle" src="@/assets/images/intro/controle.png" />
            <div class="botoes-controle">
                <div class="grid gap-2">
                    <Button class="botao-controle" icon="pi pi-arrow-left" @click="prev" />
                    <Button class="botao-controle" icon="pi pi-arrow-right" @click="next" />
                </div>
                <div>
                    <router-link :to="currentChannel.path" class="layout-topbar-logo center">
                        <Button class="botao-controle" severity="success" color icon="pi pi-check" />
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.page {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: hidden;
    overflow-x: hidden;
    flex-direction: column;
    padding: 0;
}

.title-wrapper {
    z-index: 1;
    opacity: 0.5;
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.tv {
    position: absolute;
    transition: 0.3s ease-out;
    width: 600px;
    z-index: -1;
}

.controle {
    position: fixed;
    right: 0%;
    bottom: 0%;
    width: 450px;
    transition: 0.3s ease-out;
    transform: rotate(50deg);
}

.botoes-controle {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    right: 23%;
    bottom: 30%;
}

.botao-controle {
    width: 20px;
    height: 20px;
    color: #fff;
    border: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.botao-controle:hover {
    transform: scale(1.1);
}

.channels {
    position: absolute !important;
    transition: 0.3s ease-out;
}

.channel {
    z-index: -4;
    transition: 0.3s ease-out;
}

.bg-effect {
    background: repeating-radial-gradient(#000 0 0.0001%, #fff 0 0.0002%) 50% 0/2500px 2500px, repeating-conic-gradient(#000 0 0.0001%, #fff 0 0.0002%) 60% 60%/2500px 2500px;
    background-blend-mode: difference;
    animation: b 0.2s infinite alternate;
    z-index: -3;
    max-width: 400px;
    max-height: 400px;
    width: 100%;
    height: 100%;
    position: absolute;
}

.img-effect {
    display: none;
}

@keyframes b {
    100% {
        background-position: 50% 0, 60% 50%;
    }
}
</style>

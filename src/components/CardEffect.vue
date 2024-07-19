<script setup>
import { ref, computed } from 'vue';
import { useMouseInElement } from '@vueuse/core';

const target = ref(null);
const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(target);

const cardTransform = computed(() => {
    const MAX_ROTATION = 12;
    const rX = (MAX_ROTATION / 2 - (elementY.value / elementHeight.value) * MAX_ROTATION).toFixed(2); // handles x-axis
    const rY = ((elementX.value / elementWidth.value) * MAX_ROTATION - MAX_ROTATION / 2).toFixed(2); // handles y-axis
    return isOutside.value ? '' : `perspective(${elementWidth.value}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
});
</script>

<template>
    <div class="h-full" ref="target" :style="{ transform: cardTransform, transition: 'transform 0.25s ease-out' }">
        Titulo ?
        <slot></slot>
    </div>
</template>

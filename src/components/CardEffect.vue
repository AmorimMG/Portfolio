<script setup>
import { useMouseInElement } from '@vueuse/core';
import { computed, ref } from 'vue';

const target = ref(null);
const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(target);

const cardTransform = computed(() => {
    const MAX_ROTATION = 10;
    const rX = (MAX_ROTATION / 2 - (elementY.value / elementHeight.value) * MAX_ROTATION).toFixed(2);
    const rY = ((elementX.value / elementWidth.value) * MAX_ROTATION - MAX_ROTATION / 2).toFixed(2);
    return isOutside.value ? '' : `perspective(${elementWidth.value}px) rotateX(${rX}deg) rotateY(${rY}deg)`;
});

const glowPosition = computed(() => {
    if (isOutside.value) return 'none';
    const x = (elementX.value / elementWidth.value) * 100;
    const y = (elementY.value / elementHeight.value) * 100;
    return `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%)`;
});
</script>

<template>
    <div
        class="card-effect"
        ref="target"
        :style="{
            transform: cardTransform,
            transition: 'transform 0.25s ease-out',
            '--glow-position': glowPosition
        }"
    >
        <slot></slot>
    </div>
</template>

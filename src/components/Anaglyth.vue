<script>
export default {
    props: {
        text: String,
        size: {
            type: Number,
            default: 80
        }
    }
};
</script>

<template>
    <div class="anaglyph-text w-full" :style="{ fontSize: size + 'px' }">
        <span class="anaglyph-left w-full">{{ text }}</span>
        <span class="anaglyph-right w-full">{{ text }}</span>
    </div>
</template>

<style scoped>
.anaglyph-text {
    display: flex;
    justify-content: center;
    align-items: center;
}

.anaglyph-left,
.anaglyph-right {
    position: absolute;
    top: 0;
    left: 0;
    color: white;
}

.anaglyph-left {
    transform: translateX(-1px);
    filter: drop-shadow(5px 0 0 red);
    text-align: center;
}

.anaglyph-right {
    transform: translateX(1px);
    filter: drop-shadow(1px 0 0 cyan);
    text-align: center;
}
</style>

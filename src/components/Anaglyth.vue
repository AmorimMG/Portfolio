<script>
export default {
    props: {
        text: String
    }
};
</script>

<template>
    <div class="anaglyph-text">
        <span class="anaglyph-left">{{ text }}</span>
        <span class="anaglyph-right">{{ text }}</span>
    </div>
</template>

<style scoped>
.anaglyph-text {
    position: relative;
}

.anaglyph-left,
.anaglyph-right {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 80px;
    color: white;
}

.anaglyph-left {
    transform: translateX(-1px);
    filter: drop-shadow(5px 0 0 red);
}

.anaglyph-right {
    transform: translateX(1px);
    filter: drop-shadow(1px 0 0 cyan);
}
</style>

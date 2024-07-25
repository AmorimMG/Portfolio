<script>
export default {
    name: 'NeonCursor',
    mounted() {
        document.addEventListener('mousemove', this.onMouseMove);
    },
    beforeUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
    },
    methods: {
        onMouseMove(e) {
            const cursor = this.$refs.cursor;
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        }
    }
};
</script>

<template>
    <div class="neon-cursor" ref="cursor"></div>
</template>

<style scoped>
.neon-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    background: #0ff;
    border-radius: 50%;
    pointer-events: none;
    transition: transform 0.1s ease-in-out;
    box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 30px #0ff, 0 0 40px #0ff, 0 0 50px #0ff;
    transform: translate(-50%, -50%);
}

.neon-cursor {
    width: 25px;
    height: 25px;
    background: #ff00ff;
    box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff, 0 0 40px #ff00ff, 0 0 50px #ff00ff;
}
</style>

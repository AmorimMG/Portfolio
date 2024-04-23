<script>
export default {
    data() {
        return {
            state: {
                fps: 30,
                color: '#8600ff',
                charset: '0123456789ABCDEF',
                size: 10
            },
            canvas: null,
            ctx: null,
            w: 0,
            h: 0,
            p: []
        };
    },
    mounted() {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', this.resize);

        this.interval = setInterval(this.draw, 1000 / this.state.fps);
    },
    methods: {
        resize() {
            this.w = this.canvas.width = window.innerWidth;
            this.h = this.canvas.height = window.innerHeight;

            this.p = Array(Math.ceil(this.w / this.state.size)).fill(0);
        },
        random(items) {
            return items[Math.floor(Math.random() * items.length)];
        },
        draw() {
            this.ctx.fillStyle = 'rgba(0,0,0,.05)';
            this.ctx.fillRect(0, 0, this.w, this.h);
            this.ctx.fillStyle = this.state.color;

            this.ctx.font = this.state.size + 'px sans-serif';
            for (let i = 0; i < this.p.length; i++) {
                let v = this.p[i];
                this.ctx.fillText(this.random(this.state.charset), i * this.state.size, v);
                this.p[i] = v >= this.h || v >= 10000 * Math.random() ? 0 : v + this.state.size;
            }
        }
    },
    beforeUnmount() {
        clearInterval(this.interval);
        window.removeEventListener('resize', this.resize);
    }
};
</script>

<template>
    <div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<style>
canvas {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -999999;
    pointer-events: none;
    opacity: 0.2;
}
</style>

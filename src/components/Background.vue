<script>
import { watch } from 'vue';
import { getDarkThemeCookie } from '../service/session';

export default {
    props: {
        theme: Boolean
    },
    data() {
        return {
            state: {
                fps: 15,
                color: '#8600ff',
                whiteColor: '#ffffff',
                charset: '0123456789ABCDEF',
                size: 10
            },
            canvas: null,
            ctx: null,
            w: 0,
            h: 0,
            p: [],
            isDarkTheme: false,
            themeCheckInterval: null,
            darkProvide: false
        };
    },
    mounted() {
        this.canvas = this.$refs.canvas;
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', this.resize);

        this.interval = setInterval(this.draw, 1000 / this.state.fps);

        // Carrega de Acordo com o Cookie
        this.isDarkTheme = getDarkThemeCookie();

        // Atualia o Valor utilizando Props
        watch(
            () => this.theme,
            (newVal) => {
                this.isDarkTheme = !newVal;
            }
        );
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
            if (this.isDarkTheme === true) {
                this.ctx.fillStyle = this.state.color;
            } else {
                this.ctx.fillStyle = this.state.whiteColor;
            }

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
        clearInterval(this.themeCheckInterval);
        window.removeEventListener('resize', this.resize);
    },
};
</script>

<template>
    <div>
        <canvas class="canvasD" ref="canvas"></canvas>
    </div>
</template>

<style>
.canvasD {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -999999;
    pointer-events: none;
    opacity: 0.2;
    max-width: -webkit-fill-available;;
}
</style>

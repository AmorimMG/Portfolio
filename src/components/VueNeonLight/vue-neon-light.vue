<script>
// Mudar Futuramente o nome do componente para ValidaFonte, verifica o tema e muda a fonte para o tema.

export default {
    name: 'vue-neon-light',
    props: {
        color: {
            type: String,
            default: '#fff'
        },
        size: {
            type: String
        },
        flash: {
            type: Boolean,
            default: false
        },
        effect: {
            type: String,
            default: 'Neon'
        }
    },
    computed: {
        effectComponent() {
            return `Vue${this.effect.substring(0, 1).toUpperCase() + this.effect.substring(1)}`;
        },
        resolvedColor() {
            return this.color || 'var(--code-color)';
        },
        neonStyle() {
            const color = this.resolvedColor;
            return {
                fontSize: this.size,
                color: color,
                textShadow: `0 0 5px ${color},
                         0 0 10px ${color},
                         0 0 15px ${color},
                         0 0 20px ${color},
                         0 0 25px ${color},
                         0 0 30px ${color},
                         0 0 35px ${color}`
            };
        }
    }
};
</script>

<template>
    <Component :is="effectComponent">
        <span class="neon-text" :style="neonStyle" :class="{ flash: flash }">
            {{ $slots.default?.()[0]?.children }}
        </span>
    </Component>
</template>

<style scoped lang="scss">
@font-face {
    font-family: 'lores-12';
    font-weight: 100 900;
    font-display: swap;
    font-style: normal;
    font-named-instance: 'Regular';

    src: url('/fonts/beon-webfont.ttf') format('truetype');
}

body {
    background: #000;
    margin: 0 auto;
    text-align: center;
    padding: 5em;
}

.neon-text {
    font-family: 'lores-12';
    font-weight: 100 900;
    font-display: swap;
    font-style: normal;

    src: url('/fonts/beon-webfont.ttf') format('truetype');
}

.flash {
    animation: flash 2.5s infinite;
}

@keyframes flash {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.1;
    }
}
</style>

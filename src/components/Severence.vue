<script setup>
import { gsap } from 'gsap';
import Flip from 'gsap/Flip';
import { onMounted } from 'vue';

gsap.registerPlugin(Flip);

onMounted(() => {
    let mouse = { x: 0, y: 0 };
    let cursorPos = { x: 0, y: 0 };
    let totalCompletion = 0;

    const cursor = document.getElementById('cursor');
    const wrap = document.getElementById('wrap');
    const numbers = document.querySelectorAll('.inner');
    const boxes = document.querySelectorAll('.ready');

    // Função de animação suave do cursor
    function updateCursor() {
        if (!cursor) return;

        // Interpolação suave entre a posição atual e a posição do mouse
        cursorPos.x += (mouse.x - cursorPos.x) * 0.2;
        cursorPos.y += (mouse.y - cursorPos.y) * 0.2;

        // Aplica a transformação com translate3d para melhor performance
        cursor.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`;

        // Continua a animação
        requestAnimationFrame(updateCursor);
    }

    // Inicia o loop de animação
    requestAnimationFrame(updateCursor);

    // Atualiza apenas as coordenadas do mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Garante que o cursor está visível desde o início
    if (cursor) {
        cursor.style.opacity = '1';
        cursor.style.transform = 'scale(1)';
    }

    // Distance calculation atualizado
    document.addEventListener('mousemove', (e) => {
        numbers.forEach((num) => {
            const rect = num.getBoundingClientRect();
            const distance = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
            num.style.setProperty('--distance', parseInt(distance));
            num.parentNode.setAttribute('data-distance', parseInt(distance));
        });
    });

    // Inicializa números aleatórios
    numbers.forEach((num) => {
        num.setAttribute('data-number', Math.floor(Math.random() * 10));
    });

    // Inicializa porcentagens das boxes
    boxes.forEach((box) => {
        const percent = Math.floor(Math.random() * 26) + 30;
        box.setAttribute('data-percent', percent);
        box.style.setProperty('--total', `${percent}%`);
        totalCompletion += percent;
    });

    document.getElementById('inner')?.setAttribute('data-completion', `${Math.trunc(totalCompletion / 5)}%`);
    const scene = document.querySelector('.scene');
    scene.classList.add('loaded');

    // Clique nos números
    numbers.forEach((num) => {
        num.addEventListener('click', () => {
            wrap.classList.add('noclick');
            totalCompletion = 0;

            const validBoxes = document.querySelectorAll('.valid');
            const selectedIndex = Math.floor(Math.random() * (validBoxes.length / 2));
            const box = validBoxes[selectedIndex];
            const lowerBox = validBoxes[selectedIndex + validBoxes.length / 2];

            const boxTotal = parseInt(lowerBox.getAttribute('data-percent'));
            const boxMult = Math.floor(Math.random() * 16) + 1;

            lowerBox.classList.add('loaded');

            setTimeout(() => {
                const newTotal = Math.min(boxTotal + boxMult, 100);
                lowerBox.setAttribute('data-percent', newTotal);
                lowerBox.style.setProperty('--total', `${newTotal}%`);

                if (newTotal > 99) {
                    box.classList.remove('valid');
                    lowerBox.classList.remove('valid');
                }

                boxes.forEach((b) => {
                    totalCompletion += parseInt(b.getAttribute('data-percent'));
                });

                if (totalCompletion / 5 >= 99) {
                    scene.classList.add('waffleparty');
                    setTimeout(() => {
                        scene.classList.remove('loaded');
                    }, 2000);
                }

                document.getElementById('inner')?.setAttribute('data-completion', `${Math.trunc(totalCompletion / 5)}%`);
            }, 1000);

            setTimeout(() => {
                wrap.classList.remove('noclick');
            }, 1500);

            // Flip Animation
            numbers.forEach((inner) => {
                if (inner.parentNode.getAttribute('data-distance') < 100) {
                    inner.classList.remove('new');
                    const state = Flip.getState(inner);
                    const parent = inner.parentNode;

                    box.classList.add('open');
                    box.appendChild(inner);

                    Flip.from(state, {
                        duration: 1,
                        ease: 'back.in(1.5)',
                        absolute: true,
                        delay: Math.random() / 3,
                        onComplete: () => {
                            inner.classList.add('new');
                            inner.setAttribute('data-number', Math.floor(Math.random() * 10));
                            parent.appendChild(inner);
                            box.classList.remove('open');
                        }
                    });
                }
            });
        });
    });

    // Waffle party
    const waffleparty = 'waffle party! '.split('');
    let html = '';
    waffleparty.forEach((char, i) => {
        if (char.trim() !== '') {
            html += `<span style="--index:${i}" data-char="${char}">${char}</span>`;
        }
    });
    const waffle = document.getElementById('waffleparty');
    if (waffle) {
        waffle.style.setProperty('--length', waffleparty.length);
        waffle.innerHTML += html;
    }

    // Animação inicial
    gsap.to('.num', {
        duration: 0.5,
        opacity: 1,
        stagger: { amount: 2 }
    });

    gsap.from('.box', {
        delay: 2,
        scale: 0,
        opacity: 0,
        stagger: 0.2,
        ease: 'back'
    });
});
</script>

<template>
    <div class="scene">
        <div id="cursor"></div>
        <div id="header">
            <div id="inner">
                <img src="https://assets.codepen.io/383755/lumon.svg" alt="Lumon Logo" />
            </div>
        </div>
        <div id="wrap">
            <div class="num" v-for="n in 112" :key="n">
                <div class="inner" />
            </div>
        </div>
        <div id="lower">
            <div class="box valid" v-for="n in 5" :key="'valid-' + n">
                <div class="hatch"></div>
            </div>
            <div class="box ready valid" v-for="n in 5" :key="'ready-' + n"></div>
        </div>
        <div id="waffleparty"></div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans&display=swap');

.scene {
    cursor: none;
}

.scene {
    display: grid;
    place-items: center;
    height: 100vh;
    font-family: 'Plus Jakarta Sans';
    --bg: #00203a;
    --g: #24e4f2;
    background: var(--bg);
    $bg: #00203a;
    overflow: hidden;
    --distance: 600;
    transition: 2s ease-in-out 3s;
    filter: brightness(0) blur(2px);
    color: var(--g);
    cursor: none;

    &:active {
        #cursor {
            &:before {
                background: var(--g);
                transition: 0s;
            }
        }
    }

    .inner {
        &.new {
            animation: fadeIn 0.5s ease-in-out 1 forwards 0.5s;
            opacity: 0;

            @keyframes fadeIn {
                to {
                    opacity: 1;
                }
            }
        }

        &:before {
            content: attr(data-number);
            transition: font-size 0.5s ease-in-out;
            transform: translate(-50%, -50%) scale(clamp(0.45, calc(1 + ((70 - var(--distance)) / 175)), 2)) translateZ(0px);
        }
    }

    #cursor {
        pointer-events: none;
        width: 3vmin;
        height: 3vmin;
        position: fixed;
        left: 0;
        top: 0;
        filter: drop-shadow(0 1px 0 var(--g)) drop-shadow(0 -1px 0 var(--g)) drop-shadow(1px 0 0 var(--g)) drop-shadow(-1px 0 0 var(--g)) blur(0.5px);
        transform: scale(0);
        z-index: 999999; // Garante que está acima de tudo
        will-change: transform; // Otimiza a performance das transformações

        &:before {
            content: '';
            position: absolute;
            background: var(--bg);
            clip-path: polygon(1% 0%, 35% 100%, 53% 58%, 100% 48%);
            width: 100%;
            height: 100%;
            transition: background 0.3s ease-in-out;
        }
    }

    &.loaded {
        transition: 2s ease-in-out 0s;
        filter: brightness(1);

        #cursor {
            transform: scale(1);
        }

        &:hover {
            #cursor {
                opacity: 1;
            }
        }

        #header {
            #inner {
                transition: 0.75s ease-in-out 3s;
                transform: translate(0, calc(-50% - 0vmin)) scaleX(1);

                &:before {
                    transform: translateY(-0.15vmin);
                    opacity: 0.75;
                    transition: 1s ease-in-out 3.75s;
                }
            }
        }

        #lower {
            &:after {
                opacity: 1;
                transition: 0.75s ease-in-out 3s;
            }

            .box {
                transform: translateY(0);

                @for $i from 1 through 5 {
                    &:nth-of-type(#{$i}) {
                        &:before {
                            opacity: 1;
                        }
                    }
                }

                @for $i from 5 through 10 {
                    &:nth-of-type(#{$i}) {
                        &:nth-of-type(n + 6) {
                            &:before {
                                clip-path: polygon(0 0, var(--total) 0%, var(--total) 100%, 0% 100%);
                            }

                            &.loaded {
                                &:before {
                                    transition-delay: 0s;
                                }
                            }
                        }
                    }
                }
            }
        }

        img {
            opacity: 1;
            filter: blur(0px);
        }

        #wrap {
            &:before {
                height: calc(100% + 5vmin);
                opacity: 1;
            }

            .num {
                opacity: 1;
            }
        }
    }

    &:before,
    &:after {
        content: '';
        position: absolute;
        width: 112.5%;
        height: 112.5%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) translateZ(0px);
        z-index: 12;
        background: linear-gradient(transparentize($bg, 0.6) 50%, transparentize(darken($bg, 80%), 0.95) 50%), linear-gradient(90deg, transparentize(darken($bg, 80%), 0.99), transparentize(#fff, 0.98), transparentize(darken($bg, 80%), 0.94));
        z-index: 12;
        background-size:
            100% 2px,
            3px 100%;
        pointer-events: none;
        border-radius: 10vmin;
        animation: flicker 3s ease-in-out infinite alternate;

        @keyframes flicker {
            22% {
                opacity: 1;
            }

            25% {
                opacity: 0.75;
            }

            37% {
                opacity: 1;
            }
        }
    }

    &:after {
        animation: none;
        box-shadow:
            inset 0 0 50vmin 5vmin #000,
            0 0 0 50vmin #000;
        opacity: 0.5;
        width: 100%;
        height: 100%;
    }

    #header {
        position: absolute;
        width: 100vmin;
        top: calc(50% - 44vmin);
        display: flex;
        justify-content: flex-end;

        #inner {
            overflow: hidden;
            height: 5.5vmin;
            top: calc(50% - 0.15vmin);
            transform: translate(0, calc(-50% - 0vmin)) scaleX(0);
            transform-origin: right;
            transition: 0.75s ease-in-out 0s;
            z-index: 6;
            position: absolute;
            width: calc(100% - 17.25vmin);
            border: 0.15vmin solid var(--g);
            left: 1.5vmin;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            box-sizing: border-box;
            border-color: var(--g) transparent var(--g) var(--g);

            &:before {
                opacity: 0;
                content: attr(data-completion);
                font-size: 2.75vmin;
                color: var(--bg);
                text-shadow:
                    0 0.2vmin var(--g),
                    0.2vmin 0 var(--g),
                    -0.2vmin 0 var(--g),
                    0 -0.2vmin var(--g);
                font-weight: 900;
                padding-right: 5vmin;
                line-height: 1;
                transform: translateY(20vmin);
                transition: 0.6s ease-in-out;
            }
        }
    }

    img {
        height: 12.5vmin;
        width: auto;
        margin-right: -2.5vmin;
        transition: 1s ease-in-out 2.25s;
        opacity: 0;
        filter: blur(20px);
    }

    #lower {
        position: absolute;
        width: 100vmin;
        height: 15vmin;
        top: calc(50% + 33.5vmin);
        left: 50%;
        transform: translate(-50%, 0);
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-column-gap: 3vmin;
        grid-row-gap: 1vmin;
        padding: 2vmin 2vmin 4vmin;
        box-sizing: border-box;

        &:after {
            content: '0x#{random(1000) + 500} : 0x#{random(1000) + 500}';
            position: absolute;
            width: 100vw;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            bottom: -1vmin;
            font-size: 2vmin;
            border-top: 0.25vmin solid var(--g);
            padding-top: 0.5vmin;
            opacity: 0;
            transition: 0.75s ease-in-out 0s;
        }

        .box {
            position: relative;
            transition:
                transform 1s ease-in-out,
                background-position 3s ease-in-out;
            transform: translateY(50vh);

            &.open {
                .hatch {

                    &:before,
                    &:after {
                        transition-delay: 0s;
                    }

                    &:before {
                        transform: rotate(-135deg);
                    }

                    &:after {
                        transform: rotate(135deg);
                    }
                }
            }

            .hatch {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;

                &:before,
                &:after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0.25vmin;
                    width: calc(50% - 0.25vmin);
                    height: 0.25vmin;
                    background: var(--g);
                    transform-origin: 0% 100%;
                    transition: transform 0.3s ease-in-out 0.5s;
                    box-shadow:
                        0 0.25vmin 0 var(--bg),
                        0 0.5vmin 0 var(--bg),
                        0 0.75vmin 0 var(--bg);
                }

                &:after {
                    left: auto;
                    right: 0.25vmin;
                    transform-origin: 100% 100%;
                }
            }

            &:after {
                content: '';
                position: absolute;
                inset: 0;
                background: var(--bg);
                z-index: -1;
                box-shadow:
                    inset 0.25vmin 0 0 var(--g),
                    inset -0.25vmin 0 0 var(--g),
                    0 0.25vmin 0 0 var(--g);
            }

            .inner {
                position: absolute;
                z-index: -2;
                left: 50%;

                &:before {
                    animation: fontShift 1s ease-in-out 1 forwards;
                    font-size: 7vmin;

                    @keyframes fontShift {
                        to {
                            font-size: 3vmin;
                        }
                    }
                }
            }

            @for $i from 1 through 10 {
                &:nth-of-type(#{$i}) {
                    transition-delay: #{$i/20 + 2}s,
                    #{$i/20 + 3}s;

                    &:before {
                        z-index: 9;
                        content: '0#{$i}';
                        position: absolute;
                        font-size: 3vmin;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        opacity: 0;
                        transition: 1s ease-in-out;
                        transition-delay: #{$i/20 + 3.5}s;
                    }

                    &:nth-of-type(n + 6) {
                        overflow: hidden;

                        .hatch {
                            display: none;
                        }

                        &:before,
                        &:after {
                            box-shadow: inset 0 0 0 0.25vmin var(--g);
                            opacity: 1;
                            width: 100%;
                            height: 100%;
                            background: var(--g);
                            transform: none;
                            display: flex;
                            align-items: center;
                            padding: 0 1vmin;
                            box-sizing: border-box;
                            content: attr(data-percent) '%';
                            top: 0;
                            left: 0;
                            font-size: 2.5vmin;
                            color: var(--bg);
                            z-index: 9;
                        }

                        &:before {
                            clip-path: polygon(0 0, 0% 0%, 0% 100%, 0% 100%);
                        }

                        &:after {
                            background: var(--bg);
                            color: var(--g);
                            z-index: 8;
                        }
                    }
                }
            }
        }
    }

    #wrap {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(2vmin, 1fr));
        grid-gap: 0.5vmin;
        width: 80vmin;
        margin: 5vmin auto;

        .num {
            width: 2vmin;
            height: 2vmin;
            opacity: 0; // necessário para a animação funcionar
            transition: opacity 0.3s ease-in-out;

            .inner {
                width: 100%;
                height: 100%;
            }
        }
    }

    #wrap {
        width: 100vmin;
        height: 65vmin;
        display: grid;
        grid-template-columns: repeat(14, 1fr);
        grid-template-rows: repeat(8, 1fr);
        grid-column-gap: 0px;
        grid-row-gap: 0px;
        position: relative;
        transform: translateY(-2.5vmin);

        &.noclick {
            pointer-events: none;
        }

        &:before {
            content: '';
            position: absolute;
            width: 100vw;
            height: 1vmin;
            top: 50%;
            left: 50%;
            opacity: 0.85;
            transform: translate(-50%, -50%);
            pointer-events: none;
            box-shadow:
                0 0.25vmin 0 var(--g),
                0 1vmin 0 var(--bg),
                0 1.125vmin 0 var(--g),
                0 -0.25vmin 0 var(--g),
                0 -1vmin 0 var(--bg),
                0 -1.125vmin 0 var(--g);
            z-index: 1;
            opacity: 0;
            transition:
                opacity 0.25s ease-in-out 1s,
                height 1s ease-in-out 1.25s;
        }

        .num {
            position: relative;
            opacity: 0;
            transition: opacity 0.5s ease-in-out 3s;
            animation: float 2s ease-in-out infinite alternate;
            --x: -0.25vmin;
            --y: 0vmin;
            transform: translate(calc(var(--x) * 1), calc(var(--y) * 1)) translateZ(0px);

            @keyframes float {
                to {
                    transform: translate(calc(var(--x) * -1), calc(var(--y) * -1)) translateZ(0px);
                }
            }

            @for $i from 1 through 112 {
                &:nth-of-type(#{$i}) {
                    animation-delay: #{$i/-20}s;
                    --x: #{(random(15) - 1) / 20}vmin;

                    &:nth-of-type(even) {
                        --x: 0vmin;
                        --y: #{(random(15) - 1) / 20}vmin;
                    }
                }
            }

            .inner {
                position: absolute;
                width: 50%;
                height: 75%;
                top: 12.5%;
                left: 25%;

                &:before {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    font-size: 7vmin;
                }
            }
        }
    }
}

.scene.waffleparty {
    filter: brightness(1);
    pointer-events: none;

    #waffleparty {
        scale: 0.5;
        --playstate: running;
    }
}

#waffleparty {
    pointer-events: none;
    transition: scale 0.5s ease-in-out 5s;
    scale: 0;
    position: fixed;
    width: 75vmin;
    height: 75vmin;
    z-index: 10;
    --playstate: paused;

    span {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: -1;
        font-size: 15vmin;
        color: transparent;
        animation: bounceIn 0.5s ease-in-out 1 forwards;
        transform-origin: 50% 60vmin;
        transform: translate(-50%, calc(-50% - 50vmin)) rotate(calc((360deg / var(--length)) * var(--index) - 80deg));
        animation: rotateText 20s linear infinite;
        animation-play-state: var(--playstate);

        &:before {
            content: attr(data-char);
            position: absolute;
            color: var(--g);
            display: inline-block;
            animation: wiggle 0.5s ease-in-out infinite alternate calc(var(--index) * 0.05s);
            animation-play-state: var(--playstate);

            @keyframes wiggle {
                from {
                    transform: translateY(-1.5vmin);
                }

                to {
                    transform: translateY(1.5vmin);
                }
            }
        }

        @keyframes rotateText {
            to {
                transform: translate(-50%, calc(-50% - 50vmin)) rotate(calc((360deg / var(--length)) * var(--index) - 440deg));
            }
        }
    }

    &:before,
    &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 100%;
        animation: spin 10s linear infinite;

        @keyframes spin {
            to {
                rotate: 360deg;
            }
        }
    }

    &:before {
        background:
            linear-gradient(to right, transparent calc(50% - 3vmin), var(--g) calc(50% - 3vmin), var(--g) calc(50% + 3vmin), transparent calc(50% + 3vmin)),
            linear-gradient(to bottom, transparent calc(50% - 3vmin), var(--g) calc(50% - 3vmin), var(--g) calc(50% + 3vmin), transparent calc(50% + 3vmin)),
            repeating-linear-gradient(to right, transparent 3vmin, var(--g) 3vmin, var(--g) 6vmin, transparent 6vmin, transparent 12vmin) 1.5vmin 0,
            repeating-linear-gradient(to bottom, var(--bg) 3vmin, var(--g) 3vmin, var(--g) 6vmin, var(--bg) 6vmin, var(--bg) 12vmin) 0 1.5vmin;
        box-shadow: inset 0 0 0 4vmin var(--g);
    }

    &:after {
        background:
            linear-gradient(to right, transparent calc(50% - 1.75vmin), var(--bg) calc(50% - 1.75vmin), var(--bg) calc(50% + 1.75vmin), transparent calc(50% + 1.75vmin)),
            linear-gradient(to bottom, transparent calc(50% - 1.75vmin), var(--bg) calc(50% - 1.75vmin), var(--bg) calc(50% + 1.75vmin), transparent calc(50% + 1.75vmin));
        box-shadow:
            0 0 0 1vmin var(--g),
            inset 0 0 0 1vmin var(--bg);
    }
}
</style>

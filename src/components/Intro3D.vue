<script setup>
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { onMounted, onUnmounted, ref } from 'vue';

gsap.registerPlugin(ScrollTrigger);

const emit = defineEmits(['animation-complete']);

const canvas = ref(null);
const containerRef = ref(null);
const showScrollInstruction = ref(false);

let scene, camera, renderer, model, scrollTriggerInstance;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(-0.5, 0, 4);
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(
        '/threejs/models/sci-fi_computer_room.glb',
        (gltf) => {
            model = gltf.scene;
            scene.add(model);
            setupScrollAnimation();
        },
        undefined,
        (error) => console.error('An error happened', error)
    );

    renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        antialias: true,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Garantir que o canvas não ultrapasse os limites
    canvas.value.style.maxWidth = '100vw';
    canvas.value.style.maxHeight = '100vh';

    animate();
}

function setupScrollAnimation() {
    // Mostrar instrução de scroll após o modelo carregar
    setTimeout(() => {
        showScrollInstruction.value = true;
        
        // Animar a instrução para chamar atenção
        gsap.fromTo('.scroll-instruction', 
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        );
        
        // Fazer a instrução pulsar suavemente
        gsap.to('.scroll-instruction', {
            scale: 1.1,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'power2.inOut'
        });
    }, 1500);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.value,
            start: 'top top',
            end: '+=2000',
            scrub: 1,
            pin: true,
            onStart: () => {
                // Esconder instrução quando começar a scrollar
                showScrollInstruction.value = false;
            },
            onLeave: (self) => {
                gsap.to(containerRef.value, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        emit('animation-complete');
                        self.kill();
                    },
                });
            },
        },
    });

    scrollTriggerInstance = tl.scrollTrigger;

    tl.to(camera.position, {
        x: -0.475,
        y: 0.1,
        z: 0.2,
        duration: 2,
    }).to(
        camera.rotation,
        {
            x: 0,
            y: 0,
            z: 0,
            duration: 2,
        },
        '<'
    );
}

function animate() {
    if (!renderer) return;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    
    // Garantir que o canvas mantenha as dimensões corretas
    canvas.value.style.maxWidth = '100vw';
    canvas.value.style.maxHeight = '100vh';
}

onMounted(() => {
    init();
    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
    }
    gsap.killTweensOf([camera.position, camera.rotation, containerRef.value, '.scroll-instruction']);

    if (renderer) {
        renderer.dispose();
    }

    if (scene) {
        while (scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }
});
</script>

<template>
    <div class="intro-container" ref="containerRef">
        <canvas ref="canvas"></canvas>
        
        <!-- Instrução de scroll -->
        <div 
            v-if="showScrollInstruction" 
            class="scroll-instruction"
        >
            <div class="scroll-text">
                <p>Role para baixo para explorar</p>
                <div class="scroll-icon">
                    <div class="scroll-indicator"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.intro-container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
}

canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    outline: none;
    display: block;
}

/* Prevenir scroll horizontal */
.intro-container * {
    box-sizing: border-box;
}

.scroll-instruction {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    color: white;
    text-align: center;
    pointer-events: none;
}

.scroll-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.scroll-text p {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 300;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: 0.5px;
}

.scroll-icon {
    width: 30px;
    height: 50px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.scroll-indicator {
    width: 4px;
    height: 8px;
    background: white;
    border-radius: 2px;
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    animation: scrollBounce 2s infinite;
}

@keyframes scrollBounce {
    0%, 20% {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateX(-50%) translateY(20px);
        opacity: 0;
    }
}

/* Responsividade para dispositivos móveis */
@media (max-width: 768px) {
    .scroll-instruction {
        bottom: 30px;
    }
    
    .scroll-text p {
        font-size: 1rem;
    }
    
    .scroll-icon {
        width: 25px;
        height: 40px;
    }
}
</style>

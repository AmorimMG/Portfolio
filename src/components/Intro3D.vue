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

    animate();
}

function setupScrollAnimation() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.value,
            start: 'top top',
            end: '+=2000',
            scrub: 1,
            pin: true,
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
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    gsap.killTweensOf([camera.position, camera.rotation, containerRef.value]);

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
    </div>
</template>

<style scoped>
.intro-container {
    width: 100vw;
    height: 100vh;
}

canvas {
    position: fixed;
    top: 0;
    left: 0;
    outline: none;
}
</style>

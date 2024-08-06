<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMounted, onUnmounted, ref } from 'vue';

export default {
    setup() {
        const container = ref(null);
        let characterControls = null;
        const keysPressed = {
            W: false,
            A: false,
            S: false,
            D: false
        };

        onMounted(() => {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            container.value.appendChild(renderer.domElement);

            camera.position.z = 5;

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = false;

            const light = new THREE.AmbientLight(0xffffff);
            scene.add(light);

            const animate = (time) => {
                requestAnimationFrame(animate);
                const delta = time * 0.001; // Convert time to seconds
                if (characterControls) {
                    characterControls.update(delta, keysPressed);
                }
                renderer.render(scene, camera);
            };

            animate();

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });

            const onKeyDown = (event) => {
                keysPressed[event.key.toUpperCase()] = true;
            };

            const onKeyUp = (event) => {
                keysPressed[event.key.toUpperCase()] = false;
            };

            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('keyup', onKeyUp);

            onUnmounted(() => {
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
            });
        });

        return { container };
    }
};
</script>
<template>
    <div ref="container" class="three-container"></div>
</template>

<style scoped>
.three-container {
    width: 100%;
    height: 100vh;
}
</style>

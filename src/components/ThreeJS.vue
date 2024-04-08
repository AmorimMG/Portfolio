<script>
import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

export default {
    mounted() {
        this.initThree();
    },
    methods: {
        initThree() {
            let camera, controls, scene, renderer, effect;
            let sphere, plane;
            const start = Date.now();

            camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);
            camera.position.y = 150;
            camera.position.z = 500;

            scene = new THREE.Scene();

            const pointLight1 = new THREE.PointLight(0xffffff, 3, 0, 0);
            pointLight1.position.set(500, 500, 500);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0xffffff, 1, 0, 0);
            pointLight2.position.set(-500, -500, -500);
            scene.add(pointLight2);

            sphere = new THREE.Mesh(new THREE.SphereGeometry(250, 32, 32), new THREE.MeshPhongMaterial({ flatShading: true }));
            scene.add(sphere);

            plane = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshBasicMaterial({ color: 0xe0e0e0 }));
            plane.position.y = -300; // Adjusted y position to ensure visibility
            plane.rotation.x = -Math.PI / 2;
            scene.add(plane);

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(250, 250);

            effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
            effect.setSize(250, 250);
            effect.domElement.style.color = 'green';
            effect.domElement.style.backgroundColor = 'transparent'; // Set background color to transparent

            document.getElementById('asciiEffect').appendChild(effect.domElement);

            controls = new TrackballControls(camera, effect.domElement);

            window.addEventListener('resize', this.onWindowResize);

            this.animate(start, sphere, controls, effect, scene, camera);
        },
        onWindowResize() {
            const { camera, renderer, effect } = this;
            camera.aspect = 1;
            camera.updateProjectionMatrix();
            renderer.setSize(250, 250);
            effect.setSize(250, 250);
        },
        animate(start, sphere, controls, effect, scene, camera) {
            const animate = () => {
                requestAnimationFrame(animate);
                this.renderScene(start, sphere, controls, effect, scene, camera);
            };
            animate();
        },
        renderScene(start, sphere, controls, effect, scene, camera) {
            const timer = Date.now() - start;
            sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
            sphere.rotation.x = timer * 0.0003;
            sphere.rotation.z = timer * 0.0002;
            controls.update();
            effect.render(scene, camera);
        }
    }
};
</script>

<template>
    <div id="asciiEffect" style="width: 250px; height: 250px"></div>
</template>

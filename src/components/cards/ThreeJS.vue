<script>
import * as THREE from 'three';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import CardEffect from '../CardEffect.vue';

export default {
    mounted() {
        this.initThree();
    },
    components: {
        CardEffect
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

            // Neon shader material
            const neonShader = {
                uniforms: {
                    "c": { value: 1.0 },
                    "p": { value: 1.4 },
                    glowColor: { value: new THREE.Color(0xff00ff) }, // Pink color
                    viewVector: { value: new THREE.Vector3(0, 0, 0) }
                },
                vertexShader: `
                    uniform vec3 viewVector;
                    uniform float c;
                    uniform float p;
                    varying float intensity;
                    void main() {
                        vec3 vNormal = normalize(normalMatrix * normal);
                        vec3 vNormel = normalize(viewVector - (modelViewMatrix * vec4(position, 1.0)).xyz);
                        intensity = pow(c - dot(vNormal, vNormel), p);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 glowColor;
                    varying float intensity;
                    void main() {
                        vec3 glow = glowColor * intensity;
                        gl_FragColor = vec4(glow, 1.0);
                    }
                `,
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                transparent: true
            };

            const neonMaterial = new THREE.ShaderMaterial(neonShader);

            // Create sphere with neon effect
            sphere = new THREE.Mesh(new THREE.SphereGeometry(200, 32, 32), neonMaterial);
            scene.add(sphere);

            plane = new THREE.Mesh(new THREE.PlaneGeometry(800, 800), new THREE.MeshBasicMaterial({ color: 0xe0e0e0 }));
            plane.position.y = -300; // Adjusted y position to ensure visibility
            plane.rotation.x = -Math.PI / 2;
            scene.add(plane);

            renderer = new THREE.WebGLRenderer();
            renderer.setSize(175, 175);

            effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true });
            effect.setSize(175, 175);
            effect.domElement.style.color = 'green';
            effect.domElement.style.backgroundColor = 'transparent'; // Set background color to transparent

            document.getElementById('asciiEffect')?.appendChild(effect.domElement);

            controls = new TrackballControls(camera, effect.domElement);

            // Update viewVector uniform in the render loop
            this.animate(start, sphere, controls, effect, scene, camera, neonMaterial);
        },
        animate(start, sphere, controls, effect, scene, camera, neonMaterial) {
            const animate = () => {
                requestAnimationFrame(animate);
                this.renderScene(start, sphere, controls, effect, scene, camera, neonMaterial);
            };
            animate();
        },
        renderScene(start, sphere, controls, effect, scene, camera, neonMaterial) {
            const timer = Date.now() - start;
            sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
            sphere.rotation.x = timer * 0.0003;
            sphere.rotation.z = timer * 0.0002;

            // Add camera rotation
            const cameraRotationSpeed = 0.001;
            camera.position.x = Math.sin(timer * cameraRotationSpeed) * 500;
            camera.position.z = Math.cos(timer * cameraRotationSpeed) * 500;
            camera.lookAt(scene.position);

            // Update viewVector uniform
            neonMaterial.uniforms.viewVector.value = camera.position;

            controls.update();
            effect.render(scene, camera);
        }
    }
};
</script>

<template>
    <div class="col-4 lg:col-4 xl:col-3">
        <CardEffect>
            <div class="asciiCard card mb-0 flex justify-content-center align-items-center">
                <div id="asciiEffect"></div>
            </div>
        </CardEffect>
    </div>
</template>

<style>
.asciiCard {
    margin: 0;
    padding: 0;
}

#asciiEffect {
    width: 100%;
    height: 100%;
    justify-content: center;
    display: flex;
    align-items: center;
}
</style>

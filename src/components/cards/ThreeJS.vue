<script setup>
import * as THREE from "three";
import { onMounted, onUnmounted, ref, watch } from "vue";
import CardEffect from "../CardEffect.vue";

const container = ref(null);
const isLoading = ref(true);
let scene, camera, renderer, geometry, material, mesh;

const init = () => {
	if (!container.value) {
		console.error("Container not found");
		return;
	}

	const width = container.value.clientWidth;
	const height = container.value.clientHeight;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
	});
	renderer.setSize(width, height);
	renderer.setClearColor(0x000000, 0);
	container.value.appendChild(renderer.domElement);

	geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
	material = new THREE.MeshBasicMaterial({
		color: 0x00ff00,
		wireframe: true,
	});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	camera.position.z = 5;

	// Add neon glow effect
	const glowMaterial = new THREE.ShaderMaterial({
		uniforms: {
			c: { type: "f", value: 0.1 },
			p: { type: "f", value: 1.4 },
			glowColor: { type: "c", value: new THREE.Color(0x00ff00) },
		},
		vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
		fragmentShader: `
      uniform vec3 glowColor;
      uniform float c;
      uniform float p;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(c - dot(vNormal, vec3(0.0, 0.0, 1.0)), p);
        gl_FragColor = vec4(glowColor, intensity);
      }
    `,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true,
	});

	const glowMesh = new THREE.Mesh(geometry, glowMaterial);
	glowMesh.scale.multiplyScalar(1.2);
	scene.add(glowMesh);

	animate();
	isLoading.value = false;
};

const animate = () => {
	if (!renderer || !scene || !camera || !mesh) return;
	requestAnimationFrame(animate);
	// Reduce the rotation speed by decreasing these values
	mesh.rotation.x += 0.002; // Changed from 0.01
	mesh.rotation.y += 0.004; // Changed from 0.02
	renderer.render(scene, camera);
};

const cleanup = () => {
	if (renderer) {
		renderer.dispose();
		renderer.forceContextLoss();
	}
	if (geometry) geometry.dispose();
	if (material) material.dispose();
	if (mesh) mesh.geometry.dispose();

	scene = null;
	camera = null;
	renderer = null;
	geometry = null;
	material = null;
	mesh = null;
};

onMounted(() => {
	const resizeObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			if (entry.contentBoxSize) {
				const width = entry.contentBoxSize[0].inlineSize;
				const height = entry.contentBoxSize[0].blockSize;
				if (width > 0 && height > 0) {
					cleanup();
					init();
				}
			}
		}
	});

	if (container.value) {
		resizeObserver.observe(container.value);
	}
});

onUnmounted(() => {
	cleanup();
});

watch(container, (newValue) => {
	if (newValue) {
		init();
	}
});
</script>

<template>
    <div class="col-4 lg:col-4 xl:col-3 pb-0">
        <CardEffect>
            <div class="neonCard card mb-0 flex justify-content-center align-items-center">
                <div v-if="isLoading" class="loading">Loading...</div>
                <div ref="container" class="three-container"></div>
            </div>
        </CardEffect>
    </div>
</template>

<style scoped>
.neonCard {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.three-container {
  width: 100%;
  height: 100%;
}

.loading {
  color: #00ff00;
  font-size: 1.2em;
}
</style>

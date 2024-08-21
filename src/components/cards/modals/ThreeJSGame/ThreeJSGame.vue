<script setup>
import { KeyDisplay } from './keys';
import { CharacterControls } from './characterControls';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa8def0);

// CAMERA
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 5;
camera.position.x = 0;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// CONTROLS
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.minDistance = 5;
orbitControls.maxDistance = 15;
orbitControls.enablePan = false;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
orbitControls.update();

// FIRST PERSON CONTROLS
const firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
firstPersonControls.enabled = false;
firstPersonControls.movementSpeed = 20;
firstPersonControls.lookSpeed = 5;
firstPersonControls.noFly = true;

firstPersonControls.lookVertical = true;
firstPersonControls.constrainVertical = true;

// LIGHTS
light();

// FLOOR
generateFloor();

// MODEL WITH ANIMATIONS
var characterControls;
new GLTFLoader().load('/src/assets/images/threejs/models/Soldier.glb', function (gltf) {
    const model = gltf.scene;
    model.traverse(function (object) {
        if (object.isMesh) object.castShadow = true;
    });
    scene.add(model);

    const gltfAnimations = gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap = new Map();
    gltfAnimations
        .filter((a) => a.name != 'TPose')
        .forEach((a) => {
            animationsMap.set(a.name, mixer.clipAction(a));
        });

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, firstPersonControls, camera, 'Idle');
});

// CONTROL KEYS
const keysPressed = {};
const keyDisplayQueue = new KeyDisplay();
document.addEventListener(
    'keydown',
    (event) => {
        keyDisplayQueue.down(event.key === ' ' ? 'SPACE' : event.key);
        if (event.shiftKey && characterControls) {
            characterControls.switchRunToggle();
        } else if (event.key.toUpperCase() === 'R' && characterControls) {
            /* characterControls.toggleFirstPersonView(); */
            toggleCharacter();
        } else {
            /* scene.add(characterControls.model); */
            keysPressed[event.key.toLowerCase()] = true;
        }
    },
    false
);

function toggleCharacter() {
    if (characterControls.model) {
        scene.remove(characterControls.model);
    } else {
        scene.add(characterControls.model);
    }
}

document.addEventListener(
    'keyup',
    (event) => {
        keyDisplayQueue.up(event.key === ' ' ? 'SPACE' : event.key);
        keysPressed[event.key.toLowerCase()] = false;
    },
    false
);

// POINTER LOCK
function handlePointerLockChange() {
    if (document.pointerLockElement === renderer.domElement) {
        document.addEventListener('mousemove', onMouseMove);
    } else {
        document.removeEventListener('mousemove', onMouseMove);
    }
}

function onMouseMove(event) {
    if (characterControls && characterControls.firstPersonView) {
        firstPersonControls.update(event.movementX, event.movementY);
    }
}

document.addEventListener('pointerlockchange', handlePointerLockChange);

// ANIMATE
const clock = new THREE.Clock();
function animate() {
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    if (characterControls && characterControls.firstPersonView) {
        firstPersonControls.update(clock.getDelta());
    } else {
        orbitControls.update();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
document.body.appendChild(renderer.domElement);
animate();

// RESIZE HANDLER
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    keyDisplayQueue.updatePosition();
}
window.addEventListener('resize', onWindowResize);

function generateFloor() {
    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    /*  const placeholder = textureLoader.load('/src/assets/images/threejs/textures/placeholder/placeholder.png'); */
    const sandBaseColor = textureLoader.load('/src/assets/images/threejs/textures/sand/Sand 002_COLOR.jpg');
    const sandNormalMap = textureLoader.load('/src/assets/images/threejs/textures/sand/Sand 002_NRM.jpg');
    const sandHeightMap = textureLoader.load('/src/assets/images/threejs/textures/sand/Sand 002_DISP.jpg');
    const sandAmbientOcclusion = textureLoader.load('/src/assets/images/threejs/textures/sand/Sand 002_OCC.jpg');

    const WIDTH = 80;
    const LENGTH = 80;

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial({
        map: sandBaseColor,
        normalMap: sandNormalMap,
        displacementMap: sandHeightMap,
        displacementScale: 0.1,
        aoMap: sandAmbientOcclusion
    });
    wrapAndRepeatTexture(material.map);
    wrapAndRepeatTexture(material.normalMap);
    wrapAndRepeatTexture(material.displacementMap);
    wrapAndRepeatTexture(material.aoMap);
    // const material = new THREE.MeshPhongMaterial({ map: placeholder})

    const floor = new THREE.Mesh(geometry, material);
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
}

function wrapAndRepeatTexture(map) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.x = map.repeat.y = 10;
}

function light() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-60, 100, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    scene.add(dirLight);
    // scene.add( new THREE.CameraHelper(dirLight.shadow.camera))
}
</script>
<template>
    <div>
        <div id="key-display" style="position: absolute; top: 0; left: 0; z-index: 1000"></div>
    </div>
</template>

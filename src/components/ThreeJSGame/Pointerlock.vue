<script setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { onMounted, ref, watchEffect } from 'vue';
import { RESTAPI } from '../../service/api';

import { CharacterControls } from './characterControls';
/* import { KeyDisplay } from '../ThreeJSGame/keys'; */

const blocker = ref(null);
const instructions = ref(null);
const firstPersonContainer = ref(null);
const thirdPersonContainer = ref(null);
let camera, scene, renderer, controls;
const objects = [];
let raycaster;
let moveForward = false,
    moveBackward = false,
    moveLeft = false,
    moveRight = false,
    canJump = false;
let prevTime = performance.now();
let hoveredTotem = null;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const selectedTotem = ref(null);
const instructionsVisible = ref(true);
const speed = ref(400.0);
const toggleRun = ref(false);
const thirdPerson = ref(false);
/* const keyDisplayQueue = new KeyDisplay(); */
let characterModel = null;
var model = null;
const canRender = ref(true);

onMounted(() => {
    addScene();
    createRenderer();
    generateFloor();
    addCameraControls();
    RESTAPI.ProjetoObterTodos()
        .then((response) => {
            createTotems(response.data);
        })
        .catch((error) => {
            console.error('Error fetching totems:', error);
        });
    /*     generateObjects(); */
    watchEffect(() => {
        if (thirdPerson.value) {
            ThirdPerson();
        } else {
            FirstPerson();
        }
    });
});

const addScene = () => {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 750);
    scene.background = new THREE.Color(0x000000);

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 2.5);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = Math.random() * 2000 - 1000; // X
        positions[i + 1] = Math.random() * 2000 - 1000; // Y
        positions[i + 2] = Math.random() * 2000 - 1000; // Z
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
};

function generateFloor() {
    // Create floor geometry
    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    floorGeometry.rotateX(-Math.PI / 2);

    // Displace vertices to simulate craters
    const position = floorGeometry.attributes.position;
    const vertex = new THREE.Vector3();
    const color = new THREE.Color();

    for (let i = 0, l = position.count; i < l; i++) {
        vertex.fromBufferAttribute(position, i);

        // Add random displacement for craters
        const displacement = Math.sin(vertex.x * 0.05) * Math.cos(vertex.z * 0.05) * Math.random() * 5;
        vertex.y += displacement;

        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    // Convert to non-indexed geometry
    floorGeometry = floorGeometry.toNonIndexed();
    const colorsFloor = [];
    for (let i = 0, l = position.count; i < l; i++) {
        color.setHSL(0.6, 0.4, 0.4); // A greyish color for moon surface
        colorsFloor.push(color.r, color.g, color.b);
    }
    floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsFloor, 3));
    const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floor);
}

function addCameraControls() {
    if (!instructions.value || !blocker.value) return;

    console.log('addCameraControls');
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;
    controls = new PointerLockControls(camera, document.body);

    instructions.value.addEventListener('click', () => {
        controls.lock();
    });

    controls.addEventListener('lock', () => {
        if (instructions.value && blocker.value) {
            instructions.value.style.display = 'none';
            blocker.value.style.display = 'none';
            instructionsVisible.value = false;
        }
    });

    controls.addEventListener('unlock', () => {
        if (instructions.value && blocker.value) {
            blocker.value.style.display = 'block';
            instructions.value.style.display = '';
            instructionsVisible.value = true;
        }
    });

    scene.add(controls.getObject());

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setAnimationLoop(animate);
    firstPersonContainer.value.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);
}

/* function generateObjects() {
    // Create objects
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();
    var position = boxGeometry.attributes.position;
    const colorsBox = [];
    for (let i = 0, l = position.count; i < l; i++) {
        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        colorsBox.push(color.r, color.g, color.b);
    }
    boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsBox, 3));
    for (let i = 0; i < 500; i++) {
        const boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: true });
        boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
        box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
        scene.add(box);
        objects.push(box);
    }
}
 */

function switchRunToggle() {
    toggleRun.value = !toggleRun.value;
    if (toggleRun.value) {
        speed.value = 4000.0;
    } else {
        speed.value = 400.0;
    }
}

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'Space':
            if (canJump === true) velocity.y += 350;
            canJump = false;
            break;
        case 'ShiftLeft':
            switchRunToggle();
            break;
        case 'KeyR':
            thirdPerson.value = !thirdPerson.value;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    /*     keyDisplayQueue.updatePosition(); */

    window.addEventListener('resize', onWindowResize);
}

function animate() {
    const time = performance.now();
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;
    const intersections = raycaster.intersectObjects(objects, false);
    const onObject = intersections.length > 0;
    const delta = (time - prevTime) / 1000;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    velocity.y -= 9.8 * 100.0 * delta;
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();
    if (moveForward || moveBackward) velocity.z -= direction.z * speed.value * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speed.value * delta;
    if (onObject === true) {
        velocity.y = Math.max(0, velocity.y);
        canJump = true;
    }
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    controls.getObject().position.y += velocity.y * delta;
    if (controls.getObject().position.y < 10) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
        canJump = true;
    }

    // Raycasting for detecting hovered totem
    raycaster.setFromCamera(new THREE.Vector2(), camera);
    const intersects = raycaster.intersectObjects(objects, false);

    if (intersects.length > 0) {
        const intersected = intersects[0].object;

        if (hoveredTotem !== intersected) {
            if (hoveredTotem) {
                // Reset the scale of the previously hovered totem
                hoveredTotem.scale.set(1, 1, 1);
            }
            // Set the new hovered totem
            hoveredTotem = intersected;

            console.log(intersected);
            // Apply the hover effect (e.g., scale up)
            hoveredTotem.scale.set(1.2, 1.2, 1.2);
        }
    } else if (hoveredTotem) {
        // Reset the scale if no totem is hovered
        hoveredTotem.scale.set(1, 1, 1);
        hoveredTotem = null;
    }

    prevTime = time;
    renderer.render(scene, camera);
}

function createTotems(data) {
    const totems = [];

    data.forEach((item, index) => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set canvas size (match the size of the totem face)
        canvas.width = 512;
        canvas.height = 1024;

        // Draw the content onto the canvas
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(item.title, canvas.width / 2, 50);
        context.font = '20px Arial';
        context.fillText(item.subtitle, canvas.width / 2, 100);
        context.font = '16px Arial';
        context.fillText(item.description, canvas.width / 2, 150);

        // Load the image
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Ensure cross-origin images are handled
        img.src = item.img;
        img.onload = () => {
            // Draw the image on the canvas after it's loaded
            context.drawImage(img, 0, 200, canvas.width, canvas.height - 200);
            const texture = new THREE.CanvasTexture(canvas);

            // Create totem geometry and material
            const geometry = new THREE.BoxGeometry(10, 20, 10);
            const material = new THREE.MeshBasicMaterial({ map: texture });
            const totem = new THREE.Mesh(geometry, material);

            // Position the totem
            totem.position.set(index * 30 - 30, 10, 30); // Adjust positions as needed

            // Store the link in the totem's userData
            totem.userData.link = item.link;

            // Add the totem to the scene and the array
            scene.add(totem);
            totems.push(totem);
        };
    });

    return totems;
}

function onDocumentClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.camera = camera;
    raycaster.ray = new THREE.Ray(camera.position, new THREE.Vector3(mouse.x, mouse.y, 1).unproject(camera).sub(camera.position).normalize());

    const intersects = raycaster.intersectObjects(scene.children);

    for (const intersect of intersects) {
        if (intersect.object.userData.link) {
            instructions.value.style.display = 'none';
            blocker.value.style.display = 'none';
            if (!instructionsVisible.value) {
                window.open(intersect.object.userData.link, '_blank');
                selectedTotem.value = intersect.object.userData.info;
                break;
            }
        } else {
            selectedTotem.value = null;
        }
    }
}

function FirstPerson() {
    if (characterModel) {
        /* characterModel.visible = false; */
    }
    document.addEventListener('click', onDocumentClick);
}

function ThirdPerson() {
    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 5;
    camera.position.z = 5;
    camera.position.x = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // CONTROLS
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 15;
    orbitControls.enablePan = false;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    orbitControls.update();

    // MODEL WITH ANIMATIONS
    var characterControls;
    if (canRender.value === true) {
        new GLTFLoader().load('/src/assets/images/threejs/models/Soldier.glb', (gltf) => {
            model = gltf.scene;
            model.traverse((object) => {
                if (object.isMesh) object.castShadow = true;
            });
            scene.add(model);
            canRender.value = false;

            characterModel = model; // Store the reference to the character model
            const gltfAnimations = gltf.animations;
            const mixer = new THREE.AnimationMixer(model);
            const animationsMap = new Map();
            gltfAnimations
                .filter((a) => a.name != 'TPose')
                .forEach((a) => {
                    animationsMap.set(a.name, mixer.clipAction(a));
                });

            characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera, 'Idle');
        });
    } else {
        characterModel.visible = true;
    }
    // CONTROL KEYS
    const keysPressed = {};
    document.addEventListener(
        'keydown',
        (event) => {
            /* keyDisplayQueue.down(event.key === ' ' ? 'SPACE' : event.key); */
            if (event.shiftKey && characterControls) {
                characterControls.switchRunToggle();
            } else {
                keysPressed[event.key.toLowerCase()] = true;
            }
        },
        false
    );

    document.addEventListener(
        'keyup',
        (event) => {
            /*     keyDisplayQueue.up(event.key === ' ' ? 'SPACE' : event.key); */
            keysPressed[event.key.toLowerCase()] = false;
        },
        false
    );

    // ANIMATE
    const clock = new THREE.Clock();
    function animateThirdPerson() {
        const mixerUpdateDelta = clock.getDelta();
        if (characterControls) {
            characterControls.update(mixerUpdateDelta, keysPressed);
        } else {
            orbitControls.update();
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animateThirdPerson);
    }

    animateThirdPerson();
}
</script>

<template>
    <div style="overflow-y: hidden">
        <!-- Primeira Pessoa -->
        <div>
            <div ref="blocker" class="blocker">
                <div ref="instructions" class="instructions">
                    <p style="font-size: 12px; color: red">------- in Developement -------</p>
                    <p style="font-size: 36px">Click to play</p>
                    <p>Move: WASD<br />Jump: SPACE<br />Look: MOUSE<br />Run: Shift<br />Change POV: R (not working)</p>

                    <p style="font-size: 12px; color: red">------- in Developement -------</p>
                </div>
            </div>
            <div ref="firstPersonContainer"></div>
            <div ref="thirdPersonContainer"></div>
            <div class="info-overlay">
                <i class="pi pi-bolt" v-if="toggleRun"></i><br v-if="toggleRun" />
                <i class="pi pi-users" v-if="thirdPerson"></i>
                <i class="pi pi-user" v-if="!thirdPerson"></i>
            </div>
            <div v-if="selectedTotem" class="info-overlay">
                <h2>{{ selectedTotem.title }}</h2>
                <h3>{{ selectedTotem.subtitle }}</h3>
                <p>{{ selectedTotem.description }}</p>
            </div>
            <div id="key-display" style="position: absolute; top: 0; left: 0; z-index: 1000"></div>
        </div>
    </div>
</template>

<style scoped>
.blocker {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.instructions {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    color: white;
}

.info-overlay {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    font-size: 2rem;
}
</style>

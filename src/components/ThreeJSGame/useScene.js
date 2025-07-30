import * as THREE from "three";
import { ref } from "vue";

export function useScene() {
  const scene = ref(null);

  function createScene() {
    scene.value = new THREE.Scene();
    scene.value.fog = new THREE.Fog(0xffffff, 0, 750);
    scene.value.background = new THREE.Color(0x87ceeb); // Sky blue for better visibility

    // Add hemisphere light
    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    light.position.set(0.5, 1, 0.75);
    scene.value.add(light);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1, 1, 1);
    scene.value.add(directionalLight);

    // Add a simple test cube to verify rendering
    const testGeometry = new THREE.BoxGeometry(10, 10, 10);
    const testMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const testCube = new THREE.Mesh(testGeometry, testMaterial);
    testCube.position.set(0, 20, -30);
    scene.value.add(testCube);

    // Add stars
    addStars();

    return scene.value;
  }

  function addStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.8,
    });

    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = Math.random() * 2000 - 1000; // X
      positions[i + 1] = Math.random() * 2000 - 1000; // Y
      positions[i + 2] = Math.random() * 2000 - 1000; // Z
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.value.add(stars);
  }

  function generateFloor() {
    if (!scene.value) return;

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
      const displacement =
        Math.sin(vertex.x * 0.05) *
        Math.cos(vertex.z * 0.05) *
        Math.random() *
        5;
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
    floorGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorsFloor, 3)
    );
    const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.value.add(floor);
  }

  function addToScene(object) {
    if (scene.value) {
      scene.value.add(object);
    }
  }

  function removeFromScene(object) {
    if (scene.value) {
      scene.value.remove(object);
    }
  }

  return {
    scene,
    createScene,
    generateFloor,
    addToScene,
    removeFromScene,
  };
}

import * as THREE from 'three';
import { A, D, S, W } from './keys';

export class CharacterControls {
    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;
        this.orbitControl = orbitControl;
        this.camera = camera;

        this.toggleRun = true;
        this.firstPersonView = false;
        this.walkDirection = new THREE.Vector3();
        this.rotateAngle = new THREE.Vector3(0, 1, 0);
        this.rotateQuaternion = new THREE.Quaternion();
        this.cameraTarget = new THREE.Vector3();

        this.fadeDuration = 0.2;
        this.runVelocity = 5;
        this.walkVelocity = 2;

        this.animationsMap.forEach((value, key) => {
            if (key === currentAction) {
                value.play();
            }
        });
        this.updateCameraTarget(0, 0);
    }

    switchRunToggle() {
        this.toggleRun = !this.toggleRun;
    }

    toggleFirstPersonView() {
        /*         this.firstPersonView = !this.firstPersonView;
        if (this.firstPersonView) {
            this.firstPersonControl.enabled = true;
            this.orbitControl.enabled = false;
        } else {
            this.firstPersonControl.enabled = false;
            this.orbitControl.enabled = true;
            document.exitPointerLock();
        } */
    }

    directionPressed(keysPressed) {
        return keysPressed['w'] || keysPressed['a'] || keysPressed['s'] || keysPressed['d'];
    }

    playAnimation(play) {
        const prevAction = this.animationsMap.get(this.currentAction);
        const nextAction = this.animationsMap.get(play);

        if (prevAction !== nextAction) {
            prevAction.fadeOut(this.fadeDuration);
            nextAction.reset().fadeIn(this.fadeDuration).play();
            this.currentAction = play;
        }
    }

    update(delta, keysPressed) {
        if (!this.model || !this.mixer) return;

        this.mixer.update(delta);
        const directionPressed = this.directionPressed(keysPressed);

        var play = 'Idle';
        if (directionPressed && this.toggleRun) {
            play = 'Run';
        } else if (directionPressed) {
            play = 'Walk';
        }

        this.playAnimation(play);

        if (directionPressed) {
            // Get camera direction
            const cameraDirection = new THREE.Vector3();
            this.camera.getWorldDirection(cameraDirection);
            cameraDirection.y = 0;
            cameraDirection.normalize();

            // Calculate movement direction
            const moveDirection = new THREE.Vector3();

            if (keysPressed['w']) moveDirection.add(cameraDirection);
            if (keysPressed['s']) moveDirection.sub(cameraDirection);
            if (keysPressed['a']) moveDirection.add(cameraDirection.clone().cross(new THREE.Vector3(0, 1, 0)));
            if (keysPressed['d']) moveDirection.sub(cameraDirection.clone().cross(new THREE.Vector3(0, 1, 0)));

            moveDirection.normalize();

            // Move model
            const velocity = this.toggleRun ? this.runVelocity : this.walkVelocity;
            const moveX = moveDirection.x * velocity * delta;
            const moveZ = moveDirection.z * velocity * delta;

            this.model.position.x += moveX;
            this.model.position.z += moveZ;

            // Rotate model to face movement direction
            if (moveDirection.length() > 0) {
                const targetRotation = Math.atan2(moveDirection.x, moveDirection.z);
                const currentRotation = this.model.rotation.y;

                // Calculate shortest rotation
                let rotationDiff = targetRotation - currentRotation;
                while (rotationDiff > Math.PI) rotationDiff -= Math.PI * 2;
                while (rotationDiff < -Math.PI) rotationDiff += Math.PI * 2;

                // Smooth rotation
                this.model.rotation.y += rotationDiff * 0.15;
            }

            // Update camera target
            this.orbitControl.target.copy(this.model.position);
            this.orbitControl.target.y += 1;
        }

        // Always update controls
        this.orbitControl.update();
    }

    handleMouseMove(movementX, movementY) {
        /* this.updateCameraTarget(movementX, movementY); */
    }

    updateCameraTarget(moveX, moveZ) {
        this.camera.position.x += moveX;
        this.camera.position.z += moveZ;

        this.cameraTarget.x = this.model.position.x;
        this.cameraTarget.y = this.model.position.y + 1;
        this.cameraTarget.z = this.model.position.z;
        this.orbitControl.target = this.cameraTarget;
    }

    directionOffset(keysPressed) {
        let directionOffset = 0; // w

        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4; // w+a
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4; // w+d
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
            } else {
                directionOffset = Math.PI; // s
            }
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2; // a
        } else if (keysPressed[D]) {
            directionOffset = -Math.PI / 2; // d
        }

        return directionOffset;
    }
}

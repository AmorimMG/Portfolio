import * as THREE from 'three';

export class CharacterControls {    constructor(model, mixer, animationsMap, orbitControls, camera, currentAction, speed) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;
        this.orbitControls = orbitControls;
        this.camera = camera;
        this.speed = speed;

        this.walkDirection = new THREE.Vector3();
        this.rotateAngle = new THREE.Vector3(0, 1, 0);
        this.rotateQuarternion = new THREE.Quaternion();
        this.isRunning = false;
        
        // Adicionar variáveis para pulo e gravidade
        this.velocity = new THREE.Vector3();
        this.canJump = true;
        this.jumpForce = 350;
        this.gravity = 9.8 * 100.0;

        // Configurar a câmera para ser mais livre
        this.orbitControls.maxDistance = Infinity;
        this.orbitControls.minDistance = 0;
        this.orbitControls.maxPolarAngle = Math.PI; // Permite rotação completa

        // Starting animation
        this.fadeToAction(this.currentAction);
    }

    fadeToAction(actionName) {
        const previousAction = this.animationsMap.get(this.currentAction);
        const newAction = this.animationsMap.get(actionName);

        if (previousAction !== newAction) {
            previousAction?.fadeOut(0.2);
            newAction?.reset().fadeIn(0.2).play();
            this.currentAction = actionName;
        }
    }    update(delta, keysPressed) {
        const directionPressed = ['w', 'a', 's', 'd'].some((key) => keysPressed[key]);

        // Atualizar física do pulo
        this.velocity.y -= this.gravity * delta;
        this.model.position.y += this.velocity.y * delta;

        // Verificar colisão com o chão
        if (this.model.position.y < 0) {
            this.velocity.y = 0;
            this.model.position.y = 0;
            this.canJump = true;
        }

        // Processar pulo
        if (keysPressed[' '] && this.canJump) {
            this.velocity.y = this.jumpForce;
            this.canJump = false;
        }

        // Atualizar animação
        let play = '';
        if (directionPressed) {
            play = this.isRunning ? 'Run' : 'Walk';
        } else {
            play = 'Idle';
        }
        this.fadeToAction(play);

        if (directionPressed) {
            // Calculate movement direction
            this.walkDirection.x = (keysPressed['a'] ? 1 : 0) + (keysPressed['d'] ? -1 : 0);
            this.walkDirection.z = (keysPressed['w'] ? 1 : 0) + (keysPressed['s'] ? -1 : 0);
            this.walkDirection.normalize();

            // Rotate model
            const angleYCameraDirection = Math.atan2(this.camera.position.x - this.model.position.x, this.camera.position.z - this.model.position.z);
            const newDirectionOffset = this.directionOffset(keysPressed);
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + newDirectionOffset);
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);            // Move model
            const baseSpeed = this.speed?.value || 1200.0; // Use global speed or fallback to default
            const currentSpeed = this.isRunning ? baseSpeed * 10 : baseSpeed;
            const moveX = this.walkDirection.x * currentSpeed * delta * 0.01; // Ajuste do fator de escala
            const moveZ = this.walkDirection.z * currentSpeed * delta * 0.01;
            this.model.position.x += moveX;
            this.model.position.z += moveZ;            // Update camera target and position
            const targetY = this.model.position.y + 15;
            const smoothFactor = 0.1;

            // Atualizar posição do alvo da câmera
            this.orbitControls.target.lerp(new THREE.Vector3(
                this.model.position.x,
                targetY,
                this.model.position.z
            ), smoothFactor);

            // Calcular a posição desejada da câmera baseada na posição atual do personagem
            const cameraOffset = new THREE.Vector3(
                this.camera.position.x - this.orbitControls.target.x,
                this.camera.position.y - this.orbitControls.target.y,
                this.camera.position.z - this.orbitControls.target.z
            );

            // Aplicar o offset à nova posição do personagem
            const newCameraPosition = new THREE.Vector3(
                this.model.position.x + cameraOffset.x,
                targetY + cameraOffset.y,
                this.model.position.z + cameraOffset.z
            );

            // Mover a câmera suavemente para a nova posição
            this.camera.position.lerp(newCameraPosition, smoothFactor);
        }

        this.mixer.update(delta);
    }

    toggleRun(running) {
        this.isRunning = running;
    }

    directionOffset(keysPressed) {
        let directionOffset = 0;

        if (keysPressed['w']) {
            if (keysPressed['a']) directionOffset = Math.PI / 4;
            else if (keysPressed['d']) directionOffset = -Math.PI / 4;
        } else if (keysPressed['s']) {
            if (keysPressed['a']) directionOffset = Math.PI / 4 + Math.PI / 2;
            else if (keysPressed['d']) directionOffset = -Math.PI / 4 - Math.PI / 2;
            else directionOffset = Math.PI;
        } else if (keysPressed['a']) {
            directionOffset = Math.PI / 2;
        } else if (keysPressed['d']) {
            directionOffset = -Math.PI / 2;
        }

        return directionOffset;
    }
}

import Phaser from 'phaser';
import tiles from '../../../assets/images/rpg/tiles.jpg';
import character from '../../../assets/images/rpg/character.png';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('tiles', tiles);
        this.load.spritesheet('character', character, { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.createScenario();
        this.createCharacter();
        this.createBlockedPaths();
        this.createAnimations();

        // Enable arrow keys or WASD input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    createCharacter() {
        this.character = this.physics.add.sprite(448, 500, 'character'); //starting point
        this.character.setDepth(1);
        this.character.setCollideWorldBounds(true);
    }

    createScenario() {
        this.add.image(200, 200, tiles);
    }

    createBlockedPaths() {
        const blockedPaths = this.physics.add.staticGroup();

        /* const blockPath =  */ blockedPaths.create(200, 200, 'tiles').setImmovable(true);
        /*         blockPath.setTint(0xff0000);  */

        this.physics.add.collider(this.character, blockedPaths);
    }

    createAnimations() {
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('character', { start: 11, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('character', { start: 11, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('character', { start: 11, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('character', { start: 11, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'character', frame: 11 }],
            frameRate: 10
        });
    }

    update() {
        const speed = 200;
        this.character.setVelocity(0);

        if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.character.setVelocityX(-speed);
            this.character.anims.play('walk-left', true);
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
            this.character.setVelocityX(speed);
            this.character.anims.play('walk-right', true);
        } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.character.setVelocityY(-speed);
            this.character.anims.play('walk-up', true);
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.character.setVelocityY(speed);
            this.character.anims.play('walk-down', true);
        } else {
            this.character.anims.play('idle', true);
        }
    }
}

export default GameScene;

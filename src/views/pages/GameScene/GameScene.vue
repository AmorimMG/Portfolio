<script>
import Phaser from 'phaser';
import GameScene from './GameScene.js';

export default {
    name: 'GameComponent',
    mounted() {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 }
                }
            },
            scene: GameScene
        };

        this.game = new Phaser.Game(config);
    }
};
</script>

<template>
    <div id="game-container"></div>
</template>

<style>
#game-container {
    width: 100%;
    height: 100%;
}
</style>

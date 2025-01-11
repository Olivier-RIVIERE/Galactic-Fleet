import MainScene from "./mainScene.js";
import GameOverScene from "./gameOverScene.js";
import PauseScene from "./pauseScene.js";

const config = {
  width: window.innerWidth,
  height: window.innerHeight,
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
    },
  },
  scene: [MainScene, GameOverScene, PauseScene],
};

let game = new Phaser.Game(config);


// gameOverScene.js
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.score = data.score; // On passe le score depuis la scène principale
  }

  create() {
    // Affiche un message de Game Over
    const gameOverText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'GAME OVER', {
      fontSize: '64px',
      fill: '#ff0000',
      fontStyle: 'bold'
    });
    gameOverText.setOrigin(0.5, 0.5);

    // Affiche un message selon le score
    if (this.score <= 0) {
      this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 100, 'Vous avez perdu!', {
        fontSize: '32px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5, 0.5);
    }

    // Créer le bouton de redémarrage
    const continueButton = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 200, 'playButton').setInteractive();

    continueButton.on('pointerdown', () => {
      this.scene.start('MainScene');  // Re-démarre la scène principale
    });
  }
}
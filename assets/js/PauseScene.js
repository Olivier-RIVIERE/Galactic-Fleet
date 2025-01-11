export default class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    const pauseText = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 50, 'PAUSE', {
      fontSize: '64px',
      fill: '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0.5);

    const resumeButton = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + 50, 'playButton').setInteractive();
    resumeButton.on('pointerdown', () => {
      this.scene.stop(); 
      this.scene.resume('MainScene');  
      this.scene.get('MainScene').resumeGame(); 
    });
  }
}

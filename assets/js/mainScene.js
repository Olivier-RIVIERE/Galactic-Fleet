export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    this.load.image("bg", "assets/img/bg.png");
    this.load.image("logo", "assets/img/fusee.png");
    this.load.image("logoRandom", "assets/img/random.png");
    this.load.image("missile", "assets/img/misile.png");
    this.load.image("pauseButton", "assets/img/pause.png");
    this.load.image("playButton", "assets/img/play.png");
    this.load.audio('bgSon', 'assets/audio/bgSon.mp3');
    this.load.audio('shootSound', 'assets/audio/shootSound.mp3');
    this.load.audio('destroySound', 'assets/audio/explosion.mp3');
    this.load.spritesheet('explosion', 'assets/img/anim.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Score: " + this.score, { fontSize: '32px', fill: '#fff' });

    this.background = this.add.tileSprite(0, 0, this.sys.game.config.width, this.sys.game.config.height, 'bg').setOrigin(0, 0);
    this.backgroundMusic = this.sound.add('bgSon');
    this.backgroundMusic.play({ loop: true, volume: 0.5 });

    this.player = this.physics.add.sprite(100, this.sys.game.config.height / 2, "logo").setCollideWorldBounds(true);
    this.player.setDisplaySize(this.sys.game.config.width * 0.1, this.sys.game.config.height * 0.08);
    this.player.setRotation(Phaser.Math.DegToRad(90));

    // Créer le bouton pause
    this.pauseButton = this.add.sprite(this.sys.game.config.width - 100, 50, 'pauseButton').setInteractive();
    this.pauseButton.on('pointerdown', this.pauseGame, this);

    // Groupes de missiles et ennemis
    this.missiles = this.physics.add.group();
    this.enemies = this.physics.add.group();

    this.cursor = this.input.keyboard.createCursorKeys();
    this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.physics.add.overlap(this.missiles, this.enemies, this.destroyEnemy, null, this);

    this.time.addEvent({ delay: 2000, callback: this.spawnEnemy, callbackScope: this, loop: true });

    // Création de l'animation d'explosion
    this.anims.create({
      key: 'explosionAnim',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 8 }),
      frameRate: 10,
      repeat: 0
    });
  }

  update() {
    this.background.tilePositionX += 1;
    this.player.setVelocity(0);

    if (this.cursor.up.isDown) {
      this.player.setVelocityY(-300);
    } else if (this.cursor.down.isDown) {
      this.player.setVelocityY(300);
    }

    if (this.cursor.right.isDown) {
      this.player.setVelocityX(300);
    } else if (this.cursor.left.isDown) {
      this.player.setVelocityX(-300);
    }

    this.enemies.getChildren().forEach((enemy) => {
      if (enemy.x < 0 && enemy.onScreen) {
        enemy.onScreen = false;
        this.score -= 10;
        this.scoreText.setText('Score: ' + this.score);
        enemy.destroy();
      }
    });

    if (this.score <= -10) {
      this.gameOver();
    }

    if (Phaser.Input.Keyboard.JustDown(this.shootKey)) {
      this.shootMissile();
    }
  }

  gameOver() {
    this.backgroundMusic.stop();
    this.scene.start('GameOverScene', { score: this.score });
  }

  shootMissile() {
    const missile = this.missiles.create(this.player.x, this.player.y, 'missile');
    missile.body.setAllowGravity(false);
    missile.setRotation(Phaser.Math.DegToRad(180));
    missile.setScale(0.05);
    missile.setVelocityX(300);
    this.sound.play('shootSound');
  }

  spawnEnemy() {
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    const randomY = Phaser.Math.Between(50, gameHeight - 50);
    const enemy = this.enemies.create(gameWidth + 50, randomY, "logoRandom");
    enemy.setDisplaySize(80, 80);
    enemy.body.setVelocityX(-100);
    enemy.body.setAllowGravity(false);
    enemy.setRotation(Phaser.Math.DegToRad(-90));
    enemy.onScreen = true;

    this.time.addEvent({
      delay: 30000,
      callback: () => {
        if (enemy.onScreen) {
          enemy.onScreen = false;
          enemy.destroy();
        }
      },
    });
  }

  destroyEnemy(missile, enemy) {
    missile.destroy();
    enemy.destroy();
    this.sound.play('destroySound');
    const explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');
    explosion.play('explosionAnim');
    explosion.on('animationcomplete', () => {
      explosion.destroy();
    });
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
  }

  pauseGame() {
    this.backgroundMusic.stop();  
    this.scene.pause('MainScene');  
    this.scene.launch('PauseScene');  
    this.pauseButton.setVisible(false); 
  }

  resumeGame() {
    this.backgroundMusic.play({ loop: true, volume: 0.5 }); 
    this.pauseButton.setVisible(true);  
  }
}

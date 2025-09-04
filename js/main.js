// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: GameConfig.GAME_WIDTH,
    height: GameConfig.GAME_HEIGHT,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [TitleScene, GameScene, LevelCompleteScene, VictoryScene]
};

// Create the game
const game = new Phaser.Game(config);
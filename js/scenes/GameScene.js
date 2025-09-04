class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.currentLevel = data.level || 1;
        this.score = data.score || 0;
        this.playerHealth = data.health || GameConfig.PLAYER_HEALTH;
    }
    
    preload() {
        // Load assets
        this.load.spritesheet('wizard', 'assets/sprites/wizard.png', {
            frameWidth: 64,
            frameHeight: 64
        });
        
        this.load.image('slime', 'assets/sprites/enemies/slime.png');
        this.load.image('mushroom', 'assets/sprites/enemies/mushroom.png');
        this.load.image('bat', 'assets/sprites/enemies/bat.png');
        this.load.image('golem', 'assets/sprites/enemies/golem.png');
        this.load.image('malathor', 'assets/sprites/enemies/malathor.png');
        
        this.load.image('platform', 'assets/sprites/platform.png');
        this.load.image('portal', 'assets/sprites/portal.png');
        this.load.image('gem', 'assets/sprites/gem.png');
        
        // Load audio
        this.load.audio('bgMusic', 'assets/audio/music/level.mp3');
        this.load.audio('jump', 'assets/audio/sfx/jump.wav');
        this.load.audio('spell', 'assets/audio/sfx/spell.wav');
        this.load.audio('collect', 'assets/audio/sfx/collect.wav');
        this.load.audio('defeat', 'assets/audio/sfx/defeat.wav');
    }
    
    create() {
        // Get level config
        this.levelConfig = GameConfig.LEVELS[this.currentLevel - 1];
        
        // Create level
        this.levelManager = new LevelManager(this);
        this.levelManager.createLevel(this.levelConfig);
        
        // Create player
        this.player = new Player(this, 100, 400);
        
        // Create enemies
        this.enemies = this.physics.add.group();
        this.levelManager.createEnemies(this.levelConfig.enemies);
        
        // Create battle manager
        this.battleManager = new BattleManager(this);
        
        // Set up collisions
        this.setupCollisions();
        
        // Create HUD
        this.createHUD();
        
        // Start music
        this.bgMusic = this.sound.add('bgMusic', { loop: true, volume: 0.5 });
        this.bgMusic.play();
        
        // Camera setup
        this.cameras.main.setBounds(0, 0, GameConfig.WORLD_WIDTH, GameConfig.GAME_HEIGHT);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }
    
    update() {
        this.player.update();
        
        this.enemies.children.entries.forEach(enemy => {
            enemy.update();
        });
    }
    
    setupCollisions() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.portal, this.enterPortal, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    }
    
    createHUD() {
        // HUD implementation
        this.add.rectangle(600, 30, 1150, 60, 0x000000, 0.7)
            .setScrollFactor(0);
        
        this.scoreText = this.add.text(600, 30, `Score: ${this.score}`, {
            fontFamily: 'MedievalSharp',
            fontSize: '24px',
            color: '#FFD700'
        }).setOrigin(0.5).setScrollFactor(0);
    }
    
    enemyDefeated(enemy) {
        this.score += enemy.points;
        this.scoreText.setText(`Score: ${this.score}`);
        this.sound.play('defeat');
    }
    
    enterPortal() {
        if (this.levelManager.canEnterPortal()) {
            this.scene.start('LevelCompleteScene', {
                level: this.currentLevel,
                score: this.score,
                health: this.player.health
            });
        }
    }
}
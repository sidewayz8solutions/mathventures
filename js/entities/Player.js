class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'wizard');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        
        this.health = GameConfig.PLAYER_HEALTH;
        this.mana = 3;
        this.facing = 'right';
        
        this.createAnimations();
        this.createControls();
    }
    
    createAnimations() {
        // Create sprite animations
        this.scene.anims.create({
            key: 'wizard-idle',
            frames: this.scene.anims.generateFrameNumbers('wizard', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        
        this.scene.anims.create({
            key: 'wizard-walk',
            frames: this.scene.anims.generateFrameNumbers('wizard', { start: 4, end: 11 }),
            frameRate: 12,
            repeat: -1
        });
        
        this.scene.anims.create({
            key: 'wizard-jump',
            frames: this.scene.anims.generateFrameNumbers('wizard', { start: 12, end: 13 }),
            frameRate: 8
        });
        
        this.scene.anims.create({
            key: 'wizard-cast',
            frames: this.scene.anims.generateFrameNumbers('wizard', { start: 14, end: 17 }),
            frameRate: 10
        });
    }
    
    createControls() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.spaceKey = this.scene.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );
    }
    
    update() {
        // Movement logic
        if (this.cursors.left.isDown) {
            this.setVelocityX(-GameConfig.PLAYER_SPEED);
            this.setFlipX(true);
            this.play('wizard-walk', true);
            this.facing = 'left';
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(GameConfig.PLAYER_SPEED);
            this.setFlipX(false);
            this.play('wizard-walk', true);
            this.facing = 'right';
        } else {
            this.setVelocityX(0);
            this.play('wizard-idle', true);
        }
        
        // Jump
        if (this.cursors.up.isDown && this.body.touching.down) {
            this.setVelocityY(-GameConfig.PLAYER_JUMP);
            this.play('wizard-jump', true);
            this.scene.createJumpParticles(this.x, this.y);
        }
        
        // Cast spell
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.mana > 0) {
            this.castSpell();
        }
    }
    
    castSpell() {
        this.play('wizard-cast');
        this.mana--;
        
        const spell = new Projectile(
            this.scene,
            this.x + (this.facing === 'right' ? 30 : -30),
            this.y,
            this.facing
        );
        
        this.scene.projectiles.add(spell);
        this.scene.updateManaDisplay();
    }
    
    takeDamage(amount = 1) {
        this.health -= amount;
        this.scene.cameras.main.shake(200, 0.01);
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        this.play('wizard-death');
        this.scene.gameOver();
    }
}
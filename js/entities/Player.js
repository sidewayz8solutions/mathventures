class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'wizard');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.setScale(1.5);
        
        this.health = GameConfig.PLAYER_HEALTH;
        this.maxHealth = GameConfig.PLAYER_HEALTH;
        this.mana = GameConfig.PLAYER_MANA;
        this.maxMana = GameConfig.PLAYER_MANA;
        this.facing = 'right';
        this.invulnerable = false;
        this.powerUpActive = false;
        this.canDoubleJump = false;
        this.hasDoubleJumped = false;
        this.speedMultiplier = 1;
        
        this.createAnimations();
        this.createControls();
        this.createAura();
        this.createMagicTrail();
    }
    
    createAura() {
        this.aura = this.scene.add.circle(this.x, this.y, 40, 0x00FFFF, 0.3);
        this.aura.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: this.aura,
            scale: { from: 1, to: 1.2 },
            alpha: { from: 0.3, to: 0.1 },
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
    }
    
    createMagicTrail() {
        this.trail = [];
        this.trailLength = 5;
        
        for (let i = 0; i < this.trailLength; i++) {
            const trailPart = this.scene.add.circle(this.x, this.y, 8 - i, 0x00FFFF, 0.3 - (i * 0.05));
            trailPart.setBlendMode(Phaser.BlendModes.ADD);
            this.trail.push({
                sprite: trailPart,
                x: this.x,
                y: this.y
            });
        }
    }
    
    updateMagicTrail() {
        // Shift trail positions
        for (let i = this.trail.length - 1; i > 0; i--) {
            this.trail[i].x = this.trail[i - 1].x;
            this.trail[i].y = this.trail[i - 1].y;
        }
        
        // Update first position
        if (this.trail.length > 0) {
            this.trail[0].x = this.x;
            this.trail[0].y = this.y;
        }
        
        // Update sprite positions
        this.trail.forEach((part, index) => {
            part.sprite.x = part.x;
            part.sprite.y = part.y;
            // Fade trail based on movement
            const isMoving = Math.abs(this.body.velocity.x) > 10 || Math.abs(this.body.velocity.y) > 10;
            part.sprite.alpha = isMoving ? (0.3 - (index * 0.05)) : 0;
        });
    }
    
    createAnimations() {
        // Create wizard animations if they don't exist
        if (!this.scene.anims.exists('wizard-idle')) {
            this.scene.anims.create({
                key: 'wizard-idle',
                frames: this.scene.anims.generateFrameNumbers('wizard', { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists('wizard-walk')) {
            this.scene.anims.create({
                key: 'wizard-walk',
                frames: this.scene.anims.generateFrameNumbers('wizard', { start: 4, end: 11 }),
                frameRate: 12,
                repeat: -1
            });
        }
        
        if (!this.scene.anims.exists('wizard-jump')) {
            this.scene.anims.create({
                key: 'wizard-jump',
                frames: this.scene.anims.generateFrameNumbers('wizard', { start: 12, end: 13 }),
                frameRate: 8
            });
        }
        
        if (!this.scene.anims.exists('wizard-cast')) {
            this.scene.anims.create({
                key: 'wizard-cast',
                frames: this.scene.anims.generateFrameNumbers('wizard', { start: 14, end: 17 }),
                frameRate: 10
            });
        }
        
        // Breathing animation when idle
        this.scene.tweens.add({
            targets: this,
            scaleY: { from: 1.5, to: 1.48 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.inOut'
        });
    }
    
    createControls() {
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    }
    
    update() {
        // Update aura and trail positions
        if (this.aura) {
            this.aura.x = this.x;
            this.aura.y = this.y;
        }
        
        this.updateMagicTrail();
        
        // Calculate actual speed with power-ups
        const currentSpeed = GameConfig.PLAYER_SPEED * this.speedMultiplier;
        
        // Movement with smooth acceleration
        if (this.cursors.left.isDown) {
            this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, -currentSpeed, 0.15));
            this.setFlipX(true);
            this.facing = 'left';
            this.rotation = -0.05;
            this.play('wizard-walk', true);
            this.createRunParticles();
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, currentSpeed, 0.15));
            this.setFlipX(false);
            this.facing = 'right';
            this.rotation = 0.05;
            this.play('wizard-walk', true);
            this.createRunParticles();
        } else {
            this.setVelocityX(Phaser.Math.Linear(this.body.velocity.x, 0, 0.2));
            this.rotation = 0;
            this.play('wizard-idle', true);
        }
        
        // Jump and double jump
        if (this.body.touching.down) {
            this.hasDoubleJumped = false;
        }
        
        if (this.cursors.up.isDown) {
            if (this.body.touching.down) {
                this.jump();
            } else if (this.canDoubleJump && !this.hasDoubleJumped && this.cursors.up.isDown && 
                      Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
                this.doubleJump();
            }
        }
        
        // Dash ability with shift
        if (Phaser.Input.Keyboard.JustDown(this.shiftKey) && this.mana > 0) {
            this.dash();
        }
        
        // Cast spell
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.mana > 0) {
            this.castSpell();
        }
        
        // Floating effect when jumping
        if (!this.body.touching.down) {
            this.play('wizard-jump', true);
            // Add slight float
            if (this.body.velocity.y < 0 && this.cursors.up.isDown) {
                this.body.velocity.y *= 0.98;
            }
        }
    }
    
    jump() {
        this.setVelocityY(-GameConfig.PLAYER_JUMP);
        if (this.scene.soundManager) {
            this.scene.soundManager.play('jump');
        }
        this.createJumpParticles();
    }
    
    doubleJump() {
        this.setVelocityY(-GameConfig.PLAYER_JUMP * 0.8);
        this.hasDoubleJumped = true;
        this.createDoubleJumpEffect();
    }
    
    dash() {
        const dashSpeed = 800;
        this.setVelocityX(this.facing === 'right' ? dashSpeed : -dashSpeed);
        this.mana--;
        this.scene.updateHUD();
        
        // Dash visual effect
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 0.3, to: 1 },
            duration: 300,
            repeat: 2,
            yoyo: true
        });
        
        // After-image effect
        for (let i = 0; i < 3; i++) {
            this.scene.time.delayedCall(i * 50, () => {
                const afterImage = this.scene.add.sprite(this.x, this.y, 'wizard');
                afterImage.setAlpha(0.5 - i * 0.15);
                afterImage.setTint(0x00FFFF);
                afterImage.setScale(this.scaleX, this.scaleY);
                afterImage.setFlipX(this.flipX);
                
                this.scene.tweens.add({
                    targets: afterImage,
                    alpha: 0,
                    scale: 0.5,
                    duration: 300,
                    onComplete: () => afterImage.destroy()
                });
            });
        }
    }
    
    createJumpParticles() {
        for (let i = 0; i < 10; i++) {
            const particle = this.scene.add.circle(
                this.x + Phaser.Math.Between(-20, 20),
                this.y + 20,
                Phaser.Math.Between(2, 5),
                0x00FFFF
            );
            particle.setBlendMode(Phaser.BlendModes.ADD);
            
            this.scene.tweens.add({
                targets: particle,
                y: particle.y + Phaser.Math.Between(20, 40),
                x: particle.x + Phaser.Math.Between(-30, 30),
                alpha: 0,
                scale: 0,
                duration: 800,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    createDoubleJumpEffect() {
        // Create ring effect
        const ring = this.scene.add.circle(this.x, this.y, 20, 0x00FFFF, 0);
        ring.setStrokeStyle(4, 0x00FFFF);
        ring.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: ring,
            scale: 3,
            alpha: { from: 1, to: 0 },
            duration: 500,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });
    }
    
    createRunParticles() {
        if (this.body.touching.down && Phaser.Math.Between(0, 100) < 20) {
            const dust = this.scene.add.circle(
                this.x - (this.facing === 'right' ? 20 : -20),
                this.y + 25,
                Phaser.Math.Between(2, 4),
                0xCCCCCC, 0.5
            );
            
            this.scene.tweens.add({
                targets: dust,
                y: dust.y - 10,
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => dust.destroy()
            });
        }
    }
    
    castSpell() {
        if (this.mana <= 0) return;
        
        this.mana--;
        if (this.scene.soundManager) {
            this.scene.soundManager.play('spell');
        }
        this.scene.updateHUD();
        this.play('wizard-cast');
        
        // Create magical spell projectile
        const spell = new Projectile(
            this.scene,
            this.x + (this.facing === 'right' ? 40 : -40),
            this.y,
            this.facing
        );
        
        // Recoil effect
        this.setVelocityX(this.facing === 'right' ? -100 : 100);
        
        // Screen shake for power
        this.scene.cameras.main.shake(100, 0.005);
        
        // Mana regeneration after delay
        this.scene.time.delayedCall(3000, () => {
            if (this.mana < this.maxMana) {
                this.mana++;
                this.scene.updateHUD();
                this.createManaRegenEffect();
            }
        });
    }
    
    createManaRegenEffect() {
        const star = this.scene.add.star(this.x, this.y - 30, 5, 8, 15, 0x0000FF);
        star.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: star,
            y: this.y - 60,
            alpha: { from: 1, to: 0 },
            scale: { from: 1, to: 0 },
            rotation: Math.PI,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => star.destroy()
        });
    }
    
    takeDamage(amount = 1) {
        if (this.invulnerable) return;
        
        this.health -= amount;
        this.invulnerable = true;
        
        // Damage effects
        this.scene.cameras.main.shake(200, 0.02);
        this.scene.cameras.main.flash(200, 255, 0, 0, false);
        
        // Knockback
        this.setVelocityY(-300);
        this.setVelocityX(this.facing === 'right' ? -200 : 200);
        
        // Invulnerability blink
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0.3 },
            duration: 100,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
                this.invulnerable = false;
                this.alpha = 1;
            }
        });
        
        // Damage particles
        for (let i = 0; i < 20; i++) {
            const particle = this.scene.add.circle(
                this.x,
                this.y,
                Phaser.Math.Between(2, 5),
                0xFF0000
            );
            
            const angle = (Math.PI * 2 / 20) * i;
            const speed = Phaser.Math.Between(100, 200);
            
            this.scene.physics.add.existing(particle);
            particle.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            
            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                scale: 0,
                duration: 1000,
                onComplete: () => particle.destroy()
            });
        }
        
        this.scene.updateHUD();
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    heal(amount = 1) {
        const previousHealth = this.health;
        this.health = Math.min(this.health + amount, this.maxHealth);
        const actualHeal = this.health - previousHealth;
        
        if (actualHeal > 0) {
            this.scene.updateHUD();
            
            // Healing effect
            const healGlow = this.scene.add.circle(this.x, this.y, 50, 0x00FF00, 0.5);
            healGlow.setBlendMode(Phaser.BlendModes.ADD);
            
            this.scene.tweens.add({
                targets: healGlow,
                scale: 2,
                alpha: 0,
                duration: 1000,
                onComplete: () => healGlow.destroy()
            });
            
            // Healing particles
            for (let i = 0; i < 10; i++) {
                const heart = this.scene.add.text(
                    this.x + Phaser.Math.Between(-30, 30),
                    this.y,
                    '❤️',
                    { fontSize: '16px' }
                );
                
                this.scene.tweens.add({
                    targets: heart,
                    y: this.y - 50,
                    alpha: 0,
                    duration: 1500,
                    delay: i * 100,
                    onComplete: () => heart.destroy()
                });
            }
        }
    }
    
    applyPowerUp(type, value, duration) {
        switch(type) {
            case 'speedBoost':
                this.speedMultiplier = value;
                this.setTint(0x00FF00);
                
                this.scene.time.delayedCall(duration, () => {
                    this.speedMultiplier = 1;
                    this.clearTint();
                });
                break;
                
            case 'invulnerability':
                this.invulnerable = true;
                this.aura.fillColor = 0xFFD700;
                
                this.scene.time.delayedCall(duration, () => {
                    this.invulnerable = false;
                    this.aura.fillColor = 0x00FFFF;
                });
                break;
                
            case 'doubleJump':
                this.canDoubleJump = true;
                
                this.scene.time.delayedCall(duration, () => {
                    this.canDoubleJump = false;
                });
                break;
        }
    }
    
    die() {
        // Epic death animation
        this.scene.tweens.add({
            targets: this,
            y: this.y - 100,
            rotation: Math.PI * 4,
            scale: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.scene.gameOver();
            }
        });
        
        // Death particles
        if (this.scene.particleManager) {
            this.scene.particleManager.createMagicBurst(this.x, this.y, 0xFF0000);
        }
        
        // Clean up effects
        if (this.aura) this.aura.destroy();
        this.trail.forEach(part => part.sprite.destroy());
    }
    
    destroy() {
        if (this.aura) this.aura.destroy();
        this.trail.forEach(part => part.sprite.destroy());
        super.destroy();
    }
}
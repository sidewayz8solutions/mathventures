class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, 'enemy');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        if (scene.enemies) {
            scene.enemies.add(this);
        }
        
        this.enemyType = type;
        this.setupEnemy();
        this.createHealthBar();
        this.createVisuals();
        this.startAI();
        
        // Animation state
        this.isAttacking = false;
        this.isDead = false;
        this.lastDirection = 1;
    }
    
    setupEnemy() {
        const data = GameConfig.ENEMY_CONFIG[this.enemyType];
        
        this.health = data.health;
        this.maxHealth = data.health;
        this.speed = data.speed;
        this.points = data.points;
        this.isBoss = data.boss || false;
        this.isFlying = data.flying || false;
        this.aiPattern = data.aiPattern;
        this.setScale(data.scale);
        
        if (this.isFlying) {
            this.body.setAllowGravity(false);
        }
        
        this.setBounce(0.8, 0.2);
        this.setCollideWorldBounds(true);
        
        // Create aura for boss
        if (this.isBoss) {
            this.createBossAura();
        }
    }
    
    createVisuals() {
        this.graphics = this.scene.add.graphics();
        this.eyes = [];
        this.decorations = [];
        
        // Create base shape based on enemy type
        this.drawEnemy();
        
        // Add idle animation
        this.scene.tweens.add({
            targets: this,
            scaleY: this.scaleY * 1.05,
            duration: 1500 + Phaser.Math.Between(0, 500),
            ease: 'Sine.inOut',
            repeat: -1,
            yoyo: true
        });
    }
    
    drawEnemy() {
        const data = GameConfig.ENEMY_CONFIG[this.enemyType];
        const color = data.color;
        
        this.graphics.clear();
        
        switch(this.enemyType) {
            case 'slime':
                this.drawSlime(color);
                break;
            case 'mushroom':
                this.drawMushroom(color);
                break;
            case 'bat':
                this.drawBat(color);
                break;
            case 'golem':
                this.drawGolem(color);
                break;
            case 'dragon':
                this.drawDragon(color);
                break;
            default:
                this.drawGenericEnemy(color);
        }
    }
    
    drawSlime(color) {
        // Body
        this.graphics.fillStyle(color, 1);
        this.graphics.fillCircle(this.x, this.y - 5, 20);
        this.graphics.fillEllipse(this.x, this.y + 10, 45, 25);
        
        // Shiny highlight
        this.graphics.fillStyle(0xFFFFFF, 0.4);
        this.graphics.fillEllipse(this.x - 8, this.y - 10, 12, 8);
        
        // Eyes
        this.drawCuteEyes(this.x - 8, this.y - 5, this.x + 8, this.y - 5);
        
        // Mouth
        this.graphics.lineStyle(2, 0x000000);
        this.graphics.strokeCircle(this.x, this.y + 2, 8, 0, Math.PI);
        
        // Bubbles
        if (Phaser.Math.Between(0, 100) < 10) {
            this.createBubble();
        }
    }
    
    drawMushroom(color) {
        // Stem
        this.graphics.fillStyle(0xF5DEB3, 1);
        this.graphics.fillRect(this.x - 12, this.y, 24, 20);
        
        // Cap
        this.graphics.fillStyle(color, 1);
        this.graphics.fillCircle(this.x, this.y - 10, 25);
        this.graphics.fillEllipse(this.x, this.y, 55, 20);
        
        // Spots
        this.graphics.fillStyle(0xFFFFFF, 0.8);
        this.graphics.fillCircle(this.x - 10, this.y - 10, 5);
        this.graphics.fillCircle(this.x + 8, this.y - 8, 4);
        this.graphics.fillCircle(this.x, this.y - 15, 3);
        
        // Face
        this.drawCuteEyes(this.x - 8, this.y, this.x + 8, this.y);
        
        // Rosy cheeks
        this.graphics.fillStyle(0xFF69B4, 0.5);
        this.graphics.fillCircle(this.x - 15, this.y + 5, 3);
        this.graphics.fillCircle(this.x + 15, this.y + 5, 3);
    }
    
    drawBat(color) {
        // Body
        this.graphics.fillStyle(color, 1);
        this.graphics.fillEllipse(this.x, this.y, 20, 25);
        
        // Wings
        const wingFlap = Math.sin(this.scene.time.now / 100) * 10;
        
        // Left wing
        this.graphics.beginPath();
        this.graphics.moveTo(this.x - 10, this.y);
        this.graphics.lineTo(this.x - 30, this.y - 10 + wingFlap);
        this.graphics.lineTo(this.x - 25, this.y + 5 + wingFlap);
        this.graphics.lineTo(this.x - 20, this.y);
        this.graphics.lineTo(this.x - 15, this.y + 5 + wingFlap);
        this.graphics.closePath();
        this.graphics.fillPath();
        
        // Right wing
        this.graphics.beginPath();
        this.graphics.moveTo(this.x + 10, this.y);
        this.graphics.lineTo(this.x + 30, this.y - 10 + wingFlap);
        this.graphics.lineTo(this.x + 25, this.y + 5 + wingFlap);
        this.graphics.lineTo(this.x + 20, this.y);
        this.graphics.lineTo(this.x + 15, this.y + 5 + wingFlap);
        this.graphics.closePath();
        this.graphics.fillPath();
        
        // Ears
        this.graphics.fillTriangle(
            this.x - 8, this.y - 12,
            this.x - 5, this.y - 20,
            this.x - 2, this.y - 12
        );
        this.graphics.fillTriangle(
            this.x + 8, this.y - 12,
            this.x + 5, this.y - 20,
            this.x + 2, this.y - 12
        );
        
        // Eyes (glowing)
        this.graphics.fillStyle(0xFF0000, 1);
        this.graphics.fillCircle(this.x - 5, this.y - 5, 3);
        this.graphics.fillCircle(this.x + 5, this.y - 5, 3);
        
        // Fangs
        this.graphics.fillStyle(0xFFFFFF, 1);
        this.graphics.fillTriangle(
            this.x - 3, this.y + 2,
            this.x - 2, this.y + 5,
            this.x - 1, this.y + 2
        );
        this.graphics.fillTriangle(
            this.x + 3, this.y + 2,
            this.x + 2, this.y + 5,
            this.x + 1, this.y + 2
        );
    }
    
    drawGolem(color) {
        // Body blocks
        this.graphics.fillStyle(color, 1);
        this.graphics.fillRect(this.x - 20, this.y - 10, 40, 30);
        this.graphics.fillRect(this.x - 25, this.y - 25, 50, 20);
        
        // Arms
        this.graphics.fillRect(this.x - 35, this.y - 15, 12, 25);
        this.graphics.fillRect(this.x + 23, this.y - 15, 12, 25);
        
        // Head
        this.graphics.fillRect(this.x - 15, this.y - 40, 30, 20);
        
        // Stone texture lines
        this.graphics.lineStyle(1, 0x000000, 0.3);
        this.graphics.strokeRect(this.x - 20, this.y - 10, 40, 30);
        this.graphics.beginPath();
        this.graphics.moveTo(this.x - 10, this.y - 25);
        this.graphics.lineTo(this.x - 5, this.y - 5);
        this.graphics.strokePath();
        this.graphics.beginPath();
        this.graphics.moveTo(this.x + 10, this.y - 25);
        this.graphics.lineTo(this.x + 5, this.y - 5);
        this.graphics.strokePath();
        
        // Glowing eyes
        this.graphics.fillStyle(0x00FFFF, 1);
        this.graphics.fillCircle(this.x - 8, this.y - 30, 4);
        this.graphics.fillCircle(this.x + 8, this.y - 30, 4);
        
        // Cracks
        this.graphics.lineStyle(2, 0x000000, 0.5);
        this.graphics.beginPath();
        this.graphics.moveTo(this.x - 5, this.y - 35);
        this.graphics.lineTo(this.x - 3, this.y - 30);
        this.graphics.lineTo(this.x - 5, this.y - 25);
        this.graphics.strokePath();
    }
    
    drawDragon(color) {
        // Body
        this.graphics.fillStyle(color, 1);
        this.graphics.fillEllipse(this.x, this.y, 40, 30);
        
        // Neck and head
        this.graphics.fillEllipse(this.x + 15, this.y - 20, 20, 15);
        this.graphics.fillTriangle(
            this.x + 10, this.y - 25,
            this.x + 35, this.y - 20,
            this.x + 25, this.y - 10
        );
        
        // Wings (animated)
        const wingFlap = Math.sin(this.scene.time.now / 150) * 15;
        
        this.graphics.fillStyle(color, 0.8);
        // Left wing
        this.graphics.beginPath();
        this.graphics.moveTo(this.x - 15, this.y - 10);
        this.graphics.lineTo(this.x - 50, this.y - 20 + wingFlap);
        this.graphics.lineTo(this.x - 45, this.y + wingFlap);
        this.graphics.lineTo(this.x - 35, this.y - 5 + wingFlap);
        this.graphics.lineTo(this.x - 25, this.y + 5);
        this.graphics.closePath();
        this.graphics.fillPath();
        
        // Right wing
        this.graphics.beginPath();
        this.graphics.moveTo(this.x + 15, this.y - 10);
        this.graphics.lineTo(this.x + 50, this.y - 20 + wingFlap);
        this.graphics.lineTo(this.x + 45, this.y + wingFlap);
        this.graphics.lineTo(this.x + 35, this.y - 5 + wingFlap);
        this.graphics.lineTo(this.x + 25, this.y + 5);
        this.graphics.closePath();
        this.graphics.fillPath();
        
        // Tail
        this.graphics.fillTriangle(
            this.x - 20, this.y + 5,
            this.x - 40, this.y + 10,
            this.x - 25, this.y + 15
        );
        
        // Spikes
        this.graphics.fillStyle(0xFFD700, 1);
        for (let i = 0; i < 4; i++) {
            this.graphics.fillTriangle(
                this.x - 10 + i * 8, this.y - 15,
                this.x - 8 + i * 8, this.y - 22,
                this.x - 6 + i * 8, this.y - 15
            );
        }
        
        // Eyes (glowing)
        this.graphics.fillStyle(0xFFFF00, 1);
        this.graphics.fillCircle(this.x + 20, this.y - 20, 4);
        this.graphics.fillCircle(this.x + 30, this.y - 20, 4);
        
        // Nostrils with smoke
        if (Phaser.Math.Between(0, 100) < 20) {
            this.createSmokePuff(this.x + 35, this.y - 15);
        }
    }
    
    drawGenericEnemy(color) {
        this.graphics.fillStyle(color, 1);
        this.graphics.fillRect(this.x - 20, this.y - 20, 40, 40);
        this.drawCuteEyes(this.x - 8, this.y - 8, this.x + 8, this.y - 8);
    }
    
    drawCuteEyes(x1, y1, x2, y2) {
        // Eye whites
        this.graphics.fillStyle(0xFFFFFF, 1);
        this.graphics.fillCircle(x1, y1, 5);
        this.graphics.fillCircle(x2, y2, 5);
        
        // Pupils (follow player)
        this.graphics.fillStyle(0x000000, 1);
        if (this.scene.player) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);
            const pupilOffset = 2;
            this.graphics.fillCircle(x1 + Math.cos(angle) * pupilOffset, y1 + Math.sin(angle) * pupilOffset, 3);
            this.graphics.fillCircle(x2 + Math.cos(angle) * pupilOffset, y2 + Math.sin(angle) * pupilOffset, 3);
        } else {
            this.graphics.fillCircle(x1, y1, 3);
            this.graphics.fillCircle(x2, y2, 3);
        }
        
        // Eye sparkles
        this.graphics.fillStyle(0xFFFFFF, 1);
        this.graphics.fillCircle(x1 + 1, y1 - 1, 1);
        this.graphics.fillCircle(x2 + 1, y2 - 1, 1);
    }
    
    createBubble() {
        const bubble = this.scene.add.circle(
            this.x + Phaser.Math.Between(-10, 10),
            this.y + 20,
            Phaser.Math.Between(3, 6),
            0xFFFFFF, 0.4
        );
        bubble.setStrokeStyle(1, 0xFFFFFF, 0.6);
        
        this.scene.tweens.add({
            targets: bubble,
            y: this.y - 30,
            alpha: 0,
            scale: 1.5,
            duration: 2000,
            ease: 'Sine.in',
            onComplete: () => bubble.destroy()
        });
    }
    
    createSmokePuff(x, y) {
        const smoke = this.scene.add.circle(x, y, 8, 0x666666, 0.6);
        
        this.scene.tweens.add({
            targets: smoke,
            y: y - 20,
            scale: 2,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => smoke.destroy()
        });
    }
    
    createBossAura() {
        this.bossAura = this.scene.add.circle(this.x, this.y, 60, 0xFF0000, 0.2);
        this.bossAura.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: this.bossAura,
            scale: { from: 1, to: 1.3 },
            alpha: { from: 0.2, to: 0.4 },
            duration: 1500,
            repeat: -1,
            yoyo: true
        });
        
        // Lightning effect for boss
        this.scene.time.addEvent({
            delay: 2000,
            callback: () => this.createBossLightning(),
            loop: true
        });
    }
    
    createBossLightning() {
        if (this.isDead) return;
        
        const lightning = this.scene.add.graphics();
        lightning.lineStyle(3, 0xFFFF00, 1);
        
        let currentX = this.x;
        let currentY = this.y - 40;
        
        lightning.beginPath();
        lightning.moveTo(currentX, currentY);
        
        for (let i = 0; i < 5; i++) {
            currentX += Phaser.Math.Between(-20, 20);
            currentY += 15;
            lightning.lineTo(currentX, currentY);
        }
        
        lightning.strokePath();
        lightning.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: lightning,
            alpha: 0,
            duration: 300,
            onComplete: () => lightning.destroy()
        });
    }
    
    createHealthBar() {
        const barWidth = this.isBoss ? 100 : 40;
        const barHeight = this.isBoss ? 10 : 6;
        
        this.healthBarBg = this.scene.add.rectangle(
            this.x, this.y - 40,
            barWidth, barHeight,
            0x000000
        );
        this.healthBarBg.setStrokeStyle(2, 0xFFFFFF);
        
        this.healthBar = this.scene.add.rectangle(
            this.x, this.y - 40,
            barWidth, barHeight,
            0x00FF00
        );
        
        // Boss name label
        if (this.isBoss) {
            this.bossLabel = this.scene.add.text(this.x, this.y - 55, 
                this.enemyType.toUpperCase(), {
                fontFamily: 'Fredoka',
                fontSize: '16px',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
        }
    }
    
    updateHealthBar() {
        const healthPercent = this.health / this.maxHealth;
        const barWidth = this.isBoss ? 100 : 40;
        
        this.healthBar.width = barWidth * healthPercent;
        this.healthBarBg.x = this.x;
        this.healthBarBg.y = this.y - 40;
        this.healthBar.x = this.x;
        this.healthBar.y = this.y - 40;
        
        // Update color based on health
        if (healthPercent > 0.6) {
            this.healthBar.fillColor = 0x00FF00;
        } else if (healthPercent > 0.3) {
            this.healthBar.fillColor = 0xFFFF00;
        } else {
            this.healthBar.fillColor = 0xFF0000;
        }
        
        if (this.bossLabel) {
            this.bossLabel.x = this.x;
            this.bossLabel.y = this.y - 55;
        }
    }
    
    startAI() {
        switch(this.aiPattern) {
            case 'patrol':
                this.patrolAI();
                break;
            case 'guard':
                this.guardAI();
                break;
            case 'swoop':
                this.swoopAI();
                break;
            case 'charge':
                this.chargeAI();
                break;
            case 'boss':
                this.bossAI();
                break;
            default:
                this.patrolAI();
        }
    }
    
    patrolAI() {
        this.setVelocityX(this.speed * (Math.random() > 0.5 ? 1 : -1));
        
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 4000),
            callback: () => {
                if (!this.isDead) {
                    this.setVelocityX(-this.body.velocity.x);
                    
                    // Slimes jump
                    if (this.enemyType === 'slime' && this.body.touching.down) {
                        this.setVelocityY(-300);
                    }
                }
            },
            loop: true
        });
    }
    
    guardAI() {
        // Stand still but track player
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                if (!this.isDead && this.scene.player) {
                    const distance = Phaser.Math.Distance.Between(
                        this.x, this.y,
                        this.scene.player.x, this.scene.player.y
                    );
                    
                    if (distance < 200) {
                        // Face player
                        this.setFlipX(this.scene.player.x < this.x);
                        
                        // Occasionally shoot projectile
                        if (Phaser.Math.Between(0, 100) < 2) {
                            this.shootProjectile();
                        }
                    }
                }
            },
            loop: true
        });
    }
    
    swoopAI() {
        // Flying pattern
        const baseY = this.y;
        
        this.scene.tweens.add({
            targets: this,
            y: baseY - 50,
            duration: 2000,
            ease: 'Sine.inOut',
            repeat: -1,
            yoyo: true
        });
        
        // Horizontal movement
        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                if (!this.isDead && this.scene.player) {
                    // Swoop toward player
                    const angle = Phaser.Math.Angle.Between(
                        this.x, this.y,
                        this.scene.player.x, this.scene.player.y
                    );
                    
                    this.setVelocity(
                        Math.cos(angle) * this.speed * 2,
                        Math.sin(angle) * this.speed
                    );
                    
                    // Return to patrol after swoop
                    this.scene.time.delayedCall(1500, () => {
                        this.setVelocity(0, 0);
                    });
                }
            },
            loop: true
        });
    }
    
    chargeAI() {
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                if (!this.isDead && this.scene.player) {
                    const distance = Phaser.Math.Distance.Between(
                        this.x, this.y,
                        this.scene.player.x, this.scene.player.y
                    );
                    
                    if (distance < 300 && distance > 50) {
                        // Charge at player
                        const direction = this.scene.player.x > this.x ? 1 : -1;
                        this.setVelocityX(this.speed * direction * 1.5);
                        
                        // Jump if needed
                        if (this.body.touching.down && Math.abs(this.scene.player.y - this.y) > 50) {
                            this.setVelocityY(-400);
                        }
                    } else {
                        // Slow down when close or far
                        this.setVelocityX(this.body.velocity.x * 0.9);
                    }
                }
            },
            loop: true
        });
    }
    
    bossAI() {
        let attackPhase = 0;
        
        this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
                if (!this.isDead) {
                    switch(attackPhase) {
                        case 0:
                            this.fireBreathAttack();
                            break;
                        case 1:
                            this.summonMinions();
                            break;
                        case 2:
                            this.chargeAttack();
                            break;
                    }
                    
                    attackPhase = (attackPhase + 1) % 3;
                }
            },
            loop: true
        });
        
        // Basic movement
        this.patrolAI();
    }
    
    fireBreathAttack() {
        if (this.enemyType !== 'dragon') return;
        
        // Warning effect
        this.setTint(0xFF6600);
        
        this.scene.time.delayedCall(500, () => {
            this.clearTint();
            
            // Create fire projectiles
            for (let i = 0; i < 5; i++) {
                this.scene.time.delayedCall(i * 100, () => {
                    const fireball = this.scene.add.circle(
                        this.x,
                        this.y,
                        10,
                        0xFF4500
                    );
                    fireball.setBlendMode(Phaser.BlendModes.ADD);
                    
                    const angle = Phaser.Math.Between(-45, 45);
                    const radians = Phaser.Math.DegToRad(angle);
                    const speed = 300;
                    
                    this.scene.physics.add.existing(fireball);
                    fireball.body.setVelocity(
                        Math.cos(radians) * speed * (this.flipX ? -1 : 1),
                        Math.sin(radians) * speed
                    );
                    fireball.body.setAllowGravity(false);
                    
                    // Fire particles
                    const fireTrail = this.scene.add.particles(fireball.x, fireball.y, 'particle', {
                        speed: { min: 50, max: 100 },
                        scale: { start: 0.5, end: 0 },
                        blendMode: 'ADD',
                        lifespan: 500,
                        tint: [0xFF0000, 0xFF6600, 0xFFFF00]
                    });
                    
                    // Collision with player
                    this.scene.physics.add.overlap(fireball, this.scene.player, () => {
                        this.scene.player.takeDamage(1);
                        fireball.destroy();
                        fireTrail.destroy();
                    });
                    
                    this.scene.time.delayedCall(3000, () => {
                        fireball.destroy();
                        fireTrail.destroy();
                    });
                });
            }
        });
    }
    
    summonMinions() {
        // Create warning circles
        for (let i = 0; i < 2; i++) {
            const x = this.x + (i === 0 ? -100 : 100);
            const warningCircle = this.scene.add.circle(x, this.y, 30, 0xFF0000, 0.3);
            warningCircle.setStrokeStyle(3, 0xFF0000);
            
            this.scene.tweens.add({
                targets: warningCircle,
                alpha: { from: 0.3, to: 0.8 },
                scale: { from: 1, to: 1.5 },
                duration: 500,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                    warningCircle.destroy();
                    
                    // Spawn minion
                    if (!this.isDead) {
                        new Enemy(this.scene, x, this.y - 50, 'bat');
                    }
                }
            });
        }
    }
    
    chargeAttack() {
        // Telegraph charge
        this.setTint(0xFFFF00);
        
        // Shake effect
        this.scene.tweens.add({
            targets: this,
            x: this.x + Phaser.Math.Between(-5, 5),
            duration: 50,
            repeat: 10,
            yoyo: true,
            onComplete: () => {
                this.clearTint();
                
                if (this.scene.player) {
                    // Charge toward player
                    const direction = this.scene.player.x > this.x ? 1 : -1;
                    this.setVelocityX(this.speed * direction * 3);
                    
                    // Stop after charge
                    this.scene.time.delayedCall(1000, () => {
                        this.setVelocityX(0);
                    });
                }
            }
        });
    }
    
    shootProjectile() {
        if (this.isDead) return;
        
        const projectile = this.scene.add.circle(this.x, this.y, 6, 0xFF00FF);
        projectile.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.physics.add.existing(projectile);
        
        if (this.scene.player) {
            const angle = Phaser.Math.Angle.Between(
                this.x, this.y,
                this.scene.player.x, this.scene.player.y
            );
            
            projectile.body.setVelocity(
                Math.cos(angle) * 200,
                Math.sin(angle) * 200
            );
            projectile.body.setAllowGravity(false);
            
            // Collision with player
            this.scene.physics.add.overlap(projectile, this.scene.player, () => {
                this.scene.player.takeDamage(1);
                projectile.destroy();
            });
        }
        
        // Destroy after time
        this.scene.time.delayedCall(3000, () => projectile.destroy());
    }
    
    takeDamage(amount = 1) {
        if (this.isDead) return;
        
        this.health -= amount;
        this.updateHealthBar();
        
        // Flash effect
        this.scene.tweens.add({
            targets: this,
            tint: 0xFF0000,
            duration: 100,
            yoyo: true,
            onComplete: () => this.clearTint()
        });
        
        // Damage numbers
        const damageText = this.scene.add.text(
            this.x + Phaser.Math.Between(-20, 20),
            this.y - 30,
            `-${amount}`,
            {
                fontFamily: 'Fredoka',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#FF0000',
                stroke: '#000000',
                strokeThickness: 2
            }
        );
        
        this.scene.tweens.add({
            targets: damageText,
            y: damageText.y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => damageText.destroy()
        });
        
        // Knockback
        this.setVelocityY(-200);
        if (this.scene.player) {
            const knockbackDirection = this.x > this.scene.player.x ? 1 : -1;
            this.setVelocityX(knockbackDirection * 150);
        }
        
        // Particles
        for (let i = 0; i < 10; i++) {
            const particle = this.scene.add.circle(
                this.x + Phaser.Math.Between(-20, 20),
                this.y + Phaser.Math.Between(-20, 20),
                Phaser.Math.Between(2, 4),
                GameConfig.ENEMY_CONFIG[this.enemyType].color
            );
            
            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                scale: 0,
                y: particle.y + Phaser.Math.Between(20, 40),
                duration: 800,
                onComplete: () => particle.destroy()
            });
        }
        
        if (this.health <= 0) {
            this.defeat();
        }
    }
    
    defeat() {
        if (this.isDead) return;
        this.isDead = true;
        
        // Trigger math challenge
        if (this.scene.battleManager) {
            this.scene.battleManager.startBattle(this);
        }
        
        // Freeze enemy
        this.setVelocity(0, 0);
        this.body.enable = false;
        
        // Freeze effect
        this.setTint(0x4444FF);
        
        // Ice crystals
        for (let i = 0; i < 6; i++) {
            const crystal = this.scene.add.polygon(
                this.x + Phaser.Math.Between(-30, 30),
                this.y + Phaser.Math.Between(-30, 30),
                [0, 0, 4, -8, 8, 0, 4, 8],
                0x00FFFF, 0.7
            );
            crystal.setScale(Phaser.Math.FloatBetween(0.5, 1.5));
            
            this.scene.tweens.add({
                targets: crystal,
                alpha: 0,
                scale: 0,
                rotation: Math.PI,
                duration: 2000,
                delay: i * 100,
                onComplete: () => crystal.destroy()
            });
        }
    }
    
    finalDefeat() {
        // Epic defeat animation
        if (this.scene.particleManager) {
            this.scene.particleManager.createStarBurst(this.x, this.y);
        }
        
        // Death animation
        this.scene.tweens.add({
            targets: this,
            y: this.y - 100,
            alpha: 0,
            scale: 0,
            rotation: Math.PI * 4,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                // Create collectible gems
                for (let i = 0; i < 3; i++) {
                    this.createGem();
                }
                
                if (this.scene.soundManager) {
                    this.scene.soundManager.play('victory');
                }
                
                this.destroy();
            }
        });
        
        // Explosion particles
        for (let i = 0; i < 30; i++) {
            const particle = this.scene.add.star(
                this.x, this.y,
                5, 4, 8,
                Phaser.Math.RND.pick([0xFFD700, 0xFF69B4, 0x00CED1])
            );
            particle.setBlendMode(Phaser.BlendModes.ADD);
            
            const angle = (Math.PI * 2 / 30) * i;
            const speed = Phaser.Math.Between(100, 300);
            
            this.scene.physics.add.existing(particle);
            particle.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            particle.body.setAllowGravity(false);
            
            this.scene.tweens.add({
                targets: particle,
                alpha: 0,
                scale: 0,
                rotation: Math.PI * 2,
                duration: 1500,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    createGem() {
        const gem = this.scene.add.star(
            this.x + Phaser.Math.Between(-30, 30),
            this.y,
            6, 10, 20,
            0xFFD700
        );
        gem.setScale(0.5);
        
        this.scene.physics.add.existing(gem);
        gem.body.setBounce(0.8);
        gem.body.setVelocity(
            Phaser.Math.Between(-100, 100),
            Phaser.Math.Between(-300, -200)
        );
        
        // Collection
        this.scene.physics.add.overlap(gem, this.scene.player, () => {
            if (this.scene.soundManager) {
                this.scene.soundManager.play('collect');
            }
            
            this.scene.score += 10;
            this.scene.updateHUD();
            
            // Collection effect
            this.scene.tweens.add({
                targets: gem,
                y: gem.y - 50,
                alpha: 0,
                scale: 2,
                duration: 500,
                onComplete: () => gem.destroy()
            });
        });
        
        // Floating animation
        this.scene.tweens.add({
            targets: gem,
            y: gem.y - 10,
            duration: 1000,
            ease: 'Sine.inOut',
            repeat: -1,
            yoyo: true
        });
        
        // Rotation
        this.scene.tweens.add({
            targets: gem,
            rotation: Math.PI * 2,
            duration: 2000,
            repeat: -1
        });
        
        // Destroy after time if not collected
        this.scene.time.delayedCall(10000, () => {
            if (gem.active) {
                this.scene.tweens.add({
                    targets: gem,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => gem.destroy()
                });
            }
        });
    }
    
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        if (!this.isDead && this.graphics) {
            this.drawEnemy();
        }
        
        this.updateHealthBar();
        
        if (this.bossAura) {
            this.bossAura.x = this.x;
            this.bossAura.y = this.y;
        }
        
        // Update flip based on velocity
        if (Math.abs(this.body.velocity.x) > 10) {
            this.setFlipX(this.body.velocity.x < 0);
        }
    }
    
    destroy() {
        if (this.graphics) this.graphics.destroy();
        if (this.healthBar) this.healthBar.destroy();
        if (this.healthBarBg) this.healthBarBg.destroy();
        if (this.bossLabel) this.bossLabel.destroy();
        if (this.bossAura) this.bossAura.destroy();
        
        super.destroy();
    }
}
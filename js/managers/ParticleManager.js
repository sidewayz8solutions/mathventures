class ParticleManager {
    constructor(scene) {
        this.scene = scene;
    }
    
    createMagicBurst(x, y, color = 0xFFD700) {
        // Create burst of magical particles
        for (let i = 0; i < 20; i++) {
            const particle = this.scene.add.circle(
                x, y,
                Phaser.Math.Between(3, 8),
                color
            );
            particle.setBlendMode(Phaser.BlendModes.ADD);
            
            const angle = (Math.PI * 2 / 20) * i;
            const speed = Phaser.Math.Between(200, 400);
            
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
                duration: 1000,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    createStarBurst(x, y) {
        // Create expanding star burst
        for (let i = 0; i < 12; i++) {
            const star = this.scene.add.star(x, y, 5, 4, 8, 0xFFD700);
            star.setBlendMode(Phaser.BlendModes.ADD);
            
            const angle = (i / 12) * Math.PI * 2;
            
            this.scene.tweens.add({
                targets: star,
                x: x + Math.cos(angle) * 150,
                y: y + Math.sin(angle) * 150,
                alpha: 0,
                scale: 2,
                rotation: Math.PI * 2,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => star.destroy()
            });
        }
    }
    
    createSpellTrail(x, y, direction) {
        const colors = [0xFF69B4, 0x00CED1, 0xFFD700, 0x98FB98];
        
        const emitter = this.scene.add.particles(x, y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 500,
            quantity: 3,
            tint: colors,
            angle: direction === 'left' ? { min: 150, max: 210 } : { min: -30, max: 30 }
        });
        
        return emitter;
    }
    
    createPortalParticles(x, y) {
        return this.scene.add.particles(x, y, 'particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 1, end: 0.5 },
            blendMode: 'ADD',
            lifespan: 2000,
            quantity: 2,
            tint: [0x00FFFF, 0xFF00FF, 0xFFFF00],
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(0, 0, 40),
                quantity: 12
            }
        });
    }
    
    createExplosion(x, y, color = 0xFF4500) {
        // Create explosion effect
        const explosion = this.scene.add.circle(x, y, 10, color);
        explosion.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: explosion,
            scale: 10,
            alpha: 0,
            duration: 500,
            ease: 'Power2',
            onComplete: () => explosion.destroy()
        });
        
        // Debris particles
        for (let i = 0; i < 15; i++) {
            const debris = this.scene.add.rectangle(
                x, y,
                Phaser.Math.Between(5, 15),
                Phaser.Math.Between(5, 15),
                Phaser.Math.RND.pick([color, 0xFFFF00, 0xFF6600])
            );
            
            this.scene.physics.add.existing(debris);
            debris.body.setVelocity(
                Phaser.Math.Between(-300, 300),
                Phaser.Math.Between(-400, -200)
            );
            debris.body.setAngularVelocity(Phaser.Math.Between(-500, 500));
            
            this.scene.tweens.add({
                targets: debris,
                alpha: 0,
                scale: 0,
                duration: 1500,
                onComplete: () => debris.destroy()
            });
        }
    }
    
    createCollectEffect(x, y, type = 'coin') {
        const effects = {
            coin: { emoji: '💰', color: 0xFFD700 },
            gem: { emoji: '💎', color: 0x00FFFF },
            heart: { emoji: '❤️', color: 0xFF0000 },
            star: { emoji: '⭐', color: 0xFFFF00 }
        };
        
        const effect = effects[type] || effects.coin;
        
        // Create collection spiral
        for (let i = 0; i < 8; i++) {
            const particle = this.scene.add.text(x, y, effect.emoji, {
                fontSize: '24px'
            });
            
            const angle = (Math.PI * 2 / 8) * i;
            const radius = 50;
            
            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle + this.scene.time.now / 1000) * radius,
                y: y + Math.sin(angle + this.scene.time.now / 1000) * radius - 50,
                alpha: 0,
                scale: 0.5,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
        
        // Central glow
        const glow = this.scene.add.circle(x, y, 30, effect.color, 0.5);
        glow.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: glow,
            scale: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => glow.destroy()
        });
    }
    
    createDamageNumbers(x, y, damage, color = 0xFF0000) {
        const damageText = this.scene.add.text(x, y, `-${damage}`, {
            fontFamily: 'Fredoka',
            fontSize: '32px',
            fontWeight: 'bold',
            color: color === 0xFF0000 ? '#FF0000' : '#00FF00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Float up and fade
        this.scene.tweens.add({
            targets: damageText,
            y: y - 60,
            alpha: 0,
            scale: 1.5,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => damageText.destroy()
        });
        
        // Add some randomness
        this.scene.tweens.add({
            targets: damageText,
            x: x + Phaser.Math.Between(-20, 20),
            duration: 1500,
            ease: 'Sine.inOut'
        });
    }
    
    createLevelUpEffect(x, y) {
        // Create level up notification
        const levelUpText = this.scene.add.text(x, y - 50, 'LEVEL UP!', {
            fontFamily: 'Fredoka',
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Animate text
        this.scene.tweens.add({
            targets: levelUpText,
            y: y - 100,
            scale: { from: 0, to: 1.5 },
            duration: 1000,
            ease: 'Back.out',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: levelUpText,
                    alpha: 0,
                    duration: 500,
                    delay: 1000,
                    onComplete: () => levelUpText.destroy()
                });
            }
        });
        
        // Create ring effect
        for (let i = 0; i < 3; i++) {
            this.scene.time.delayedCall(i * 200, () => {
                const ring = this.scene.add.circle(x, y, 20, 0xFFD700, 0);
                ring.setStrokeStyle(4, 0xFFD700);
                ring.setBlendMode(Phaser.BlendModes.ADD);
                
                this.scene.tweens.add({
                    targets: ring,
                    scale: 5,
                    alpha: { from: 1, to: 0 },
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => ring.destroy()
                });
            });
        }
        
        // Particle fountain
        for (let i = 0; i < 20; i++) {
            this.scene.time.delayedCall(i * 50, () => {
                const particle = this.scene.add.star(
                    x + Phaser.Math.Between(-10, 10),
                    y,
                    5, 4, 8,
                    Phaser.Math.RND.pick([0xFFD700, 0xFFFF00, 0xFFA500])
                );
                particle.setBlendMode(Phaser.BlendModes.ADD);
                
                this.scene.physics.add.existing(particle);
                particle.body.setVelocity(
                    Phaser.Math.Between(-100, 100),
                    Phaser.Math.Between(-400, -200)
                );
                
                this.scene.tweens.add({
                    targets: particle,
                    alpha: 0,
                    scale: 0,
                    rotation: Math.PI * 4,
                    duration: 2000,
                    onComplete: () => particle.destroy()
                });
            });
        }
    }
    
    createPowerUpEffect(x, y, type) {
        const effects = {
            speed: { color: 0x00FF00, emoji: '⚡' },
            shield: { color: 0xFFD700, emoji: '🛡️' },
            doubleJump: { color: 0xFF00FF, emoji: '🦘' },
            health: { color: 0xFF0000, emoji: '❤️' },
            mana: { color: 0x0000FF, emoji: '⭐' }
        };
        
        const effect = effects[type] || effects.health;
        
        // Create power-up text
        const powerText = this.scene.add.text(x, y - 30, `${effect.emoji} Power Up!`, {
            fontFamily: 'Fredoka',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Animate
        this.scene.tweens.add({
            targets: powerText,
            y: y - 80,
            scale: { from: 0.5, to: 1.2 },
            duration: 1000,
            ease: 'Back.out',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: powerText,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => powerText.destroy()
                });
            }
        });
        
        // Create aura effect
        const aura = this.scene.add.circle(x, y, 50, effect.color, 0.3);
        aura.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: aura,
            scale: 3,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => aura.destroy()
        });
    }
    
    createFireworks(count = 5) {
        for (let i = 0; i < count; i++) {
            this.scene.time.delayedCall(i * 500, () => {
                const x = Phaser.Math.Between(200, GameConfig.GAME_WIDTH - 200);
                const y = Phaser.Math.Between(100, 300);
                
                // Launch trail
                const trail = this.scene.add.circle(x, GameConfig.GAME_HEIGHT, 3, 0xFFFFFF);
                trail.setBlendMode(Phaser.BlendModes.ADD);
                
                this.scene.tweens.add({
                    targets: trail,
                    y: y,
                    duration: 1000,
                    ease: 'Power2',
                    onComplete: () => {
                        trail.destroy();
                        this.explodeFirework(x, y);
                    }
                });
            });
        }
    }
    
    explodeFirework(x, y) {
        const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
        const color = Phaser.Math.RND.pick(colors);
        
        // Central flash
        const flash = this.scene.add.circle(x, y, 20, 0xFFFFFF);
        flash.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: flash,
            scale: 5,
            alpha: 0,
            duration: 300,
            onComplete: () => flash.destroy()
        });
        
        // Sparks
        for (let i = 0; i < 30; i++) {
            const spark = this.scene.add.circle(x, y, 4, color);
            spark.setBlendMode(Phaser.BlendModes.ADD);
            
            const angle = (Math.PI * 2 / 30) * i;
            const speed = Phaser.Math.Between(100, 300);
            
            this.scene.physics.add.existing(spark);
            spark.body.setVelocity(
                Math.cos(angle) * speed,
                Math.sin(angle) * speed
            );
            spark.body.setGravityY(200);
            
            // Trailing sparks
            this.scene.time.addEvent({
                delay: 50,
                repeat: 5,
                callback: () => {
                    const trail = this.scene.add.circle(spark.x, spark.y, 2, color, 0.5);
                    trail.setBlendMode(Phaser.BlendModes.ADD);
                    
                    this.scene.tweens.add({
                        targets: trail,
                        alpha: 0,
                        scale: 0,
                        duration: 500,
                        onComplete: () => trail.destroy()
                    });
                }
            });
            
            this.scene.tweens.add({
                targets: spark,
                alpha: 0,
                scale: 0,
                duration: 2000,
                onComplete: () => spark.destroy()
            });
        }
        
        // Play sound if available
        if (this.scene.soundManager) {
            this.scene.soundManager.play('firework');
        }
    }
}
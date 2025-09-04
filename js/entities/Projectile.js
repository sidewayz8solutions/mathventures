class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, direction) {
        super(scene, x, y, 'spell');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        if (scene.projectiles) {
            scene.projectiles.add(this);
        }
        
        this.setScale(1.5);
        this.body.setAllowGravity(false);
        
        this.direction = direction;
        const speed = 500;
        this.setVelocityX(direction === 'right' ? speed : -speed);
        
        // Create spell graphics
        this.createSpellVisuals();
        
        // Add trailing particles
        this.createTrailEffect();
        
        // Spinning animation
        scene.tweens.add({
            targets: this,
            rotation: Math.PI * 2,
            duration: 500,
            repeat: -1
        });
        
        // Pulsing animation
        scene.tweens.add({
            targets: this,
            scale: { from: 1.3, to: 1.7 },
            duration: 200,
            repeat: -1,
            yoyo: true
        });
        
        // Destroy after time
        scene.time.delayedCall(2000, () => this.destroySpell());
    }
    
    createSpellVisuals() {
        this.graphics = this.scene.add.graphics();
        this.orbs = [];
        
        // Create multiple orbiting orbs
        for (let i = 0; i < 3; i++) {
            const orb = this.scene.add.circle(this.x, this.y, 5, 
                Phaser.Math.RND.pick([0xFF69B4, 0x00CED1, 0xFFD700]));
            orb.setBlendMode(Phaser.BlendModes.ADD);
            this.orbs.push({
                sprite: orb,
                angle: (Math.PI * 2 / 3) * i,
                radius: 15
            });
        }
        
        this.updateSpellVisuals();
    }
    
    updateSpellVisuals() {
        if (this.graphics) {
            const colors = [0xFF69B4, 0x00CED1, 0xFFD700];
            const color = Phaser.Math.RND.pick(colors);
            
            this.graphics.clear();
            
            // Outer glow
            this.graphics.lineStyle(4, color, 0.3);
            this.graphics.strokeCircle(this.x, this.y, 20);
            
            // Middle ring
            this.graphics.lineStyle(3, color, 0.5);
            this.graphics.strokeCircle(this.x, this.y, 15);
            
            // Inner core
            this.graphics.fillStyle(color, 0.8);
            this.graphics.fillCircle(this.x, this.y, 8);
            
            // Energy lines
            for (let i = 0; i < 4; i++) {
                const angle = (Math.PI / 2) * i + this.rotation;
                this.graphics.lineStyle(2, color, 0.7);
                this.graphics.beginPath();
                this.graphics.moveTo(
                    this.x + Math.cos(angle) * 8,
                    this.y + Math.sin(angle) * 8
                );
                this.graphics.lineTo(
                    this.x + Math.cos(angle) * 18,
                    this.y + Math.sin(angle) * 18
                );
                this.graphics.strokePath();
            }
        }
        
        // Update orbiting orbs
        this.orbs.forEach(orb => {
            orb.angle += 0.1;
            orb.sprite.x = this.x + Math.cos(orb.angle) * orb.radius;
            orb.sprite.y = this.y + Math.sin(orb.angle) * orb.radius;
        });
    }
    
    createTrailEffect() {
        this.trail = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'ADD',
            lifespan: 500,
            quantity: 3,
            tint: [0xFF69B4, 0x00CED1, 0xFFD700, 0x98FB98],
            angle: this.direction === 'left' ? { min: 150, max: 210 } : { min: -30, max: 30 }
        });
    }
    
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        if (this.graphics) {
            this.updateSpellVisuals();
        }
        
        if (this.trail) {
            this.trail.setPosition(this.x, this.y);
        }
        
        // Create sparkles
        if (Phaser.Math.Between(0, 100) < 30) {
            const sparkle = this.scene.add.star(
                this.x + Phaser.Math.Between(-10, 10),
                this.y + Phaser.Math.Between(-10, 10),
                4, 2, 4,
                Phaser.Math.RND.pick([0xFF69B4, 0x00CED1, 0xFFD700])
            );
            sparkle.setScale(0.5);
            sparkle.setBlendMode(Phaser.BlendModes.ADD);
            
            this.scene.tweens.add({
                targets: sparkle,
                alpha: 0,
                scale: 0,
                rotation: Math.PI,
                duration: 500,
                onComplete: () => sparkle.destroy()
            });
        }
        
        // Check boundaries
        if (this.x < -50 || this.x > this.scene.game.config.width + 50) {
            this.destroySpell();
        }
    }
    
    hitEnemy(enemy) {
        // Impact effect
        this.createImpactEffect();
        
        // Apply damage
        if (enemy.takeDamage) {
            enemy.takeDamage(1);
        }
        
        this.destroySpell();
    }
    
    createImpactEffect() {
        // Create impact shockwave
        const shockwave = this.scene.add.circle(this.x, this.y, 10, 0xFFFFFF, 0);
        shockwave.setStrokeStyle(4, 0xFFFFFF);
        shockwave.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: shockwave,
            scale: 5,
            alpha: { from: 1, to: 0 },
            duration: 300,
            ease: 'Power2',
            onComplete: () => shockwave.destroy()
        });
        
        // Impact particles
        if (this.scene.particleManager) {
            this.scene.particleManager.createMagicBurst(this.x, this.y);
        } else {
            // Fallback particle effect
            for (let i = 0; i < 20; i++) {
                const particle = this.scene.add.circle(
                    this.x, this.y,
                    Phaser.Math.Between(2, 5),
                    Phaser.Math.RND.pick([0xFF69B4, 0x00CED1, 0xFFD700])
                );
                particle.setBlendMode(Phaser.BlendModes.ADD);
                
                const angle = (Math.PI * 2 / 20) * i;
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
                    duration: 800,
                    onComplete: () => particle.destroy()
                });
            }
        }
    }
    
    destroySpell() {
        if (this.graphics) {
            this.graphics.destroy();
        }
        if (this.trail) {
            this.trail.destroy();
        }
        if (this.orbs) {
            this.orbs.forEach(orb => orb.sprite.destroy());
        }
        this.destroy();
    }
}
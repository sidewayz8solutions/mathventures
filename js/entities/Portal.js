class Portal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'portal');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body.setAllowGravity(false);
        this.setScale(2);
        
        this.isActive = false;
        this.particles = null;
        
        // Create portal visuals
        this.createPortalEffects();
        
        // Spinning animation
        scene.tweens.add({
            targets: this,
            rotation: Math.PI * 2,
            duration: 3000,
            repeat: -1
        });
        
        // Pulsing animation
        scene.tweens.add({
            targets: this,
            scale: { from: 1.8, to: 2.2 },
            duration: 1500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.inOut'
        });
    }
    
    createPortalEffects() {
        // Create graphics for portal rings
        this.graphics = this.scene.add.graphics();
        
        // Create particle effects
        this.createPortalParticles();
        
        // Create energy field
        this.energyField = this.scene.add.circle(this.x, this.y, 35, 0x0000FF, 0.2);
        this.energyField.setBlendMode(Phaser.BlendModes.ADD);
        
        // Animate energy field
        this.scene.tweens.add({
            targets: this.energyField,
            scale: { from: 1, to: 1.3 },
            alpha: { from: 0.2, to: 0.4 },
            duration: 2000,
            repeat: -1,
            yoyo: true
        });
        
        // Create swirling vortex effect
        this.vortexLines = [];
        for (let i = 0; i < 8; i++) {
            const line = this.scene.add.rectangle(
                this.x, this.y, 2, 30,
                Phaser.Math.RND.pick([0x00FFFF, 0xFF00FF, 0xFFFF00])
            );
            line.setBlendMode(Phaser.BlendModes.ADD);
            line.rotation = (Math.PI * 2 / 8) * i;
            
            this.scene.tweens.add({
                targets: line,
                rotation: line.rotation + Math.PI * 2,
                duration: 2000,
                repeat: -1
            });
            
            this.vortexLines.push(line);
        }
    }
    
    createPortalParticles() {
        // Inner spiral particles
        this.particles = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 30, max: 60 },
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
        
        // Outer glow particles
        this.glowParticles = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 10, max: 30 },
            scale: { start: 2, end: 0 },
            blendMode: 'ADD',
            lifespan: 1500,
            quantity: 1,
            tint: [0x00FFFF, 0xFF00FF],
            alpha: { start: 0.5, end: 0 },
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Circle(0, 0, 50)
            }
        });
    }
    
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        // Update graphics position
        this.updatePortalGraphics();
        
        // Update energy field position
        if (this.energyField) {
            this.energyField.x = this.x;
            this.energyField.y = this.y;
        }
        
        // Update vortex lines
        this.vortexLines.forEach(line => {
            line.x = this.x;
            line.y = this.y;
        });
        
        // Update particles position
        if (this.particles) {
            this.particles.setPosition(this.x, this.y);
        }
        if (this.glowParticles) {
            this.glowParticles.setPosition(this.x, this.y);
        }
        
        // Create occasional spark
        if (Phaser.Math.Between(0, 100) < 5) {
            this.createSpark();
        }
    }
    
    updatePortalGraphics() {
        if (this.graphics) {
            this.graphics.clear();
            
            // Draw multiple rotating rings
            const time = this.scene.time.now / 1000;
            
            // Outer ring
            this.graphics.lineStyle(4, 0x00FFFF, 0.8);
            this.graphics.strokeCircle(this.x, this.y, 40 + Math.sin(time) * 5);
            
            // Middle ring
            this.graphics.lineStyle(3, 0xFF00FF, 0.6);
            this.graphics.strokeCircle(this.x, this.y, 35 + Math.cos(time * 1.5) * 3);
            
            // Inner ring
            this.graphics.lineStyle(2, 0xFFFF00, 0.4);
            this.graphics.strokeCircle(this.x, this.y, 30 + Math.sin(time * 2) * 2);
            
            // Draw energy arcs
            for (let i = 0; i < 4; i++) {
                const startAngle = (Math.PI / 2) * i + time;
                const endAngle = startAngle + Math.PI / 4;
                
                this.graphics.lineStyle(2, 0x00FFFF, 0.5);
                this.graphics.beginPath();
                this.graphics.arc(this.x, this.y, 45, startAngle, endAngle);
                this.graphics.strokePath();
            }
        }
    }
    
    createSpark() {
        const spark = this.scene.add.star(
            this.x + Phaser.Math.Between(-50, 50),
            this.y + Phaser.Math.Between(-50, 50),
            4, 3, 6,
            Phaser.Math.RND.pick([0x00FFFF, 0xFF00FF, 0xFFFF00])
        );
        spark.setScale(0.5);
        spark.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: spark,
            x: this.x,
            y: this.y,
            alpha: { from: 1, to: 0 },
            scale: 0,
            rotation: Math.PI * 2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => spark.destroy()
        });
    }
    
    activate() {
        if (this.isActive) return;
        this.isActive = true;
        
        // Portal activation effect
        this.scene.tweens.add({
            targets: this,
            scale: 3,
            duration: 500,
            yoyo: true,
            onComplete: () => {
                this.scene.cameras.main.flash(500, 255, 255, 255);
                this.createActivationBurst();
            }
        });
        
        // Change colors to show activation
        this.energyField.fillColor = 0x00FF00;
        
        // Increase particle emission
        if (this.particles) {
            this.particles.quantity = 5;
        }
    }
    
    createActivationBurst() {
        // Create expanding rings
        for (let i = 0; i < 3; i++) {
            this.scene.time.delayedCall(i * 100, () => {
                const ring = this.scene.add.circle(this.x, this.y, 20, 0x00FF00, 0);
                ring.setStrokeStyle(4, 0x00FF00);
                ring.setBlendMode(Phaser.BlendModes.ADD);
                
                this.scene.tweens.add({
                    targets: ring,
                    scale: 5,
                    alpha: { from: 1, to: 0 },
                    duration: 800,
                    ease: 'Power2',
                    onComplete: () => ring.destroy()
                });
            });
        }
        
        // Create burst particles
        for (let i = 0; i < 30; i++) {
            const particle = this.scene.add.star(
                this.x, this.y,
                5, 4, 8,
                Phaser.Math.RND.pick([0x00FF00, 0xFFFF00, 0x00FFFF])
            );
            particle.setBlendMode(Phaser.BlendModes.ADD);
            
            const angle = (Math.PI * 2 / 30) * i;
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
                rotation: Math.PI * 2,
                duration: 1500,
                onComplete: () => particle.destroy()
            });
        }
    }
    
    checkEntry(player) {
        if (!this.isActive) return false;
        
        const distance = Phaser.Math.Distance.Between(
            player.x, player.y,
            this.x, this.y
        );
        
        return distance < 50;
    }
    
    destroy() {
        if (this.graphics) this.graphics.destroy();
        if (this.particles) this.particles.destroy();
        if (this.glowParticles) this.glowParticles.destroy();
        if (this.energyField) this.energyField.destroy();
        this.vortexLines.forEach(line => line.destroy());
        super.destroy();
    }
}
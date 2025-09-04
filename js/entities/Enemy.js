class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.enemyType = type;
        this.setupEnemy();
    }
    
    setupEnemy() {
        const enemyData = {
            slime: {
                health: 2,
                speed: 50,
                points: 50,
                color: 0x90EE90,
                scale: 0.8
            },
            mushroom: {
                health: 3,
                speed: 30,
                points: 75,
                color: 0x8B4513,
                scale: 1
            },
            bat: {
                health: 2,
                speed: 100,
                points: 100,
                color: 0x4B0082,
                scale: 0.7,
                flying: true
            },
            golem: {
                health: 5,
                speed: 20,
                points: 150,
                color: 0x8B7355,
                scale: 1.2
            },
            malathor: {
                health: 10,
                speed: 40,
                points: 1000,
                color: 0x4B0082,
                scale: 1.5,
                boss: true
            }
        };
        
        const data = enemyData[this.enemyType];
        this.health = data.health;
        this.maxHealth = data.health;
        this.speed = data.speed;
        this.points = data.points;
        this.setScale(data.scale);
        this.setTint(data.color);
        
        if (data.flying) {
            this.body.setGravityY(-800);
        }
        
        this.createHealthBar();
        this.startMovement();
    }
    
    createHealthBar() {
        this.healthBarBg = this.scene.add.rectangle(
            this.x, this.y - 30, 40, 6, 0x000000
        );
        this.healthBar = this.scene.add.rectangle(
            this.x, this.y - 30, 40, 6, 0xff0000
        );
    }
    
    updateHealthBar() {
        const healthPercent = this.health / this.maxHealth;
        this.healthBar.scaleX = healthPercent;
        this.healthBarBg.x = this.x;
        this.healthBarBg.y = this.y - 30;
        this.healthBar.x = this.x;
        this.healthBar.y = this.y - 30;
    }
    
    startMovement() {
        this.setVelocityX(this.speed);
        this.setBounce(1, 0);
        this.setCollideWorldBounds(true);
        
        // Add floating animation
        this.scene.tweens.add({
            targets: this,
            y: this.y - 10,
            duration: 1500,
            ease: 'Sine.inOut',
            repeat: -1,
            yoyo: true
        });
    }
    
    takeDamage(amount) {
        this.health -= amount;
        this.updateHealthBar();
        
        // Flash red
        this.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
        
        if (this.health <= 0) {
            this.defeat();
        }
    }
    
    defeat() {
        // Death animation
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            rotation: Math.PI * 2,
            duration: 500,
            onComplete: () => {
                this.healthBar.destroy();
                this.healthBarBg.destroy();
                this.destroy();
            }
        });
        
        // Create particles
        for (let i = 0; i < 10; i++) {
            const particle = this.scene.add.circle(
                this.x, this.y, 4, 0xFFD700
            );
            
            this.scene.tweens.add({
                targets: particle,
                x: this.x + Phaser.Math.Between(-50, 50),
                y: this.y + Phaser.Math.Between(-50, 50),
                alpha: 0,
                duration: 800,
                onComplete: () => particle.destroy()
            });
        }
        
        this.scene.enemyDefeated(this);
    }
    
    update() {
        this.updateHealthBar();
    }
}
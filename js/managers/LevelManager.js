class LevelManager {
    constructor(scene) {
        this.scene = scene;
        this.currentLevel = null;
        this.platformGroup = null;
        this.decorations = [];
    }
    
    createLevel(levelConfig) {
        this.currentLevel = levelConfig;
        
        // Create environment
        this.createBackground();
        this.createPlatforms();
        this.createDecorations();
        this.createPowerUps();
        
        // Set world bounds
        this.scene.physics.world.setBounds(0, 0, GameConfig.WORLD_WIDTH, GameConfig.GAME_HEIGHT);
    }
    
    createBackground() {
        const config = this.currentLevel.background;
        
        // Create gradient sky
        const graphics = this.scene.add.graphics();
        graphics.fillGradientStyle(
            config.sky1, config.sky1,
            config.sky2, config.sky2,
            1
        );
        graphics.fillRect(0, 0, GameConfig.WORLD_WIDTH, GameConfig.GAME_HEIGHT);
        
        // Add parallax layers
        this.createParallaxLayers();
        
        // Add ambient particles
        this.createAmbientParticles();
        
        // Level-specific backgrounds
        switch(this.currentLevel.id) {
            case 1:
                this.createForestBackground();
                break;
            case 2:
                this.createCaveBackground();
                break;
            case 3:
                this.createLavaBackground();
                break;
        }
    }
    
    createParallaxLayers() {
        // Far background mountains
        for (let i = 0; i < 5; i++) {
            const mountain = this.scene.add.triangle(
                400 + i * 400,
                GameConfig.GAME_HEIGHT - 100,
                0, 0,
                -200, -300,
                200, -300,
                0x666699, 0.3
            );
            mountain.setScrollFactor(0.3);
        }
        
        // Middle layer hills
        for (let i = 0; i < 8; i++) {
            const hill = this.scene.add.ellipse(
                300 + i * 300,
                GameConfig.GAME_HEIGHT - 80,
                400, 200,
                0x446644, 0.4
            );
            hill.setScrollFactor(0.5);
        }
        
        // Clouds
        for (let i = 0; i < 15; i++) {
            const cloud = this.createCloud(
                Phaser.Math.Between(0, GameConfig.WORLD_WIDTH),
                Phaser.Math.Between(50, 250)
            );
            cloud.setScrollFactor(0.3 + Math.random() * 0.3);
        }
    }
    
    createCloud(x, y) {
        const cloudGroup = this.scene.add.container(x, y);
        
        // Create fluffy cloud shape
        const circles = [];
        for (let i = 0; i < 5; i++) {
            const circle = this.scene.add.ellipse(
                i * 30 - 60,
                Math.sin(i) * 10,
                60 + Math.random() * 40,
                40 + Math.random() * 20,
                0xFFFFFF, 0.3 + Math.random() * 0.2
            );
            circles.push(circle);
            cloudGroup.add(circle);
        }
        
        // Floating animation
        this.scene.tweens.add({
            targets: cloudGroup,
            x: x + Phaser.Math.Between(-50, 50),
            y: y + Phaser.Math.Between(-20, 20),
            duration: 10000 + Math.random() * 10000,
            ease: 'Sine.inOut',
            repeat: -1,
            yoyo: true
        });
        
        return cloudGroup;
    }
    
    createAmbientParticles() {
        // Floating dust/pollen/sparkles
        for (let i = 0; i < 50; i++) {
            const particle = this.scene.add.circle(
                Phaser.Math.Between(0, GameConfig.WORLD_WIDTH),
                Phaser.Math.Between(0, GameConfig.GAME_HEIGHT),
                Phaser.Math.Between(1, 3),
                0xFFFFFF, 0.3
            );
            
            this.scene.tweens.add({
                targets: particle,
                y: particle.y - 100,
                x: particle.x + Phaser.Math.Between(-50, 50),
                alpha: { from: 0.3, to: 0 },
                duration: Phaser.Math.Between(5000, 10000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 5000),
                ease: 'Sine.inOut'
            });
        }
    }
    
    createForestBackground() {
        // Trees
        for (let i = 0; i < 20; i++) {
            const tree = this.createTree(
                Phaser.Math.Between(0, GameConfig.WORLD_WIDTH),
                GameConfig.GAME_HEIGHT - 60
            );
            tree.setScrollFactor(0.7 + Math.random() * 0.2);
        }
        
        // Butterflies
        for (let i = 0; i < 5; i++) {
            this.createButterfly(
                Phaser.Math.Between(200, GameConfig.WORLD_WIDTH - 200),
                Phaser.Math.Between(100, 400)
            );
        }
        
        // Fireflies (if evening)
        if (this.currentLevel.id === 1) {
            for (let i = 0; i < 20; i++) {
                this.createFirefly(
                    Phaser.Math.Between(0, GameConfig.WORLD_WIDTH),
                    Phaser.Math.Between(200, 500)
                );
            }
        }
    }
    
    createTree(x, y) {
        const treeContainer = this.scene.add.container(x, y);
        
        // Trunk
        const trunk = this.scene.add.rectangle(0, 0, 40, 100, 0x8B4513);
        treeContainer.add(trunk);
        
        // Leaves (multiple circles for organic shape)
        const leafColors = [0x228B22, 0x32CD32, 0x00FF00];
        for (let i = 0; i < 5; i++) {
            const leaf = this.scene.add.circle(
                Phaser.Math.Between(-30, 30),
                -50 + Phaser.Math.Between(-30, 0),
                Phaser.Math.Between(30, 50),
                Phaser.Math.RND.pick(leafColors),
                0.8
            );
            treeContainer.add(leaf);
        }
        
        // Sway animation
        this.scene.tweens.add({
            targets: treeContainer,
            angle: { from: -2, to: 2 },
            duration: 3000 + Math.random() * 2000,
            ease: 'Sine.inOut',
            repeat: -1,
            yoyo: true
        });
        
        return treeContainer;
    }
    
    createButterfly(x, y) {
        const butterfly = this.scene.add.container(x, y);
        
        // Body
        const body = this.scene.add.ellipse(0, 0, 4, 12, 0x000000);
        butterfly.add(body);
        
        // Wings
        const leftWing = this.scene.add.ellipse(-8, 0, 16, 20, 
            Phaser.Math.RND.pick([0xFF69B4, 0xFFD700, 0x00CED1]));
        const rightWing = this.scene.add.ellipse(8, 0, 16, 20,
            Phaser.Math.RND.pick([0xFF69B4, 0xFFD700, 0x00CED1]));
        
        butterfly.add([leftWing, rightWing]);
        
        // Wing flap animation
        this.scene.tweens.add({
            targets: [leftWing, rightWing],
            scaleX: { from: 1, to: 0.2 },
            duration: 200,
            repeat: -1,
            yoyo: true
        });
        
        // Flight path
        const path = new Phaser.Curves.Spline([
            x, y,
            x + 100, y - 50,
            x + 200, y,
            x + 100, y + 50,
            x, y
        ]);
        
        const follower = { t: 0 };
        this.scene.tweens.add({
            targets: follower,
            t: 1,
            duration: 10000,
            repeat: -1,
            onUpdate: () => {
                const point = path.getPoint(follower.t);
                butterfly.x = point.x;
                butterfly.y = point.y;
            }
        });
        
        return butterfly;
    }
    
    createFirefly(x, y) {
        const firefly = this.scene.add.circle(x, y, 2, 0xFFFF00);
        firefly.setBlendMode(Phaser.BlendModes.ADD);
        
        // Glow effect
        const glow = this.scene.add.circle(x, y, 8, 0xFFFF00, 0.2);
        glow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Random movement
        this.scene.tweens.add({
            targets: [firefly, glow],
            x: x + Phaser.Math.Between(-100, 100),
            y: y + Phaser.Math.Between(-50, 50),
            duration: Phaser.Math.Between(3000, 6000),
            ease: 'Sine.inOut',
            repeat: -1,
            yoyo: true
        });
        
        // Blinking
        this.scene.tweens.add({
            targets: [firefly, glow],
            alpha: { from: 1, to: 0.2 },
            duration: Phaser.Math.Between(500, 1500),
            repeat: -1,
            yoyo: true
        });
    }
    
    createCaveBackground() {
        // Stalactites and stalagmites
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, GameConfig.WORLD_WIDTH);
            
            // Stalactite (hanging from top)
            const stalactite = this.scene.add.triangle(
                x, 0,
                0, 0,
                -20, 80 + Math.random() * 40,
                20, 80 + Math.random() * 40,
                0x696969
            );
            stalactite.setScrollFactor(0.8);
            
            // Stalagmite (rising from bottom)
            if (Math.random() > 0.5) {
                const stalagmite = this.scene.add.triangle(
                    x + Phaser.Math.Between(-50, 50),
                    GameConfig.GAME_HEIGHT,
                    0, 0,
                    -15, -60 - Math.random() * 30,
                    15, -60 - Math.random() * 30,
                    0x696969
                );
                stalagmite.setScrollFactor(0.8);
            }
        }
        
        // Glowing crystals
        for (let i = 0; i < 10; i++) {
            this.createCrystal(
                Phaser.Math.Between(100, GameConfig.WORLD_WIDTH - 100),
                Phaser.Math.Between(100, GameConfig.GAME_HEIGHT - 200)
            );
        }
        
        // Cave bats
        for (let i = 0; i < 3; i++) {
            this.createBatFlock(
                Phaser.Math.Between(200, GameConfig.WORLD_WIDTH - 200),
                Phaser.Math.Between(50, 200)
            );
        }
    }
    
    createCrystal(x, y) {
        const colors = [0x00FFFF, 0xFF00FF, 0xFFFF00];
        const color = Phaser.Math.RND.pick(colors);
        
        const crystal = this.scene.add.polygon(
            x, y,
            [0, -20, 10, 0, 0, 20, -10, 0],
            color, 0.8
        );
        crystal.setStrokeStyle(2, color);
        
        // Glow effect
        const glow = this.scene.add.circle(x, y, 30, color, 0.2);
        glow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Pulsing animation
        this.scene.tweens.add({
            targets: [crystal, glow],
            alpha: { from: 0.5, to: 1 },
            scale: { from: 0.9, to: 1.1 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.inOut'
        });
    }
    
    createBatFlock(x, y) {
        const bats = [];
        for (let i = 0; i < 5; i++) {
            const bat = this.scene.add.container(
                x + Phaser.Math.Between(-50, 50),
                y + Phaser.Math.Between(-30, 30)
            );
            
            // Simple bat shape
            const body = this.scene.add.ellipse(0, 0, 6, 4, 0x000000);
            const leftWing = this.scene.add.triangle(
                -5, 0,
                0, 0, -10, -3, -10, 3,
                0x000000
            );
            const rightWing = this.scene.add.triangle(
                5, 0,
                0, 0, 10, -3, 10, 3,
                0x000000
            );
            
            bat.add([body, leftWing, rightWing]);
            bats.push(bat);
            
            // Individual movement
            this.scene.tweens.add({
                targets: bat,
                x: bat.x + Phaser.Math.Between(-100, 100),
                y: bat.y + Phaser.Math.Between(-50, 50),
                duration: Phaser.Math.Between(2000, 4000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.inOut'
            });
        }
    }
    
    createLavaBackground() {
        // Lava bubbles
        for (let i = 0; i < GameConfig.WORLD_WIDTH; i += 50) {
            if (Math.random() > 0.7) {
                this.createLavaBubble(i, GameConfig.GAME_HEIGHT - 30);
            }
        }
        
        // Volcanic smoke
        for (let i = 0; i < 5; i++) {
            this.createVolcanicSmoke(
                Phaser.Math.Between(100, GameConfig.WORLD_WIDTH - 100),
                GameConfig.GAME_HEIGHT - 100
            );
        }
        
        // Floating embers
        for (let i = 0; i < 30; i++) {
            this.createEmber(
                Phaser.Math.Between(0, GameConfig.WORLD_WIDTH),
                Phaser.Math.Between(200, GameConfig.GAME_HEIGHT - 100)
            );
        }
    }
    
    createLavaBubble(x, y) {
        const bubble = this.scene.add.circle(x, y, 
            Phaser.Math.Between(5, 15), 0xFF4500, 0.8);
        bubble.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000),
            callback: () => {
                // Bubble pop animation
                this.scene.tweens.add({
                    targets: bubble,
                    y: y - Phaser.Math.Between(50, 150),
                    scale: { from: 1, to: 2 },
                    alpha: { from: 0.8, to: 0 },
                    duration: 1500,
                    ease: 'Power2',
                    onComplete: () => {
                        bubble.y = y;
                        bubble.scale = 1;
                        bubble.alpha = 0.8;
                    }
                });
            },
            loop: true
        });
    }
    
    createVolcanicSmoke(x, y) {
        this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                const smoke = this.scene.add.circle(
                    x + Phaser.Math.Between(-20, 20),
                    y,
                    20,
                    0x333333, 0.5
                );
                
                this.scene.tweens.add({
                    targets: smoke,
                    y: y - 200,
                    scale: 3,
                    alpha: 0,
                    duration: 4000,
                    onComplete: () => smoke.destroy()
                });
            },
            loop: true
        });
    }
    
    createEmber(x, y) {
        const ember = this.scene.add.circle(x, y, 3, 
            Phaser.Math.RND.pick([0xFF4500, 0xFFFF00, 0xFF6600]));
        ember.setBlendMode(Phaser.BlendModes.ADD);
        
        this.scene.tweens.add({
            targets: ember,
            y: y - Phaser.Math.Between(50, 200),
            x: x + Phaser.Math.Between(-100, 100),
            alpha: { from: 1, to: 0 },
            duration: Phaser.Math.Between(3000, 6000),
            repeat: -1,
            delay: Phaser.Math.Between(0, 3000)
        });
    }
    
    createPlatforms() {
        // Main ground
        const ground = this.scene.add.rectangle(
            GameConfig.WORLD_WIDTH / 2,
            GameConfig.GAME_HEIGHT - 30,
            GameConfig.WORLD_WIDTH,
            60,
            0x654321
        );
        this.scene.platforms.add(ground);
        
        // Add grass on top of ground
        this.createGrass();
        
        // Create floating platforms from level config
        if (this.currentLevel.platforms) {
            this.currentLevel.platforms.forEach(platformData => {
                this.createFloatingPlatform(platformData.x, platformData.y);
            });
        }
    }
    
    createGrass() {
        const grassGraphics = this.scene.add.graphics();
        
        for (let i = 0; i < GameConfig.WORLD_WIDTH; i += 5) {
            const height = Phaser.Math.Between(10, 25);
            const color = Phaser.Math.RND.pick([0x90EE90, 0x98FB98, 0x00FF00]);
            
            grassGraphics.fillStyle(color, 0.8);
            grassGraphics.fillTriangle(
                i, GameConfig.GAME_HEIGHT - 60,
                i + 2, GameConfig.GAME_HEIGHT - 60 - height,
                i + 4, GameConfig.GAME_HEIGHT - 60
            );
        }
        
        // Add flowers
        for (let i = 0; i < 30; i++) {
            this.createFlower(
                Phaser.Math.Between(50, GameConfig.WORLD_WIDTH - 50),
                GameConfig.GAME_HEIGHT - 65
            );
        }
    }
    
    createFlower(x, y) {
        const flower = this.scene.add.container(x, y);
        
        // Stem
        const stem = this.scene.add.rectangle(0, 5, 2, 10, 0x00AA00);
        flower.add(stem);
        
        // Petals
        const petalColor = Phaser.Math.RND.pick([0xFF69B4, 0xFFFF00, 0xFF00FF, 0xFFA500]);
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i;
            const petal = this.scene.add.ellipse(
                Math.cos(angle) * 5,
                Math.sin(angle) * 5 - 5,
                8, 12,
                petalColor
            );
            petal.rotation = angle;
            flower.add(petal);
        }
        
        // Center
        const center = this.scene.add.circle(0, -5, 3, 0xFFFF00);
        flower.add(center);
        
        // Sway animation
        this.scene.tweens.add({
            targets: flower,
            angle: { from: -5, to: 5 },
            duration: 2000 + Math.random() * 1000,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.inOut'
        });
    }
    
    createFloatingPlatform(x, y) {
        const platform = this.scene.add.container(x, y);
        
        // Platform base
        const base = this.scene.add.rectangle(0, 0, 150, 20, 0x8B4513);
        base.setStrokeStyle(2, 0x654321);
        platform.add(base);
        
        // Add physics body
        this.scene.physics.add.existing(base, true);
        this.scene.platforms.add(base);
        
        // Decorative elements
        const decoration = Phaser.Math.RND.pick(['moss', 'vines', 'crystals']);
        switch(decoration) {
            case 'moss':
                const moss = this.scene.add.ellipse(0, -10, 140, 8, 0x90EE90, 0.5);
                platform.add(moss);
                break;
            case 'vines':
                for (let i = 0; i < 3; i++) {
                    const vine = this.scene.add.rectangle(
                        -50 + i * 50, 10, 2, 30, 0x228B22
                    );
                    platform.add(vine);
                }
                break;
            case 'crystals':
                const crystal = this.scene.add.polygon(
                    0, -15,
                    [0, -10, 5, 0, 0, 10, -5, 0],
                    0x00FFFF, 0.6
                );
                platform.add(crystal);
                break;
        }
        
        // Floating animation
        this.scene.tweens.add({
            targets: platform,
            y: y - 10,
            duration: 2000 + Math.random() * 1000,
            ease: 'Sine.inOut',
            repeat: -1,
            yoyo: true
        });
        
        // Store platform for collision
        platform.physicsBody = base;
        return platform;
    }
    
    createDecorations() {
        // Level-specific decorations
        switch(this.currentLevel.id) {
            case 1:
                this.createForestDecorations();
                break;
            case 2:
                this.createCaveDecorations();
                break;
            case 3:
                this.createLavaDecorations();
                break;
        }
    }
    
    createForestDecorations() {
        // Mushrooms
        for (let i = 0; i < 10; i++) {
            const mushroom = this.scene.add.container(
                Phaser.Math.Between(100, GameConfig.WORLD_WIDTH - 100),
                GameConfig.GAME_HEIGHT - 70
            );
            
            const stem = this.scene.add.ellipse(0, 5, 15, 20, 0xF5DEB3);
            const cap = this.scene.add.ellipse(0, -5, 30, 20, 0xFF0000);
            const spots = [];
            for (let j = 0; j < 3; j++) {
                spots.push(this.scene.add.circle(
                    Phaser.Math.Between(-10, 10),
                    -5,
                    3,
                    0xFFFFFF
                ));
            }
            
            mushroom.add([stem, cap, ...spots]);
            mushroom.setScale(0.5 + Math.random() * 0.5);
        }
        
        // Bushes
        for (let i = 0; i < 8; i++) {
            const bush = this.scene.add.ellipse(
                Phaser.Math.Between(100, GameConfig.WORLD_WIDTH - 100),
                GameConfig.GAME_HEIGHT - 70,
                60 + Math.random() * 40,
                40 + Math.random() * 20,
                0x228B22, 0.8
            );
        }
    }
    
    createCaveDecorations() {
        // Rock formations
        for (let i = 0; i < 12; i++) {
            const rock = this.scene.add.polygon(
                Phaser.Math.Between(100, GameConfig.WORLD_WIDTH - 100),
                GameConfig.GAME_HEIGHT - 65,
                [0, 0, 20, -10, 25, 5, 10, 10, -5, 8],
                0x696969
            );
            rock.setScale(0.8 + Math.random() * 0.6);
        }
    }
    
    createLavaDecorations() {
        // Charred rocks
        for (let i = 0; i < 10; i++) {
            const rock = this.scene.add.polygon(
                Phaser.Math.Between(100, GameConfig.WORLD_WIDTH - 100),
                GameConfig.GAME_HEIGHT - 65,
                [0, 0, 15, -8, 20, 3, 8, 8, -3, 6],
                0x333333
            );
            rock.setScale(0.8 + Math.random() * 0.6);
        }
    }
    
    createPowerUps() {
        if (!this.currentLevel.powerUps) return;
        
        this.currentLevel.powerUps.forEach(powerUpData => {
            this.createPowerUp(powerUpData.x, powerUpData.y, powerUpData.type);
        });
    }
    
    createPowerUp(x, y, type) {
        const config = GameConfig.POWERUP_CONFIG[type];
        const powerUp = this.scene.add.container(x, y);
        
        // Create visual based on type
        let visual;
        switch(type) {
            case 'health':
                visual = this.scene.add.text(0, 0, '❤️', { fontSize: '32px' });
                break;
            case 'mana':
                visual = this.scene.add.star(0, 0, 5, 8, 16, 0x0000FF);
                break;
            case 'speed':
                visual = this.scene.add.text(0, 0, '⚡', { fontSize: '32px' });
                break;
            case 'shield':
                visual = this.scene.add.text(0, 0, '🛡️', { fontSize: '32px' });
                break;
            case 'doubleJump':
                visual = this.scene.add.text(0, 0, '🦘', { fontSize: '32px' });
                break;
        }
        
        if (visual) {
            powerUp.add(visual);
            
            // Add physics
            this.scene.physics.add.existing(powerUp);
            powerUp.body.setAllowGravity(false);
            
            // Floating animation
            this.scene.tweens.add({
                targets: powerUp,
                y: y - 10,
                duration: 1500,
                ease: 'Sine.inOut',
                repeat: -1,
                yoyo: true
            });
            
            // Rotation
            this.scene.tweens.add({
                targets: visual,
                rotation: Math.PI * 2,
                duration: 3000,
                repeat: -1
            });
            
            // Glow effect
            const glow = this.scene.add.circle(0, 0, 25, config.color, 0.3);
            glow.setBlendMode(Phaser.BlendModes.ADD);
            powerUp.add(glow);
            powerUp.sendToBack(glow);
            
            // Pulsing glow
            this.scene.tweens.add({
                targets: glow,
                scale: { from: 1, to: 1.5 },
                alpha: { from: 0.3, to: 0.1 },
                duration: 1000,
                repeat: -1,
                yoyo: true
            });
            
            // Store config for collection
            powerUp.powerUpType = type;
            powerUp.config = config;
            
            // Add to power-ups group
            if (this.scene.powerUps) {
                this.scene.powerUps.add(powerUp);
            }
        }
        
        return powerUp;
    }
    
    createEnemies(enemyConfigs) {
        enemyConfigs.forEach(config => {
            for (let i = 0; i < config.count; i++) {
                const x = 400 + (i * 300) + Phaser.Math.Between(-50, 50);
                const y = 400;
                
                // Create enemy with delay for dramatic entrance
                this.scene.time.delayedCall(i * 200, () => {
                    const enemy = new Enemy(this.scene, x, y - 100, config.type);
                    
                    // Entrance animation
                    enemy.alpha = 0;
                    enemy.scale = 0;
                    
                    this.scene.tweens.add({
                        targets: enemy,
                        alpha: 1,
                        scale: GameConfig.ENEMY_CONFIG[config.type].scale,
                        y: y,
                        duration: 500,
                        ease: 'Bounce.out'
                    });
                });
            }
        });
    }
    
    canEnterPortal() {
        return this.scene.enemies.countActive() === 0;
    }
}
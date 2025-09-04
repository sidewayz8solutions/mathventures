const GameConfig = {
    // Game settings
    GAME_WIDTH: 1280,
    GAME_HEIGHT: 720,
    WORLD_WIDTH: 2400,
    
    // Player settings
    PLAYER_SPEED: 250,
    PLAYER_JUMP: 600,
    PLAYER_HEALTH: 5,
    PLAYER_MANA: 5,
    
    // Level configurations
    LEVELS: [
        {
            id: 1,
            name: "Enchanted Forest",
            background: { sky1: 0x87CEEB, sky2: 0x98FB98 },
            enemies: [
                { type: 'slime', count: 3, health: 2 },
                { type: 'mushroom', count: 2, health: 3 }
            ],
            platforms: [
                { x: 400, y: 500 },
                { x: 700, y: 400 },
                { x: 1000, y: 450 },
                { x: 1300, y: 350 },
                { x: 1600, y: 400 },
                { x: 1900, y: 300 }
            ],
            powerUps: [
                { x: 800, y: 350, type: 'health' },
                { x: 1400, y: 300, type: 'mana' }
            ]
        },
        {
            id: 2,
            name: "Crystal Caves",
            background: { sky1: 0x483D8B, sky2: 0x6A5ACD },
            enemies: [
                { type: 'bat', count: 4, health: 3 },
                { type: 'golem', count: 3, health: 4 }
            ],
            platforms: [
                { x: 450, y: 480 },
                { x: 750, y: 380 },
                { x: 1050, y: 420 },
                { x: 1350, y: 320 },
                { x: 1650, y: 380 },
                { x: 1950, y: 280 }
            ],
            powerUps: [
                { x: 900, y: 330, type: 'speed' },
                { x: 1500, y: 270, type: 'shield' }
            ]
        },
        {
            id: 3,
            name: "Dragon's Lair",
            background: { sky1: 0x8B0000, sky2: 0xFF4500 },
            enemies: [
                { type: 'dragon', count: 1, health: 10 },
                { type: 'bat', count: 3, health: 2 }
            ],
            platforms: [
                { x: 400, y: 500 },
                { x: 700, y: 450 },
                { x: 1000, y: 400 },
                { x: 1300, y: 350 },
                { x: 1600, y: 300 },
                { x: 1900, y: 250 }
            ],
            powerUps: [
                { x: 850, y: 400, type: 'health' },
                { x: 1150, y: 350, type: 'mana' },
                { x: 1450, y: 300, type: 'doubleJump' }
            ]
        }
    ],
    
    // Math problems difficulty
    MATH_CONFIG: {
        1: { 
            min: 1, 
            max: 20, 
            operations: ['add', 'subtract'],
            timeLimit: 30,
            bonusPoints: 100
        },
        2: { 
            min: 5, 
            max: 50, 
            operations: ['add', 'subtract', 'multiply'],
            timeLimit: 25,
            bonusPoints: 150
        },
        3: { 
            min: 10, 
            max: 100, 
            operations: ['all'],
            timeLimit: 20,
            bonusPoints: 200
        }
    },
    
    // Enemy configurations
    ENEMY_CONFIG: {
        slime: {
            health: 2,
            speed: 80,
            points: 50,
            color: 0x00FF00,
            scale: 1.2,
            bounceHeight: 300,
            aiPattern: 'patrol'
        },
        mushroom: {
            health: 3,
            speed: 60,
            points: 75,
            color: 0xFF6347,
            scale: 1.5,
            aiPattern: 'guard'
        },
        bat: {
            health: 2,
            speed: 120,
            points: 100,
            color: 0x8A2BE2,
            scale: 1,
            flying: true,
            aiPattern: 'swoop'
        },
        golem: {
            health: 5,
            speed: 40,
            points: 150,
            color: 0x8B4513,
            scale: 2,
            aiPattern: 'charge'
        },
        dragon: {
            health: 10,
            speed: 100,
            points: 1000,
            color: 0xFF4500,
            scale: 2.5,
            boss: true,
            aiPattern: 'boss'
        }
    },
    
    // Power-up configurations
    POWERUP_CONFIG: {
        health: {
            color: 0xFF0000,
            effect: 'heal',
            value: 1,
            duration: 0
        },
        mana: {
            color: 0x0000FF,
            effect: 'restoreMana',
            value: 2,
            duration: 0
        },
        speed: {
            color: 0x00FF00,
            effect: 'speedBoost',
            value: 1.5,
            duration: 5000
        },
        shield: {
            color: 0xFFD700,
            effect: 'invulnerability',
            value: 1,
            duration: 3000
        },
        doubleJump: {
            color: 0xFF00FF,
            effect: 'doubleJump',
            value: 1,
            duration: 10000
        }
    },
    
    // Achievement thresholds
    ACHIEVEMENTS: {
        mathWhiz: { requirement: 10, description: 'Solve 10 math problems correctly' },
        speedster: { requirement: 5, description: 'Complete a level in under 2 minutes' },
        perfectionist: { requirement: 1, description: 'Complete a level without taking damage' },
        collector: { requirement: 20, description: 'Collect 20 power-ups' },
        dragonSlayer: { requirement: 1, description: 'Defeat the dragon boss' }
    }
};

// Make it available globally
window.GameConfig = GameConfig;
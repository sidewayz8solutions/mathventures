const GameConfig = {
    // Game settings
    GAME_WIDTH: 1200,
    GAME_HEIGHT: 600,
    WORLD_WIDTH: 2400,
    
    // Player settings
    PLAYER_SPEED: 200,
    PLAYER_JUMP: 500,
    PLAYER_HEALTH: 5,
    
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
                { x: 400, y: 400 },
                { x: 700, y: 350 },
                { x: 1000, y: 300 }
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
                { x: 450, y: 380 },
                { x: 750, y: 320 },
                { x: 1050, y: 280 }
            ]
        },
        // ... more levels
    ],
    
    // Math problems difficulty
    MATH_CONFIG: {
        1: { min: 10, max: 50, operations: ['add', 'subtract'] },
        2: { min: 20, max: 100, operations: ['add', 'subtract', 'multiply'] },
        3: { min: 30, max: 150, operations: ['all'] }
    }
};
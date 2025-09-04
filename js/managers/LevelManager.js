
class LevelManager {
    constructor() {
        this.levels = [
            {
                level: 1,
                name: "Whispering Woods",
                tilemapKey: 'level1',
                tilesetName: 'world-tiles',
                tilesetImageKey: 'tiles',
                backgroundKey: 'bg1',
                enemyType: 'goblin',
                enemyPositions: [{ x: 800, y: 500 }, { x: 1500, y: 500 }, { x: 2200, y: 300 }],
                portalPosition: { x: 2800, y: 450 },
                math: {
                    type: 'addition',
                    range: [1, 20]
                }
            },
            {
                level: 2,
                name: "Crystal Caves",
                tilemapKey: 'level2',
                tilesetName: 'world-tiles',
                tilesetImageKey: 'tiles',
                backgroundKey: 'bg2',
                enemyType: 'bat',
                enemyPositions: [{ x: 700, y: 300 }, { x: 1400, y: 400 }, { x: 2100, y: 500 }],
                portalPosition: { x: 2900, y: 450 },
                math: {
                    type: 'subtraction',
                    range: [10, 50]
                }
            },
            {
                level: 3,
                name: "Sorcerer's Stronghold",
                tilemapKey: 'level3',
                tilesetName: 'world-tiles',
                tilesetImageKey: 'tiles',
                backgroundKey: 'bg3',
                enemyType: 'golem',
                enemyPositions: [{ x: 900, y: 500 }, { x: 1800, y: 400 }],
                boss: {
                    type: 'sorcerer',
                    position: { x: 2500, y: 300 }
                },
                portalPosition: { x: 3000, y: 450 },
                math: {
                    type: 'multiplication',
                    range: [2, 10]
                }
            }
        ];
    }

    getCurrentLevel(levelNumber) {
        return this.levels.find(level => level.level === levelNumber);
    }

    getAllLevels() {
        return this.levels;
    }
}

import { Scene } from 'phaser';
import { Player } from '../objects/Player';

export class LevelOneScene extends Scene {
    private player: Player;

    constructor() {
        super('LevelOneScene');
    }

    create() {
        const map = this.make.tilemap({ key: 'map_level1' });

        const terrainTileset = map.addTilesetImage('tileset', 'tileset_terrain');
        const objectTileset = map.addTilesetImage('objects', 'tileset_objects');

        if (terrainTileset) {
            map.createLayer('grass', terrainTileset);
            map.createLayer('ground', terrainTileset);
            map.createLayer('lake', terrainTileset);
        } else {
            console.warn('Terrain tileset not found');
        }

        if (objectTileset) {
            map.createLayer('flowers', objectTileset);
            map.createLayer('house', objectTileset);
            map.createLayer('decorations', objectTileset);
        } else {
            console.warn('Object tileset not found');
        }

        let wallsLayer;
        if (terrainTileset) {
            wallsLayer = map.createLayer('walls', terrainTileset);
        } else {
            console.warn('Terrain tileset not found for walls layer');
        }

        if (wallsLayer) {
            wallsLayer.setCollisionByProperty({ collider: true });
        } else {
            console.warn('wallsLayer is null or undefined, cannot set collision.');
        }

        const playerSpawn = map.findObject('player', obj => obj.name === 'spawning point');
        if (playerSpawn && typeof playerSpawn.x === 'number' && typeof playerSpawn.y === 'number') {
            this.player = new Player(this, playerSpawn.x, playerSpawn.y);
        } else {
            throw new Error("Player spawn point not found or coordinates are invalid.");
        }

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        this.cameras.main.setZoom(2.5);

        if (wallsLayer) {
            this.physics.add.collider(this.player, wallsLayer);
        }
    }

    update() {
        if (this.player) {
            this.player.update();
        }
    }
}
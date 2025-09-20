import { Scene } from 'phaser';
import { Player } from '../objects/Player';
import { Slime } from '../objects/Slime';
import { GameProgress } from '../utils/GameProgress';

export class LevelOneScene extends Scene {
    private player: Player;
    private slimes: Phaser.Physics.Arcade.Group;

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

        this.slimes = this.physics.add.group({
            classType: Slime,
            runChildUpdate: true
        });

        const enemysLayer = map.getObjectLayer('enemys');
        if (enemysLayer && enemysLayer.objects) {
            enemysLayer.objects.forEach(spawn => {
                if (spawn.x && spawn.y) {
                    const slime = new Slime(this, spawn.x, spawn.y, this.player);
                    this.slimes.add(slime);
                }
            });
        } else {
            console.warn("Enemy spawn layer not found or has no objects.");
        }

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(2.5);

        if (wallsLayer) {
            this.physics.add.collider(this.player, wallsLayer);
            this.physics.add.collider(this.slimes, wallsLayer);
        }

        this.physics.add.collider(this.player, this.slimes, (player, slime) => {
            (player as Player).takeDamage(1);
        });

        this.scene.launch('UIScene');
        this.scene.bringToTop('UIScene');
    }

    public getSlimesGroup(): Phaser.Physics.Arcade.Group {
        return this.slimes;
    }

    update() {
        if (this.player) {
            this.player.update();
        }

        if (this.slimes.countActive(true) === 0) {
            this.winLevel();
        }
    }

    private winLevel(): void {
        if (this.scene.isActive()) { 
            console.log('Fase 1 Vencida!');
            this.scene.stop('UIScene'); 
            GameProgress.unlockNextLevel(1);
            this.scene.start('LevelSelectScene');
        }
    }
}
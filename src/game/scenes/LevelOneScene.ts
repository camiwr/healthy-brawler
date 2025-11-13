import { Scene, Physics, Tilemaps } from 'phaser'; // <-- Importe o 'Tilemaps'
import { Player } from '../objects/Player';
import { Slime } from '../objects/Slime';
import { GameProgress } from '../utils/GameProgress';
import { Projectile } from '../objects/Projectile';
import { Collectible } from '../objects/Collectible';

export class LevelOneScene extends Scene {
    private player: Player;
    private slimes: Physics.Arcade.Group;
    private projectiles: Physics.Arcade.Group;
    private collectibles: Physics.Arcade.Group;

    // Lista de frutas que podemos "dropar"
    private fruitList = [
        { texture: 'collect_apple', anim: 'apple-spin' },
        { texture: 'collect_banana', anim: 'banana-spin' },
        { texture: 'collect_cherry', anim: 'cherry-spin' },
        { texture: 'collect_kiwi', anim: 'kiwi-spin' },
        { texture: 'collect_melon', anim: 'melon-spin' },
        { texture: 'collect_orange', anim: 'orange-spin' },
        { texture: 'collect_pineapple', anim: 'pineapple-spin' },
    ];

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
        }
        if (objectTileset) {
            map.createLayer('flowers', objectTileset);
            map.createLayer('house', objectTileset);
            map.createLayer('decorations', objectTileset);
        }
        let wallsLayer;
        if (terrainTileset) {
            wallsLayer = map.createLayer('walls', terrainTileset);
        }
        if (wallsLayer) {
            wallsLayer.setCollisionByProperty({ collider: true });
        }

        // --- CRIAR GRUPO DE PROJÉTEIS ---
        this.projectiles = this.physics.add.group({
            classType: Projectile,
            runChildUpdate: true,
            createCallback: (proj) => {
                (proj as Projectile).setActive(false).setVisible(false);
            }
        });

        // --- CRIAR GRUPO DE COLETÁVEIS ---
        this.collectibles = this.physics.add.group({
            classType: Collectible,
            runChildUpdate: true 
        });

        // --- CRIAR PLAYER ---
        const playerSpawn = map.findObject('player', obj => obj.name === 'spawning point');
        if (playerSpawn && typeof playerSpawn.x === 'number' && typeof playerSpawn.y === 'number') {
            this.player = new Player(this, playerSpawn.x, playerSpawn.y);
        } else {
            console.error("Ponto de spawn 'spawning point' do 'player' não encontrado no Tiled map.");
            this.player = new Player(this, 100, 100); // Posição de fallback
        }

        // --- CRIAR SLIMES ---
        this.slimes = this.physics.add.group({ classType: Slime, runChildUpdate: true });
        const enemysLayer = map.getObjectLayer('enemys');
        if (enemysLayer && enemysLayer.objects) {
            enemysLayer.objects.forEach(spawn => {
                if (spawn.x && spawn.y) {
                    this.slimes.add(new Slime(this, spawn.x, spawn.y, this.player));
                }
            });
        }
        
        // --- CRIAR AS FRUTAS DO MAPA ---
        const fruitLayer = map.getObjectLayer('dropFruit');
        if (fruitLayer && fruitLayer.objects) {
            fruitLayer.objects.forEach(fruitSpawn => {
                if (fruitSpawn.type === 'fruit' && fruitSpawn.x && fruitSpawn.y) {
                    const randomFruit = Phaser.Utils.Array.GetRandom(this.fruitList);
                    this.collectibles.add(
                        new Collectible(
                            this, 
                            fruitSpawn.x, 
                            fruitSpawn.y, 
                            randomFruit.texture, 
                            randomFruit.anim, 
                            'HEALTH' 
                        )
                    );
                }
            });
        }

        // --- CÂMERA E FÍSICA ---
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(2.5);

        // --- ADICIONAR COLISÕES ---
        if (wallsLayer) {
            this.physics.add.collider(this.player, wallsLayer);
            this.physics.add.collider(this.slimes, wallsLayer);
            
            // CORREÇÃO: A linha abaixo agora usa a função correta
            this.physics.add.collider(this.projectiles, wallsLayer, this.handleProjectileHitWall, undefined, this);
        }

        this.physics.add.collider(this.player, this.slimes, this.handlePlayerHitSlime, undefined, this);
        
        this.physics.add.overlap(this.projectiles, this.slimes, this.handleProjectileHitSlime, undefined, this);
        
        // CORREÇÃO: A linha abaixo agora usa a função correta
        this.physics.add.overlap(this.player, this.collectibles, this.handleCollectItem, undefined, this);

        // --- UI ---
        this.scene.launch('UIScene', { parentSceneKey: this.scene.key });
        this.scene.bringToTop('UIScene');
    }

    // --- MÉTODOS DE COLISÃO (COM TIPOS CORRIGIDOS) ---

    private handleProjectileHitWall(object1: any, object2: any) {
        const proj = object1 as Projectile;
        if (proj && typeof proj.hit === 'function') {
            proj.hit();
        }
    }

    private handlePlayerHitSlime(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Tilemaps.Tile, 
        slime: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Tilemaps.Tile
    ) {
        (player as Player).takeDamage(1);
    }

    private handleProjectileHitSlime(
        proj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Tilemaps.Tile, 
        slime: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Tilemaps.Tile
    ) {
        if ((slime as Slime).active) {
            (proj as Projectile).hit();
            (slime as Slime).takeDamage(1);
        }
    }
    
    private handleCollectItem(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Tilemaps.Tile, 
        item: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Tilemaps.Tile
    ) {
        const collectible = item as Collectible;
        const playerObj = player as Player;
        const itemType = collectible.collect();
        
        if (itemType === 'HEALTH') {
            playerObj.gainHealth(1); // Cura 1 coração
        }
    }
    // --- FIM DOS MÉTODOS DE COLISÃO ---


    // --- GETTERS ---
    public getProjectilesGroup(): Phaser.Physics.Arcade.Group {
        return this.projectiles;
    }
    public getSlimesGroup(): Phaser.Physics.Arcade.Group {
        return this.slimes;
    }

    // --- UPDATE & WIN ---
    update() {
        if (this.player && this.player.active) { 
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
            
            this.scene.pause(); 
            
            this.scene.launch('VictoryScene', { 
                parentSceneKey: this.scene.key, 
                nextSceneKey: 'LevelTwoScene'  
            });
        }
    }
}

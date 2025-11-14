import { Scene, Physics, Tilemaps } from 'phaser';
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
    private map: Tilemaps.Tilemap;

    private fruitList = [
        { texture: 'collect_apple', anim: 'apple-spin' },
        { texture: 'collect_banana', anim: 'banana-spin' },
        { texture: 'collect_cherry', anim: 'cherry-spin' },
        { texture: 'collect_orange', anim: 'orange-spin' },
        { texture: 'collect_pineapple', anim: 'pineapple-spin' },
    ];

    constructor() {
        super('LevelOneScene');
    }

    create() {
        this.map = this.make.tilemap({ key: 'map_level1' });

        const terrainTileset = this.map.addTilesetImage('tileset', 'tileset_terrain');
        const objectTileset = this.map.addTilesetImage('objects', 'tileset_objects');

        if (terrainTileset) {
            this.map.createLayer('grass', terrainTileset);
            this.map.createLayer('ground', terrainTileset);
            this.map.createLayer('lake', terrainTileset);
        }
        if (objectTileset) {
            this.map.createLayer('flowers', objectTileset);
            this.map.createLayer('house', objectTileset);
            this.map.createLayer('decorations', objectTileset);
        }
        let wallsLayer;
        if (terrainTileset) {
            wallsLayer = this.map.createLayer('walls', terrainTileset);
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

        // --- CRIAR PLAYER--
        const playerSpawn = this.map.findObject('player', obj => obj.name === 'spawning point');
        if (playerSpawn && typeof playerSpawn.x === 'number' && typeof playerSpawn.y === 'number') {
            // --- 1. Passando o grupo de projéteis para o construtor ---
            this.player = new Player(this, playerSpawn.x, playerSpawn.y, this.projectiles);
        } else {
            console.error("Ponto de spawn 'spawning point' do 'player' não encontrado no Tiled map.");
            // --- 1. Passando o grupo de projéteis para o construtor (fallback) ---
            this.player = new Player(this, 100, 100, this.projectiles); 
        }

        // --- CRIAR SLIMES ---
        this.slimes = this.physics.add.group({ classType: Slime, runChildUpdate: true });
        const enemysLayer = this.map.getObjectLayer('enemys');
        if (enemysLayer && enemysLayer.objects) {
            enemysLayer.objects.forEach(spawn => {
                if (spawn.x && spawn.y) {
                    this.slimes.add(new Slime(this, spawn.x, spawn.y, this.player));
                }
            });
        }
        
        // --- CRIAR AS FRUTAS DO MAPA ---
        const fruitLayer = this.map.getObjectLayer('dropFruit');
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
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(2.5);

        // --- ADICIONAR COLISÕES ---
        if (wallsLayer) {
            this.physics.add.collider(this.player, wallsLayer);
            this.physics.add.collider(this.slimes, wallsLayer);
            this.physics.add.collider(this.projectiles, wallsLayer, this.handleProjectileHitWall, undefined, this);
        }

        this.physics.add.collider(this.player, this.slimes, this.handlePlayerHitSlime, undefined, this);
        this.physics.add.overlap(this.projectiles, this.slimes, this.handleProjectileHitSlime, undefined, this);
        this.physics.add.overlap(this.player, this.collectibles, this.handleCollectItem, undefined, this);

        // --- UI ---
        this.scene.launch('UIScene', { parentSceneKey: this.scene.key });
        this.scene.bringToTop('UIScene');
    }

    // --- MÉTODOS DE COLISÃO ---

    private handleProjectileHitWall(object1: any, _object2: any) {
        const proj = object1 as Projectile;
        if (proj && typeof proj.hit === 'function') {
            proj.hit();
        }
    }

    private handlePlayerHitSlime(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Tilemaps.Tile, 
        _slime: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Tilemaps.Tile
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
            playerObj.gainHealth(1);
        }

        collectible.destroy();
    }
    
    // Este método ainda pode ser útil se a UIScene ou outra cena precisar dele
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
        console.log('Método winLevel chamado. Verificando condições para desbloquear próximo nível.');
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
import { Scene, Physics, Tilemaps } from 'phaser';
import { Player } from '../objects/Player';
import { Slime } from '../objects/Slime';
import { GameProgress } from '../utils/GameProgress';
import { Projectile } from '../objects/Projectile';
import { Collectible } from '../objects/Collectible';

// 1. MUDAR O NOME DA CLASSE
export class LevelTwoScene extends Scene {
    private player: Player;
    private slimes: Physics.Arcade.Group;
    private projectiles: Physics.Arcade.Group;
    private collectibles: Physics.Arcade.Group;
    private map: Tilemaps.Tilemap;

    // Lista de frutas (igual à Fase 1)
    private fruitList = [
        { texture: 'collect_apple', anim: 'apple-spin' },
        { texture: 'collect_banana', anim: 'banana-spin' },
        { texture: 'collect_cherry', anim: 'cherry-spin' },
        { texture: 'collect_orange', anim: 'orange-spin' },
        { texture: 'collect_pineapple', anim: 'pineapple-spin' },
    ];

    constructor() {
        super('LevelTwoScene');
    }

    create() {
        // --- 3. CARREGAR O MAPA 'map_level2' ---
        this.map = this.make.tilemap({ key: 'map_level2' });

        // --- 4. CARREGAR OS TILESETS DA FASE 2 ---
        // (Nomes vêm do Preloader)
        const grassTileset = this.map.addTilesetImage('TX Tileset Grass', 'tileset_grass_l2');
        const objectTileset = this.map.addTilesetImage('objects-new', 'tileset_objects_l2');

        let wallsLayer;

        // --- 5. CRIAR CAMADAS CONFORME A SUA INSTRUÇÃO ---
        
        // Camadas do 'TX Tileset Grass'
        if (grassTileset) {
            this.map.createLayer('grass', grassTileset);
            this.map.createLayer('blocs', grassTileset);
        }
        
        // Camadas do 'objects-new'
        if (objectTileset) {
            wallsLayer = this.map.createLayer('wall', objectTileset); // A colisão
            this.map.createLayer('holse', objectTileset);
            this.map.createLayer('objects', objectTileset);
            this.map.createLayer('threes', objectTileset);
        }
        // --- FIM DA CRIAÇÃO DE CAMADAS ---
        
        if (wallsLayer) {
            // 6. ATIVAR A COLISÃO (lendo a propriedade 'collider' do Tiled)
            wallsLayer.setCollisionByProperty({ collider: true });
        } else {
            console.error("A camada 'wall' não foi carregada. Verifique o nome.");
        }

        // --- 7. CRIAR GRUPOS (Igual à Fase 1) ---
        this.projectiles = this.physics.add.group({
            classType: Projectile,
            runChildUpdate: true,
            createCallback: (proj) => {
                (proj as Projectile).setActive(false).setVisible(false);
            }
        });

        this.collectibles = this.physics.add.group({
            classType: Collectible,
            runChildUpdate: true 
        });

        // --- 8. CRIAR PLAYER (Igual à Fase 1, lendo do 'level2.json') ---
        const playerSpawn = this.map.findObject('spawning point', obj => obj.name === 'spawning point');
        if (playerSpawn && typeof playerSpawn.x === 'number' && typeof playerSpawn.y === 'number') {
            this.player = new Player(this, playerSpawn.x, playerSpawn.y);
        } else {
            console.error("Ponto de spawn 'spawning point' não encontrado no Tiled map.");
            this.player = new Player(this, 100, 100); // Posição de fallback
        }

        // --- 9. CRIAR SLIMES (Igual à Fase 1, lendo do 'level2.json') ---
        this.slimes = this.physics.add.group({ classType: Slime, runChildUpdate: true });
        const enemysLayer = this.map.getObjectLayer('enemy');
        if (enemysLayer && enemysLayer.objects) {
            enemysLayer.objects.forEach(spawn => {
                if (spawn.x && spawn.y) {
                    this.slimes.add(new Slime(this, spawn.x, spawn.y, this.player));
                }
            });
        }
        
        // --- 10. CRIAR FRUTAS (Igual à Fase 1, lendo do 'level2.json') ---
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

        // --- 11. CÂMERA E FÍSICA (Igual à Fase 1) ---
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(2.5);

        // --- 12. ADICIONAR COLISÕES (Igual à Fase 1) ---
        if (wallsLayer) {
            this.physics.add.collider(this.player, wallsLayer);
            this.physics.add.collider(this.slimes, wallsLayer);
            this.physics.add.collider(this.projectiles, wallsLayer, this.handleProjectileHitWall, undefined, this);
        }
        this.physics.add.collider(this.player, this.slimes, this.handlePlayerHitSlime, undefined, this);
        this.physics.add.overlap(this.projectiles, this.slimes, this.handleProjectileHitSlime, undefined, this);
        this.physics.add.overlap(this.player, this.collectibles, this.handleCollectItem, undefined, this);

        // --- 13. UI (Igual à Fase 1) ---
        this.scene.launch('UIScene', { parentSceneKey: this.scene.key });
        this.scene.bringToTop('UIScene');
    }

    // --- MÉTODOS DE COLISÃO (CÓPIA DA FASE 1) ---

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
            playerObj.gainHealth(1);
        }
    }
    // --- FIM DOS MÉTODOS DE COLISÃO ---


    // --- GETTERS (CÓPIA DA FASE 1) ---
    public getProjectilesGroup(): Phaser.Physics.Arcade.Group {
        return this.projectiles;
    }
    public getSlimesGroup(): Phaser.Physics.Arcade.Group {
        return this.slimes;
    }

    // --- UPDATE (CÓPIA DA FASE 1) ---
    update() {
        if (this.player && this.player.active) { 
            this.player.update();
        }

        if (this.slimes.countActive(true) === 0) {
            this.winLevel();
        }
    }

    // --- 14. MÉTODO WIN (AJUSTADO PARA A FASE 2) ---
    private winLevel(): void {
        if (this.scene.isActive()) { 
            console.log('Fase 2 Vencida!');
            
            this.scene.stop('UIScene');
            GameProgress.unlockNextLevel(2); // <-- MUDAR NÍVEL PARA 2
            
            this.scene.pause(); 
            
            this.scene.launch('VictoryScene', { 
                parentSceneKey: this.scene.key, 
                nextSceneKey: 'LevelThreeScene'  // <-- MUDAR PARA A PRÓXIMA FASE
            });
        }
    }
}
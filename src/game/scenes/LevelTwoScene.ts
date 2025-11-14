import { Scene, Physics, Tilemaps } from 'phaser';
import { Player } from '../objects/Player';
import { Slime } from '../objects/Slime';
import { GameProgress } from '../utils/GameProgress';
import { Projectile } from '../objects/Projectile';
import { Collectible } from '../objects/Collectible';

export class LevelTwoScene extends Scene {
    private player: Player;
    private slimes: Physics.Arcade.Group;
    private projectiles: Physics.Arcade.Group;
    private collectibles: Physics.Arcade.Group;
    private map: Tilemaps.Tilemap;
    private lixos: Physics.Arcade.Group;

    private fruitList = [
        { texture: 'collect_apple', anim: 'apple-spin' },
        { texture: 'collect_banana', anim: 'banana-spin' },
        { texture: 'collect_cherry', anim: 'cherry-spin' },
        { texture: 'collect_orange', anim: 'orange-spin' },
        { texture: 'collect_pineapple', anim: 'pineapple-spin' },
    ];

    private lixoList = [
        { texture: 'lixo_pizza', anim: null },
        { texture: 'lixo_hamburguer', anim: null },
        { texture: 'lixo_batata', anim: null },
        { texture: 'lixo_coca', anim: null },
        { texture: 'lixo_donut', anim: null }
    ];


    constructor() {
        super('LevelTwoScene');
    }

    create() {
        console.log('Método update chamado');

        // --- 1. CARREGAR MAPA E TILESETS DO NÍVEL 2 ---
        this.map = this.make.tilemap({ key: 'map_level2' });

        // Nomes corretos dos tilesets como você especificou
        const grassTileset = this.map.addTilesetImage('TX Tileset Grass', 'tileset_grass_l2');
        const objectTileset = this.map.addTilesetImage('objects-new', 'tileset_objects_l2');

        let wallsLayer; // Será a camada 'wall'

        // --- 2. CRIAR LAYERS (Com os nomes corretos que você passou) ---

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

        // Definir colisão para a camada 'wall'
        if (wallsLayer) {
            wallsLayer.setCollisionByProperty({ collider: true });
        } else {
            console.error("Camada de colisão 'wall' não pôde ser criada.");
        }


        // --- 3. CRIAR GRUPO DE PROJÉTEIS ---
        this.projectiles = this.physics.add.group({
            classType: Projectile,
            runChildUpdate: true,
            createCallback: (proj) => {
                (proj as Projectile).setActive(false).setVisible(false);
            }
        });

        // --- 4. CRIAR GRUPO DE COLETÁVEIS ---
        this.collectibles = this.physics.add.group({
            classType: Collectible,
            runChildUpdate: true
        });

        // --- 5. CRIAR GRUPO DE LIXOS ---
        this.lixos = this.physics.add.group({
            classType: Collectible,
            runChildUpdate: true
        });

        // --- 5. CRIAR PLAYER (Refatoração aplicada) ---
        const playerSpawn = this.map.findObject('spawning point', obj => obj.name === 'spawning point');
        if (playerSpawn && typeof playerSpawn.x === 'number' && typeof playerSpawn.y === 'number') {
            this.player = new Player(this, playerSpawn.x, playerSpawn.y, this.projectiles);
        } else {
            console.error("Ponto de spawn 'spawning point' do 'player' não encontrado no Tiled map.");
            this.player = new Player(this, 100, 100, this.projectiles);
        }

        // --- 6. CRIAR SLIMES ---
        this.slimes = this.physics.add.group({ classType: Slime, runChildUpdate: true });
        const enemysLayer = this.map.getObjectLayer('enemy');
        // --- LOGS PARA DEPURAÇÃO ---
        if (enemysLayer && enemysLayer.objects) {
            console.log('Camada enemy encontrada:', enemysLayer.objects);
        } else {
            console.error('Camada enemy não encontrada ou sem objetos.');
        }

        if (enemysLayer && enemysLayer.objects) {
            enemysLayer.objects.forEach(spawn => {
                if (spawn.x && spawn.y) {
                    console.log(`Criando slime na posição: x=${spawn.x}, y=${spawn.y}`);
                    const slime = new Slime(this, spawn.x, spawn.y, this.player);
                    this.slimes.add(slime.setActive(true).setVisible(true));
                }
            });
        }

        console.log(`Slimes criados: ${this.slimes.getChildren().length}`);

        // --- CRIAR AS FRUTAS DO MAPA ---
        const fruitLayer = this.map.getObjectLayer('dropFruit');
        if (fruitLayer && fruitLayer.objects) {
            fruitLayer.objects.forEach(fruitSpawn => {
                if (fruitSpawn.type === 'dropFruit' && fruitSpawn.x && fruitSpawn.y) {
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

        // --- 9. CRIAR OS LIXOS DO MAPA (MODIFICADO) ---
        const lixoLayer = this.map.getObjectLayer('dropLixo');
        if (lixoLayer && lixoLayer.objects) {
            lixoLayer.objects.forEach(lixoSpawn => {
                if (lixoSpawn.type === 'dropLixo' && lixoSpawn.x && lixoSpawn.y) {
                    // Pega um item de lixo aleatório da lista
                    const randomLixo = Phaser.Utils.Array.GetRandom(this.lixoList);

                    // Cria a instância do lixo primeiro (evita converter o retorno do grupo)
                    const lixoItem = new Collectible(
                        this,
                        lixoSpawn.x,
                        lixoSpawn.y,
                        randomLixo.texture,            // Textura aleatória
                        randomLixo.anim ?? '',         // Usa string vazia se for null
                        'LIXO'                         // Tipo
                    );

                    // Adiciona a instância ao grupo
                    this.lixos.add(lixoItem);

                    lixoItem.setDisplaySize(16, 16);
                }
            });
        }

        // --- 8. CÂMERA E FÍSICA ---
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
        this.cameras.main.setZoom(2.5);

        // --- 9. ADICIONAR COLISÕES ---
        if (wallsLayer) {
            this.physics.add.collider(this.player, wallsLayer);
            this.physics.add.collider(this.slimes, wallsLayer);
            this.physics.add.collider(this.projectiles, wallsLayer, this.handleProjectileHitWall, undefined, this);
        }

        this.physics.add.collider(this.player, this.slimes, this.handlePlayerHitSlime, undefined, this);
        this.physics.add.overlap(this.projectiles, this.slimes, this.handleProjectileHitSlime, undefined, this);
        this.physics.add.overlap(this.player, this.collectibles, this.handleCollectItem, undefined, this);

        this.physics.add.overlap(this.player, this.lixos, this.handleCollectLixo, undefined, this);

        // --- 10. UI ---
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
        collectible.destroy();
    }

    private handleCollectLixo(player: any, item: any) {
        const collectible = item as Collectible;
        const playerObj = player as Player;
        if (collectible.collect() === 'LIXO') {
            playerObj.takeDamage(1);
        }
        collectible.destroy();
    }


    // --- GETTERS ---

    public getSlimesGroup(): Phaser.Physics.Arcade.Group {
        return this.slimes;
    }

    // --- UPDATE & WIN ---
    update() {
        if (this.player && this.player.active) {
            this.player.update();
        }

        if (this.slimes.getChildren().length > 0 && this.slimes.countActive(true) === 0) {
            this.winLevel();
        }
    }

    private winLevel(): void {
        console.log('Método winLevel chamado. Verificando condições para desbloquear próximo nível.');

        if (this.scene.isActive()) {
            console.log('Fase 2 Vencida!');

            this.scene.stop('UIScene');
            GameProgress.unlockNextLevel(2);

            this.scene.pause();

            console.log('Lançando VictoryScene...');
            this.scene.launch('VictoryScene', {
                parentSceneKey: this.scene.key,
                nextSceneKey: 'LevelThreeScene'
            });

            // Garantir que a VictoryScene fique no topo
            this.scene.bringToTop('VictoryScene');
        }
    }
}
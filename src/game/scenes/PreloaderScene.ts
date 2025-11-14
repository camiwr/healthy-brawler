import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload() {
        this.load.setPath('assets');

        this.load.image('logo_brawler', 'logo-healthy-brawler.png');

        this.load.image('apple', './fruits/apple.png');
        this.load.image('banana', './fruits/banana.png');
        this.load.image('carrot', './fruits/carrot.png');
        this.load.image('grape', './fruits/grape.png');
        this.load.image('pineapple', './fruits/pineapple.png');
        this.load.image('strawberry', './fruits/strawberry.png');
        this.load.image('watermelon', './fruits/watermelon.png');
        this.load.image('tomato', './fruits/tomato.png');
        this.load.image('lime', './fruits/lime.png');

        // --- TILESETS E MAPAS ---
        // Tilesets Nível 1
        this.load.image('tileset_terrain', 'images/tileset.png');
        this.load.image('tileset_objects', 'images/objects.png');

        // Tilesets Nível 2
        this.load.image('tileset_grass_l2', 'images/TX Tileset Grass.png');
        this.load.image('tileset_objects_l2', 'images/objects-new.png');

        // Tilesets Nível 3
        this.load.image('boat', 'images/boat.png');
        this.load.image('tileset_att_objects', 'images/tileset_att.png');

        this.load.tilemapTiledJSON('map_level1', 'maps/level1/level1.json');
        this.load.tilemapTiledJSON('map_level2', 'maps/level2/level2.json');
        this.load.tilemapTiledJSON('map_level3', 'maps/level3/level3.json');
        this.load.spritesheet('player', 'images/Player.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('slime-idle-sheet', 'images/Slime-idle.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('slime-run-sheet', 'images/Slime-move.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('slime-die-sheet', 'images/Slime-die.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('hearts', 'images/hearts.png', {
            frameWidth: 17,
            frameHeight: 17
        });

        this.load.image('menu_button', './UI/menu.png');
        this.load.image('play_button', './UI/jogar.png');
        this.load.image('pause_button', './UI/pausar.png');
        this.load.image('yes_button', './UI/sim.png');
        this.load.image('no_button', './UI/nao.png');
        this.load.image('heart', './UI/heart.png');
        this.load.image('game_over', './UI/gameover.png');
        this.load.image('tryagain', './UI/tryagain.png');
        this.load.image('resume_button', './UI/continuar.png');
        this.load.image('skip_button', './UI/pular.png');
        this.load.image('pause_modal_bg', './UI/box.png')

        this.load.image('victory_graphic', 'UI/win-scene.png');
        this.load.image('next_button', 'UI/proximo.png');
        this.load.image('back_button', 'UI/voltar.png');
        this.load.image('tutorial_button', 'UI/tutorial.png')

        this.load.image('level_1_button', './UI/one.png');
        this.load.image('level_2_button', './UI/two.png');
        this.load.image('level_3_button', './UI/three.png');
        this.load.image('level_lock_button', './UI/lock.png');

        this.load.image('title_level_select', './UI/selecioneAFase.png');

        // Imagens dos projéteis
        this.load.image('proj_1', './projectiles/FB500-1.png');
        this.load.image('proj_2', './projectiles/FB500-2.png');
        this.load.image('proj_3', './projectiles/FB500-3.png');
        this.load.image('proj_4', './projectiles/FB500-4.png');
        this.load.image('proj_5', './projectiles/FB500-5.png');


        // Frutas de coleta animadas
        const fruitFrameSize = { frameWidth: 32, frameHeight: 32 }; // Ajuste o tamanho se for diferente
        this.load.spritesheet('collect_apple', './animated/Apples.png', fruitFrameSize);
        this.load.spritesheet('collect_banana', './animated/Bananas.png', fruitFrameSize);
        this.load.spritesheet('collect_cherry', './animated/Cherries.png', fruitFrameSize);
        this.load.spritesheet('collect_orange', './animated/Orange.png', fruitFrameSize);
        this.load.spritesheet('collect_pineapple', './animated/Pineapple.png', fruitFrameSize);

        // --- LIXO (NÃO SAUDÁVEIS) - IMAGENS ESTÁTICAS ---
        this.load.image('lixo_pizza', './lixo/pizza.png');
        this.load.image('lixo_hamburguer', './lixo/hamburguer.png');
        this.load.image('lixo_coca', './lixo/coca.png');
        this.load.image('lixo_batata', './lixo/fries.png');
        this.load.image('lixo_icecream', './lixo/icecream.png'); 
        this.load.image('lixo_donut', './lixo/donuts.png');
        // --- FIM DOS NOVOS ITENS ---

        // Imagens para a cena educacional
        this.load.image('edu_1', 'images/edu_1.png');
        this.load.image('edu_2', 'images/edu_2.png');
        this.load.image('edu_3', 'images/edu_3.png');
        this.load.image('edu_4', 'images/edu_4.png');
        this.load.image('edu_5', 'images/edu_5.png');
        this.load.image('edu_6', 'images/edu_6.png');
        this.load.image('edu_7', 'images/edu_7.png');
    }

    create() {
        // --- ANIMAÇÕES DE PLAYER ---
        this.anims.create({
            key: 'player-walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player-walk-side',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 9 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'player-walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
            frameRate: 8,
            repeat: -1
        });


        this.anims.create({
            key: 'player-attack-down',
            frames: this.anims.generateFrameNumbers('player', { start: 36, end: 39 }),
            frameRate: 12,
            repeat: 0
        });

        this.anims.create({
            key: 'player-attack-side',
            frames: this.anims.generateFrameNumbers('player', { start: 42, end: 45 }),
            frameRate: 12,
            repeat: 0
        });

        this.anims.create({
            key: 'player-attack-up',
            frames: this.anims.generateFrameNumbers('player', { start: 48, end: 51 }),
            frameRate: 12,
            repeat: 0
        });

        this.anims.create({
            key: 'player-die',
            frames: this.anims.generateFrameNumbers('player', { start: 54, end: 55 }),
            frameRate: 4,
            repeat: 0
        });

        // --- ANIMAÇÕES DE INIMIGOS ---
        this.anims.create({
            key: 'slime-idle',
            frames: this.anims.generateFrameNumbers('slime-idle-sheet', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'slime-move',
            frames: this.anims.generateFrameNumbers('slime-run-sheet', { start: 0, end: 6 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'slime-die',
            frames: this.anims.generateFrameNumbers('slime-die-sheet', { start: 0, end: 6 }),
            frameRate: 8,
            repeat: 0
        });

        // --- ANIMAÇÕES DE PROJÉTEIS ---
        this.anims.create({
            key: 'projectile-fly',
            frames: [
                { key: 'proj_1' },
                { key: 'proj_2' },
                { key: 'proj_3' },
                { key: 'proj_4' },
                { key: 'proj_5' },
            ],
            frameRate: 10,
            repeat: -1
        });

        // --- NOVAS ANIMAÇÕES DE FRUTAS E EFEITOS ---
        const fruitFrameRate = 10;
        const fruitFrames = { start: 0, end: 16 }; // A maioria das suas frutas tem 17 frames
        this.anims.create({ key: 'apple-spin', frames: this.anims.generateFrameNumbers('collect_apple', fruitFrames), frameRate: fruitFrameRate, repeat: -1 });
        this.anims.create({ key: 'banana-spin', frames: this.anims.generateFrameNumbers('collect_banana', fruitFrames), frameRate: fruitFrameRate, repeat: -1 });
        this.anims.create({ key: 'cherry-spin', frames: this.anims.generateFrameNumbers('collect_cherry', fruitFrames), frameRate: fruitFrameRate, repeat: -1 });
        this.anims.create({ key: 'orange-spin', frames: this.anims.generateFrameNumbers('collect_orange', fruitFrames), frameRate: fruitFrameRate, repeat: -1 });
        this.anims.create({ key: 'pineapple-spin', frames: this.anims.generateFrameNumbers('collect_pineapple', fruitFrames), frameRate: fruitFrameRate, repeat: -1 });

        console.log('Animações criadas corretamente!');
        this.scene.start('SplashScreen');
    }
}

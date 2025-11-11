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
        this.load.image('corn', './fruits/corn.png');
        this.load.image('lime', './fruits/lime.png');

        this.load.image('tileset_terrain', 'images/tileset.png');
        this.load.image('tileset_objects', 'images/objects.png');

        this.load.tilemapTiledJSON('map_level1', 'maps/level1.json');
        this.load.spritesheet('player', 'images/Player.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('slime', 'images/Slime.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.spritesheet('hearts', 'images/hearts.png', {
            frameWidth: 17,
            frameHeight: 17
        });

        this.load.image('menu_button', './UI/menuB.png');
        this.load.image('play_button', './UI/jogar.png');
        this.load.image('pause_button', './UI/pausar.png');
        this.load.image('yes_button', './UI/sim.png');
        this.load.image('no_button', './UI/nao.png');
        this.load.image('heart', './UI/heart.png');
        this.load.image('game_over', './UI/game-over.png');
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
            frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create({
            key: 'slime-move',
            frames: this.anims.generateFrameNumbers('slime', { start: 4, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'slime-die',
            frames: this.anims.generateFrameNumbers('slime', { start: 12, end: 19 }),
            frameRate: 12,
            repeat: 0,
            hideOnComplete: true 
        });


        console.log('Animações criadas corretamente!');
        this.scene.start('SplashScreen');
    }
}

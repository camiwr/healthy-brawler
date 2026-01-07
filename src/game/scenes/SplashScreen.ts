import { Scene } from 'phaser';

export class SplashScreen extends Scene {
    constructor() {
        super('SplashScreen');
    }

    create() {
        // Fundo Degradê
        this.createGradientBackground();

        const fruitPositions = [
        { x: 120, y: 150, key: 'collect_apple', anim: 'apple-spin' },
        { x: 680, y: 120, key: 'collect_banana', anim: 'banana-spin' },
        { x: 150, y: 450, key: 'collect_orange', anim: 'orange-spin' },
        { x: 650, y: 400, key: 'collect_strawberry', anim: 'strawberry-spin' },
        { x: 400, y: 100, key: 'collect_pineapple', anim: 'pineapple-spin' },
        { x: 300, y: 500, key: 'collect_kiwi', anim: 'kiwi-spin' },
        { x: 500, y: 300, key: 'collect_watermelon', anim: 'watermelon-spin' },
        { x: 400, y: 350, key: 'collect_cherry', anim: 'cherry-spin' },

        { x: 50,  y: 300, key: 'collect_kiwi', anim: 'kiwi-spin' },
        { x: 750, y: 250, key: 'collect_apple', anim: 'apple-spin' },
        { x: 250, y: 80,  key: 'collect_cherry', anim: 'cherry-spin' },
        { x: 550, y: 50,  key: 'collect_orange', anim: 'orange-spin' },
        { x: 100, y: 550, key: 'collect_banana', anim: 'banana-spin' },
        { x: 700, y: 530, key: 'collect_pineapple', anim: 'pineapple-spin' },
        { x: 450, y: 550, key: 'collect_watermelon', anim: 'watermelon-spin' },
        { x: 30,  y: 80,  key: 'collect_strawberry', anim: 'strawberry-spin' },
        { x: 770, y: 60,  key: 'collect_cherry', anim: 'cherry-spin' },

        { x: 850, y: 150, key: 'collect_orange', anim: 'orange-spin' },
        { x: 920, y: 350, key: 'collect_banana', anim: 'banana-spin' },
        { x: 800, y: 500, key: 'collect_kiwi', anim: 'kiwi-spin' },
        { x: 980, y: 100, key: 'collect_strawberry', anim: 'strawberry-spin' },
        { x: 880, y: 580, key: 'collect_watermelon', anim: 'watermelon-spin' },
        { x: 1000, y: 300, key: 'collect_pineapple', anim: 'pineapple-spin' },
        { x: 950, y: 500, key: 'collect_cherry', anim: 'cherry-spin' },
        { x: 200, y: 300, key: 'collect_watermelon', anim: 'watermelon-spin' },
    ];

    fruitPositions.forEach((config, index) => {
        const fruit = this.add.sprite(config.x, config.y, config.key);
        fruit.setScale(3);
        fruit.setAlpha(0.7);

        fruit.play(config.anim);
        this.tweens.add({
            targets: fruit,
            y: config.y - 15,          // Sobe 15 pixels
            duration: 1500 + (index * 150), // Tempos variados para não subirem todas juntas
            ease: 'Sine.easeInOut',    // Movimento suave
            yoyo: true,                // Vai e volta
            repeat: -1                 // Loop infinito
        });
    });

        // // 1. Frutinhas Flutuando
        // const fruitKeys = ['apple', 'banana', 'strawberry', 'grape', 'watermelon', 'pineapple', 'lime'];
        // for (let i = 0; i < 25; i++) {
        //     const x = Phaser.Math.Between(0, this.cameras.main.width);
        //     const y = Phaser.Math.Between(0, this.cameras.main.height);
        //     const key = Phaser.Utils.Array.GetRandom(fruitKeys);
            
        //     const fruit = this.physics.add.image(x, y, key);
        //     const velocityX = Phaser.Math.Between(-30, 30);
        //     const velocityY = Phaser.Math.Between(-30, 30);

        //     fruit.setVelocity(velocityX, velocityY);
        //     // Faz a fruta girar no próprio eixo (velocidade angular aleatória)
        //     const angularSpeed = Phaser.Math.Between(-120, 120); // negativo gira em sentido contrário
        //     fruit.setAngularVelocity(angularSpeed);

        //     fruit.setCollideWorldBounds(true, 1, 1, true);
        //     fruit.setDepth(0);

        //     const randomSize = Phaser.Math.Between(65, 65);
        //     fruit.setDisplaySize(randomSize, randomSize);

        //     // Deixa as frutas com 50% de opacidade
        //     fruit.setAlpha(0.5);
        // }

        // Logo do Jogo
        const logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'logo_brawler');
        logo.setDepth(10);

        // Botão "Começar"
        const startButton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, 'play_button')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScale(0.5); // aumenta o tamanho do botão
            
        startButton.setDepth(10); 
        startButton.on('pointerover', () => {
            startButton.setTint(0xDDDDDD); // Fica um pouco mais claro ao passar o mouse
        });

        startButton.on('pointerout', () => {
            startButton.clearTint(); // Volta ao normal
        });

        startButton.on('pointerdown', () => {
            startButton.setTint(0xAAAAAA); // Fica um pouco mais escuro ao clicar
        });

        startButton.on('pointerup', () => {
            startButton.clearTint(); // Volta ao normal
            this.scene.start('LevelSelectScene'); // Muda de cena
        });
        // --- FIM DOS EFEITOS ---
    }
    
    createGradientBackground() {
        // ... (o resto da função createGradientBackground continua igual)
        const texture = this.textures.createCanvas('gradient', this.cameras.main.width, this.cameras.main.height);
        if (!texture) {
            console.error('Failed to create gradient texture.');
            return;
        }
        const context = texture.getContext();
        const gradient = context.createLinearGradient(0, 0, this.cameras.main.width, this.cameras.main.height);

        gradient.addColorStop(0, '#FDEB71'); 
        gradient.addColorStop(1, '#F869D5'); 
        gradient.addColorStop(0.5, '#84c2ffff'); 

        context.fillStyle = gradient;
        context.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        texture.refresh();
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'gradient');
    }
}
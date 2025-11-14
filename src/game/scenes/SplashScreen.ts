import { Scene } from 'phaser';

export class SplashScreen extends Scene {
    constructor() {
        super('SplashScreen');
    }

    create() {
        // 1. Fundo Degradê
        this.createGradientBackground();

        // 1. Frutinhas Flutuando
        const fruitKeys = ['apple', 'banana', 'strawberry', 'grape', 'watermelon', 'pineapple', 'lime'];
        for (let i = 0; i < 25; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const key = Phaser.Utils.Array.GetRandom(fruitKeys);
            
            const fruit = this.physics.add.image(x, y, key);
            const velocityX = Phaser.Math.Between(-30, 30);
            const velocityY = Phaser.Math.Between(-30, 30);

            fruit.setVelocity(velocityX, velocityY);
            // Faz a fruta girar no próprio eixo (velocidade angular aleatória)
            const angularSpeed = Phaser.Math.Between(-120, 120); // negativo gira em sentido contrário
            fruit.setAngularVelocity(angularSpeed);

            fruit.setCollideWorldBounds(true, 1, 1, true);
            fruit.setDepth(0);

            const randomSize = Phaser.Math.Between(65, 65);
            fruit.setDisplaySize(randomSize, randomSize);

            // Deixa as frutas com 50% de opacidade
            fruit.setAlpha(0.5);
        }

        // 2. Logo do Jogo
        const logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'logo_brawler');
        logo.setDepth(10); // Logo na frente

        // 3. Botão "Começar" (AGORA COM IMAGEM PIXEL ART)
        const startButton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, 'play_button')
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setScale(0.5); // aumenta o tamanho do botão (ajuste o valor conforme necessário)
            
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
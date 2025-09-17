import { Scene } from 'phaser';

export class SplashScreen extends Scene {
    constructor() {
        super('SplashScreen');
    }

    create() {
        // 1. Fundo Degradê (CRIADO COM CÓDIGO)
        this.createGradientBackground();

        // 1. Frutinhas Flutuando (MUDEI A ORDEM PARA FICAR NO FUNDO)
        const fruitKeys = ['apple', 'banana', 'strawberry', 'grape', 'watermelon', 'pineapple', 'corn', 'lime'];
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const key = Phaser.Utils.Array.GetRandom(fruitKeys);
            
            const fruit = this.physics.add.image(x, y, key);
            const velocityX = Phaser.Math.Between(-30, 30);
            const velocityY = Phaser.Math.Between(-30, 30);

            fruit.setVelocity(velocityX, velocityY);
            fruit.setCollideWorldBounds(true, 1, 1, true);
            fruit.setDepth(0);

            // --- ESCALA MENOR PARA AS FRUTAS ---
           const randomSize = Phaser.Math.Between(65, 65); // Define um tamanho aleatório entre 32 e 48 pixels
            fruit.setDisplaySize(randomSize, randomSize);
        }

        // 2. Logo do Jogo
        const logo = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'logo_brawler');
        logo.setDepth(10); // Logo na frente

        // 3. Botão "Começar"
        const startButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, 'Começar', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#deb3ffff',
            padding: { x: 30, y: 15 },
            // @ts-ignore
            borderRadius: 10,
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
        startButton.setDepth(10); // Botão na frente

        startButton.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });
    }
    createGradientBackground() {
        const texture = this.textures.createCanvas('gradient', this.cameras.main.width, this.cameras.main.height);
        if (!texture) {
            console.error('Failed to create gradient texture.');
            return;
        }
        const context = texture.getContext();
        const gradient = context.createLinearGradient(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Cores baseadas na sua imagem
        gradient.addColorStop(0, '#FDEB71'); // Amarelo claro
        gradient.addColorStop(1, '#F869D5'); 
        gradient.addColorStop(0.5, '#84c2ffff'); // Laranja

        context.fillStyle = gradient;
        context.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Importante: Atualiza a textura para o Phaser poder usá-la
        texture.refresh();

        // Adiciona a textura criada como uma imagem de fundo
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'gradient');
    }
}
import { Scene } from 'phaser';

export class UIScene extends Scene {
    private hearts: Phaser.GameObjects.Image[] = [];
    private maxHealth: number = 5;
    private isPaused: boolean = false;

    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // --- MOSTRADOR DE VIDA (CORAÇÕES) ---
        const gameScene = this.scene.get('LevelOneScene');
        this.drawHearts(this.maxHealth);
        gameScene.events.on('playerHealthChanged', this.updateHearts, this);

        // --- BOTÕES DE NAVEGAÇÃO ---

        // Botão de Pausar/Jogar
        const pauseButton = this.add.image(this.cameras.main.width - 40, 40, 'pause_button')
            .setInteractive({ useHandCursor: true });

        // Botão de Voltar ao Menu
        const menuButton = this.add.image(this.cameras.main.width - 100, 40, 'menu_button')
            .setInteractive({ useHandCursor: true });

        // --- LÓGICA DOS BOTÕES ---

        pauseButton.on('pointerdown', () => {
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                // Pausa a cena do jogo
                gameScene.scene.pause();
                pauseButton.setTexture('play_button'); // Troca a imagem para o botão de "play"
            } else {
                // Retoma a cena do jogo
                gameScene.scene.resume();
                pauseButton.setTexture('pause_button'); // Troca a imagem de volta para "pause"
            }
        });

        menuButton.on('pointerdown', () => {
            // Garante que a cena do jogo não esteja mais pausada ao sair
            if(this.isPaused) {
                gameScene.scene.resume();
            }
            gameScene.scene.stop(); // Para a cena do jogo
            this.scene.stop();      // Para a própria UIScene
            this.scene.start('LevelSelectScene'); // Volta para a seleção de fases
        });
    }

    private drawHearts(initialHealth: number): void {
        for (let i = 0; i < this.maxHealth; i++) {
            // Usa o novo sprite de coração que você carregou
            const heart = this.add.image(40 + (i * 35), 40, 'heart');
            this.hearts.push(heart);
        }
        this.updateHearts(initialHealth);
    }

    private updateHearts(currentHealth: number): void {
        for (let i = 0; i < this.hearts.length; i++) {
            // Mostra ou esconde o coração para representar a vida
            this.hearts[i].setVisible(i < currentHealth);
        }
    }
}
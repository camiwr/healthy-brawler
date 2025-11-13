import { Scene } from 'phaser';

export class GameOverScene extends Scene {
    private parentSceneKey: string;

    constructor() {
        super('GameOverScene');
    }

    init(data: { parentSceneKey: string }) {
        this.parentSceneKey = data.parentSceneKey;
    }

    create() {
        // --- FUNDO SEMI-TRANSPARENTE (EFEITO MODAL) ---
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.7); // Cor preta, 70% de opacidade
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // --- GRÁFICO DE GAME OVER ---
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'game_over')
            .setOrigin(0.5)
            .setScale(1.2); 

        // --- TEXTO "TENTAR NOVAMENTE?" ---
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 40, 'tryagain')
            .setOrigin(0.5)
            .setScale(0.5); 

        // --- BOTÃO "SIM" ---
        const yesButton = this.add.image(this.cameras.main.width / 2 - 50, this.cameras.main.height / 2 + 60, 'yes_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.3); // Ajuste o tamanho

        yesButton.on('pointerdown', () => {
            this.restartLevel();
        });

        // --- BOTÃO "NÃO" ---
        const noButton = this.add.image(this.cameras.main.width / 2 + 50, this.cameras.main.height / 2 + 60, 'no_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.3); // Ajuste o tamanho

        noButton.on('pointerdown', () => {
            this.goToMenu();
        });
        
        // --- Efeitos de Hover (opcional, mas recomendado) ---
        [yesButton, noButton].forEach(button => {
            button.on('pointerover', () => button.setTint(0xDDDDDD));
            button.on('pointerout', () => button.clearTint());
            button.on('pointerup', () => button.clearTint()); 
        });
    }

    private restartLevel() {
        this.scene.stop('UIScene');
        this.scene.stop(this.parentSceneKey);
        this.scene.start(this.parentSceneKey);
        this.scene.stop();
    }

    private goToMenu() {
        this.scene.stop(this.parentSceneKey); // Para a cena pai
        this.scene.stop();                   // Para esta cena (GameOverScene)
        this.scene.start('LevelSelectScene'); // Volta ao menu
    }
}
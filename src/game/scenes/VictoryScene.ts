import { Scene } from 'phaser';

export class VictoryScene extends Scene {
    private parentSceneKey: string;
    private nextSceneKey: string;

    constructor() {
        super('VictoryScene');
    }

    init(data: { parentSceneKey: string, nextSceneKey: string }) {
        this.parentSceneKey = data.parentSceneKey;
        this.nextSceneKey = data.nextSceneKey;
    }

    create() {
        // --- FUNDO SEMI-TRANSPARENTE (EFEITO MODAL) ---
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.7); // Cor preta, 70% de opacidade
        bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // --- GRÁFICO DE VITÓRIA ---
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'victory_graphic')
            .setOrigin(0.5)
            .setScale(1.2); // Ajuste o tamanho conforme necessário

        // --- BOTÃO "PRÓXIMO" ---
        const nextButton = this.add.image(this.cameras.main.width / 2 + 100, this.cameras.main.height / 2 + 150, 'next_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.3); // Ajuste o tamanho

        nextButton.on('pointerdown', () => {
            this.stopParentAndStartNext();
        });

        // --- BOTÃO "VOLTAR" ---
        const backButton = this.add.image(this.cameras.main.width / 2 - 100, this.cameras.main.height / 2 + 150, 'back_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.3); // Ajuste o tamanho

        backButton.on('pointerdown', () => {
            this.stopParentAndGoToMenu();
        });
        
        // --- Efeitos de Hover (opcional, mas recomendado) ---
        [nextButton, backButton].forEach(button => {
            button.on('pointerover', () => button.setTint(0xDDDDDD));
            button.on('pointerout', () => button.clearTint());
            button.on('pointerup', () => button.clearTint()); // Limpa o tint se o mouse sair
        });
    }

    private stopParentAndStartNext() {
        this.scene.stop(this.parentSceneKey); // Para a LevelOneScene (que estava pausada)
        this.scene.stop();                   // Para esta cena (VictoryScene)
        this.scene.start(this.nextSceneKey); // Inicia a LevelTwoScene
    }

    private stopParentAndGoToMenu() {
        this.scene.stop(this.parentSceneKey); // Para a LevelOneScene
        this.scene.stop();                   // Para esta cena (VictoryScene)
        this.scene.start('LevelSelectScene'); // Volta ao menu
    }
}
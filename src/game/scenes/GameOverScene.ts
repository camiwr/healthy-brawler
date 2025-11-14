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
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.7)');
        const { width, height } = this.scale;

        this.add.image(width / 2, height / 2 - 50, 'game_over')
            .setOrigin(0.5)
            .setScale(0.8);

        const tryAgainButton = this.add.image(width / 2, height / 2 + 50, 'tryagain')
            .setOrigin(0.5)
            .setInteractive()
            .setScale(0.6);

        // --- CORREÇÃO APLICADA AQUI ---
        tryAgainButton.on('pointerdown', () => {
            if (this.parentSceneKey) {
                // 1. Para a UIScene
                this.scene.stop('UIScene'); 
                
                // 2. Inicia a cena do jogo (ex: 'LevelOneScene')
                // A função start() AUTOMATICAMENTE para a cena atual (GameOverScene)
                // e inicia a cena passada pela key (string).
                this.scene.start(this.parentSceneKey); // <-- LINHA CORRIGIDA
                
            } else {
                // Fallback caso 'parentSceneKey' não seja passada
                console.error('parentSceneKey não definida na GameOverScene.');
                this.scene.stop('UIScene');
                this.scene.start('LevelSelectScene'); 
                this.scene.stop();
            }
        });
        // --- FIM DA CORREÇÃO ---

        // Botão de voltar ao menu (lógica original mantida)
        const menuButton = this.add.image(width / 2, height / 2 + 120, 'menu_button')
            .setOrigin(0.5)
            .setInteractive()
            .setScale(0.5);

        menuButton.on('pointerdown', () => {
            this.scene.stop('UIScene');
            // Garante que a cena do jogo (que está pausada) seja parada também
            if (this.parentSceneKey) {
                this.scene.stop(this.parentSceneKey); 
            }
            this.scene.start('LevelSelectScene'); // Ou 'MainMenuScene'
            this.scene.stop();
        });
    }
}
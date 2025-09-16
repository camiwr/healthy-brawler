import { Scene } from "phaser";
import { GameProgress } from "../utils/GameProgress";

export class LevelSelectScene extends Scene {
    private highestLevelUnlocked: number;

    constructor() {
        super('LevelSelectScene');
    }

    create() {
        // Pega o progresso do jogador assim que a cena é criada
        this.highestLevelUnlocked = GameProgress.getHighestLevelUnlocked();

        this.add.text(this.cameras.main.width / 2, 100, 'Seleção de Fases', {
            fontSize: '48px', color: '#fff'
        }).setOrigin(0.5);

        const levelSceneKeys = [
            'LevelOneScene', 
            'LevelTwoScene', // Adicione aqui as chaves das próximas fases quando criá-las
            'LevelThreeScene',
            'LevelFourScene',
                ];

        const positions = [
            { x: 200, y: 300 },
            { x: 400, y: 300 },
            { x: 600, y: 300 },
            { x: 800, y: 300 },
        ];

        for (let i = 1; i <= levelSceneKeys.length; i++) {
            const isUnlocked = i <= this.highestLevelUnlocked;

            const buttonColor = isUnlocked ? '#4E9A51' : '#555555';
            const buttonText = isUnlocked ? `Fase ${i}` : '🔒';

            const levelButton = this.add.text(positions[i-1].x, positions[i-1].y, buttonText, {
                fontSize: '40px',
                color: '#fff',
                backgroundColor: buttonColor,
                padding: { x: 40, y: 20 },
                align: 'center'
            }).setOrigin(0.5);

            if (isUnlocked) {
                levelButton.setInteractive({ useHandCursor: true });
                levelButton.on('pointerdown', () => {
                    // Inicia a cena da fase correspondente
                    const sceneKey = levelSceneKeys[i - 1];
                    this.scene.start(sceneKey);
                });
            }
        }
    }
}
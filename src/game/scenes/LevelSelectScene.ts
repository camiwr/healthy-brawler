import { Scene } from "phaser";
import { GameProgress } from "../utils/GameProgress";

export class LevelSelectScene extends Scene {
    private highestLevelUnlocked: number;

    constructor() {
        super('LevelSelectScene');
    }

    create() {
        // Pega o progresso do jogador
        this.highestLevelUnlocked = GameProgress.getHighestLevelUnlocked();

        this.add.image(this.cameras.main.width / 2, 100, 'title_level_select')
            .setOrigin(0.5)
            .setScale(1.0);

        // Define as cenas e as imagens dos botões
        const levelData = [
            { scene: 'LevelOneScene', image: 'level_1_button' },
            { scene: 'LevelTwoScene', image: 'level_2_button' },
            { scene: 'LevelThreeScene', image: 'level_3_button' },
            // { scene: 'LevelFourScene', image: 'level_4_button' }, 
        ];

        // Posições dos botões na tela
        const positions = [
            { x: 200, y: 300 },
            { x: 400, y: 300 },
            { x: 600, y: 300 },
            { x: 800, y: 300 }, // Posição para o nível 4
        ];
        
        // --- LÓGICA DE BOTÕES ATUALIZADA ---

        for (let i = 1; i <= 4; i++) {
            const pos = positions[i-1];
            const isUnlocked = i <= this.highestLevelUnlocked;
            const levelInfo = levelData[i-1]; 

            let button: Phaser.GameObjects.Image;

            if (isUnlocked && levelInfo) {
                button = this.add.image(pos.x, pos.y, levelInfo.image)
                    .setInteractive({ useHandCursor: true })
                    .setScale(0.3); 
                
                button.on('pointerover', () => button.setTint(0xDDDDDD));
                button.on('pointerout', () => button.clearTint());
                button.on('pointerdown', () => button.setTint(0xAAAAAA));
                button.on('pointerup', () => {
                    button.clearTint();
                    this.scene.start(levelInfo.scene);
                });

            } else {
                button = this.add.image(pos.x, pos.y, 'level_lock_button')
                    .setScale(0.3); 
            }
            
            button.setOrigin(0.5);
        }
    }
}
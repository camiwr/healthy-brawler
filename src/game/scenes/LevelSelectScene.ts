import { Scene } from "phaser";
import { GameProgress } from "../utils/GameProgress";

export class LevelSelectScene extends Scene {
    private highestLevelUnlocked: number;

    constructor() {
        super('LevelSelectScene');
    }

    create() {
        this.highestLevelUnlocked = GameProgress.getHighestLevelUnlocked();

        this.add.image(this.cameras.main.width / 2, 100, 'title_level_select')
            .setOrigin(0.5)
            .setScale(1.0);

        // Mapeamento de dados das Cenas Educativas
        const educationDataMap: { [key: string]: { images: string[], nextScene: string } } = {
            'LevelOneScene': { images: ['edu_1', 'edu_2', 'edu_3'], nextScene: 'LevelOneScene' },
            'LevelTwoScene': { images: ['edu_4', 'edu_5'], nextScene: 'LevelTwoScene' },
            'LevelThreeScene': { images: ['edu_6', 'edu_7'], nextScene: 'LevelThreeScene' },
        };

        const levelData = [
            { scene: 'LevelOneScene', image: 'level_1_button' },
            { scene: 'LevelTwoScene', image: 'level_2_button' },
            { scene: 'LevelThreeScene', image: 'level_3_button' },
        ];

        const positions = [
            { x: 200, y: 300 },
            { x: 400, y: 300 },
            { x: 600, y: 300 },
            { x: 800, y: 300 },
        ];
        
        for (let i = 0; i < levelData.length; i++) {
            const pos = positions[i];
            const levelInfo = levelData[i];
            const isUnlocked = (i + 1) <= this.highestLevelUnlocked;

            let button: Phaser.GameObjects.Image;
            let targetSceneKey = levelInfo.scene; // ex: 'LevelOneScene'

            if (isUnlocked) {
                button = this.add.image(pos.x, pos.y, levelInfo.image)
                    .setInteractive({ useHandCursor: true })
                    .setScale(0.3); 
                
                button.on('pointerover', () => button.setTint(0xDDDDDD));
                button.on('pointerout', () => button.clearTint());
                button.on('pointerdown', () => button.setTint(0xAAAAAA));
                
                button.on('pointerup', () => {
                    button.clearTint();
                    
                    const eduData = educationDataMap[targetSceneKey];
                    const hasSeenTutorial = GameProgress.getTutorialSeen();

                    // --- LÓGICA DE FLUXO ATUALIZADA ---

                    if (targetSceneKey === 'LevelOneScene' && !hasSeenTutorial) {
                        // FLUXO: TUTORIAL -> EDU -> JOGO
                        this.scene.start('TutorialScene', { 
                            origin: 'LevelSelect',
                            nextScene: 'EducationScene', // Próxima cena é a Educação
                            nextSceneData: eduData       // Passa os dados da Educação para o Tutorial
                        });
                        
                    } else {
                        this.scene.start('EducationScene', eduData);
                    }
                });

            } else {
                button = this.add.image(pos.x, pos.y, 'level_lock_button')
                    .setScale(0.3); 
            }
            
            button.setOrigin(0.5);
        }
    }
}
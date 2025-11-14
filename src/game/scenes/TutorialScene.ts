import { Scene, GameObjects, Types } from 'phaser';
import { GameProgress } from '../utils/GameProgress';
import type { UIScene } from './UIScene'; 

// 1. Interface para os dados que esta cena recebe
interface TutorialData {
    origin: 'LevelSelect' | 'UIScene';
    nextScene?: string;       // A próxima cena a ser chamada (ex: 'EducationScene')
    nextSceneData?: any;      // Os dados para passar para essa próxima cena
}

export class TutorialScene extends Scene {
    
    private instrucoes: string[] = [
        "🕹️ Use as setas ⇧ (cima), ⇩ (baixo), ⇦ (esquerda) e ⇨ (direita) para se mover.\n⚔️ Use a Barra de Espaço para atacar.",
        "💖 Você começa com 5 vidas!\n🍎 Colete frutas para ganhar vidas extras!\n🍔 Evite comidas não saudáveis para não perder vidas!",
        "👾 Cuidado! Os slimes tiram vidas!",
        "👾 Combata TODOS os inimigos para avançar de fase e vencer!"
    ];
    
    private currentSlideIndex: number;
    private slideText: GameObjects.Text;
    
    // 2. Propriedades para guardar os dados
    private originScene: 'LevelSelect' | 'UIScene';
    private nextScene?: string;
    private nextSceneData?: any;

    constructor() {
        super('TutorialScene');
        this.currentSlideIndex = 0;
    }

    // 3. Função init atualizada
    init(data: TutorialData) {
        this.originScene = data.origin;
        this.nextScene = data.nextScene;
        this.nextSceneData = data.nextSceneData;
        this.currentSlideIndex = 0;
    }

    create() {
        // ... (o resto da função create continua IGUAL) ...
        const cam = this.cameras.main;
        
        this.add.graphics()
            .fillStyle(0x000000, 0.8)
            .fillRect(0, 0, cam.width, cam.height);

        const textStyle: Types.GameObjects.Text.TextStyle = {
            fontFamily: 'Arial', 
            fontSize: '24px',
            color: '#FFFFFF',
            align: 'center',
        };

        this.slideText = this.add.text(
            cam.width / 2, 
            cam.height / 2 - 50, 
            this.instrucoes[this.currentSlideIndex], 
            textStyle
        ).setOrigin(0.5);

        const nextButton = this.add.image(cam.width / 2 + 200, cam.height - 70, 'next_button')
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.nextSlide());
            
        const closeButton = this.add.image(cam.width / 2 - 200, cam.height - 70, 'skip_button')
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.finishTutorial());

        [nextButton, closeButton].forEach(btn => {
            btn.on('pointerover', () => btn.setTint(0xDDDDDD));
            btn.on('pointerout', () => btn.clearTint());
        });
    }

    private nextSlide() {
        this.currentSlideIndex++;
        
        if (this.currentSlideIndex < this.instrucoes.length) {
            this.slideText.setText(this.instrucoes[this.currentSlideIndex]);
        } else {
            this.finishTutorial();
        }
    }

    // 4. Função finishTutorial atualizada
    private finishTutorial() {
        this.scene.stop(); // Para esta cena (TutorialScene)

        if (this.originScene === 'LevelSelect') {
            // Veio da seleção de nível
            GameProgress.setTutorialSeen();
            
            // Inicia a próxima cena que foi passada (a EducationScene)
            if (this.nextScene) {
                this.scene.start(this.nextScene, this.nextSceneData);
            }
            
        } 
        else if (this.originScene === 'UIScene') {
            // Veio do menu de pausa (não muda nada aqui)
            const ui = this.scene.get('UIScene') as UIScene;
            if (ui) {
                ui.showPauseModal();
            }
        }
    }
}
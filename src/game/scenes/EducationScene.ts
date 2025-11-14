import { Scene, GameObjects } from 'phaser';

interface EducationData {
    images: string[];       
    nextScene: string;       
    tutorialOrigin?: 'LevelSelect';
}

export class EducationScene extends Scene {
    
    private imagesToShow: string[];
    private nextScene: string;
    private tutorialOrigin?: 'LevelSelect';
    
    private currentImageIndex: number;
    private slideImage: GameObjects.Image;
    private nextButton: GameObjects.Image;

    constructor() {
        super('EducationScene');
    }

    init(data: EducationData) {
        this.imagesToShow = data.images;
        this.nextScene = data.nextScene;
        this.tutorialOrigin = data.tutorialOrigin;
        this.currentImageIndex = 0;
    }

    create() {
        const cam = this.cameras.main;

        // Fundo preto
        this.add.graphics()
            .fillStyle(0x000000, 1)
            .fillRect(0, 0, cam.width, cam.height);

        // Imagem do slide atual (ex: 'edu_1')
        this.slideImage = this.add.image(cam.width / 2, cam.height / 2, this.imagesToShow[this.currentImageIndex])
            .setOrigin(0.5);

        // Botão "Próximo"
        this.nextButton = this.add.image(cam.width / 2, cam.height - 70, 'next_button')
            .setScale(0.3)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.nextSlide());
            
        this.nextButton.on('pointerover', () => this.nextButton.setTint(0xDDDDDD));
        this.nextButton.on('pointerout', () => this.nextButton.clearTint());
    }

    private nextSlide() {
        this.currentImageIndex++;
        
        // Verifica se ainda há imagens
        if (this.currentImageIndex < this.imagesToShow.length) {
            this.slideImage.setTexture(this.imagesToShow[this.currentImageIndex]);
        } else {
            // Acabaram os slides, vai para a próxima cena
            // (Passa o 'origin' para o TutorialScene ou para o LevelScene)
            this.scene.start(this.nextScene, { origin: this.tutorialOrigin });
        }
    }
}
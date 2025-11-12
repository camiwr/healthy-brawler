import { Scene } from 'phaser';

export class UIScene extends Scene {
    private hearts: Phaser.GameObjects.Image[] = [];
    private maxHealth: number = 5;
    private isPaused: boolean = false;
    
    private parentScene: Scene;
    private pauseModal: Phaser.GameObjects.Container;
    private pauseButton: Phaser.GameObjects.Image; 

    constructor() {
        super({ key: 'UIScene' });
    }

    init(data: { parentSceneKey: string }) {
        // Armazena a referência da cena pai (ex: LevelOneScene, LevelTwoScene, etc.)
        this.parentScene = this.scene.get(data.parentSceneKey);
    }

    create() {
        // --- MOSTRADOR DE VIDA (CORAÇÕES) ---
        this.drawHearts(this.maxHealth);
        this.parentScene.events.on('playerHealthChanged', this.updateHearts, this);

        
        // --- BOTÃO DE PAUSAR (CANTO DA TELA) ---
        this.pauseButton = this.add.image(this.cameras.main.width - 50, 40, 'pause_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.2)


        // --- CRIAÇÃO DO MODAL DE PAUSA (COMEÇA ESCONDIDO) ---
        
        // 1. Cria o Container
        this.pauseModal = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        this.pauseModal.setDepth(100);
        this.pauseModal.setVisible(false);

        // 2. Adiciona sua imagem "box.png" como fundo
        const modalBackground = this.add.image(0, 0, 'pause_modal_bg');
        modalBackground.setScale(1); 
        this.pauseModal.add(modalBackground);

        // 3. Adiciona os botões "Continuar" e "Menu" DENTRO do modal
        const resumeButton = this.add.image(0, -30, 'resume_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.5);

        const menuButton = this.add.image(0, 45, 'menu_button') 
            .setInteractive({ useHandCursor: true })
            .setScale(0.5); 

        this.pauseModal.add(resumeButton);
        this.pauseModal.add(menuButton);


        // --- LÓGICA DE EVENTOS ---

        // CLICAR NO BOTÃO "PAUSAR" (CANTO DA TELA)
        this.pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.parentScene.scene.pause();
            this.pauseButton.setVisible(false);
            this.pauseModal.setVisible(true); 
        });

        // CLICAR NO BOTÃO "CONTINUAR" (DENTRO DO MODAL)
        resumeButton.on('pointerdown', () => {
            this.isPaused = false;
            this.parentScene.scene.resume();
            this.pauseModal.setVisible(false);
            this.pauseButton.setVisible(true);
        });

        // CLICAR NO BOTÃO "MENU" (DENTRO DO MODAL)
        menuButton.on('pointerdown', () => {
            this.isPaused = false;
            this.parentScene.scene.resume();
            this.parentScene.scene.stop();   
            this.scene.stop();               
            this.scene.start('LevelSelectScene'); 
        });
    }

    private drawHearts(initialHealth: number): void {
        for (let i = 0; i < this.maxHealth; i++) {
            const heart = this.add.image(40 + (i * 35), 40, 'heart')
                .setScale(0.1);
            this.hearts.push(heart);
        }
        this.updateHearts(initialHealth);
    }

    private updateHearts(currentHealth: number): void {
        for (let i = 0; i < this.hearts.length; i++) {
            this.hearts[i].setVisible(i < currentHealth);
        }
    }
}
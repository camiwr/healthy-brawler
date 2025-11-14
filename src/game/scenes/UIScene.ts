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
        this.parentScene = this.scene.get(data.parentSceneKey);
    }

    create() {
        // --- MOSTRADOR DE VIDA (CORAÇÕES) ---
        this.drawHearts(this.maxHealth);
        this.parentScene.events.on('playerHealthChanged', this.updateHearts, this);

        
        // --- BOTÃO DE PAUSAR (CANTO DA TELA) ---
        this.pauseButton = this.add.image(this.cameras.main.width - 50, 40, 'pause_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.2);


        // --- CRIAÇÃO DO MODAL DE PAUSA (COMEÇA ESCONDIDO) ---
        
        this.pauseModal = this.add.container(this.cameras.main.width / 2, this.cameras.main.height / 2);
        this.pauseModal.setDepth(100);
        this.pauseModal.setVisible(false);

        const modalBackground = this.add.image(0, 0, 'pause_modal_bg');
        modalBackground.setScale(1); 
        this.pauseModal.add(modalBackground);

        // --- Posições dos Botões (AJUSTADAS) ---
        const resumeButton = this.add.image(0, -50, 'resume_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.5);

        // NOVO BOTÃO "TUTORIAL"
        const tutorialButton = this.add.image(0, 30, 'tutorial_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.5);

        const menuButton = this.add.image(0, 110, 'menu_button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.5); 

        this.pauseModal.add(resumeButton);
        this.pauseModal.add(tutorialButton); // <-- ADICIONADO
        this.pauseModal.add(menuButton);


        // --- LÓGICA DE EVENTOS ---

        this.pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.parentScene.scene.pause();
            this.showPauseModal(); // <-- USANDO A NOVA FUNÇÃO
        });

        resumeButton.on('pointerdown', () => {
            this.isPaused = false;
            this.parentScene.scene.resume();
            this.pauseModal.setVisible(false);
            this.pauseButton.setVisible(true);
        });
        
        // --- LÓGICA DO NOVO BOTÃO ---
        tutorialButton.on('pointerdown', () => {
            this.pauseModal.setVisible(false); // Esconde o modal de pausa
            this.scene.launch('TutorialScene', { origin: 'UIScene' });
        });
        // --- FIM DA LÓGICA ---

        menuButton.on('pointerdown', () => {
            this.isPaused = false;
            this.parentScene.scene.resume();
            this.parentScene.scene.stop();   
            this.scene.stop();               
            this.scene.start('LevelSelectScene'); 
        });
    }

    // --- ADICIONAR NOVA FUNÇÃO PÚBLICA ---
    /**
     * Mostra o modal de pausa.
     * Esta função é pública para que a TutorialScene possa chamá-la.
     */
    public showPauseModal(): void {
        this.pauseModal.setVisible(true);
        this.pauseButton.setVisible(false);
    }
    // --- FIM DA ADIÇÃO ---


    private drawHearts(initialHealth: number): void {
        this.hearts.forEach(heart => heart.destroy());
        this.hearts = [];

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
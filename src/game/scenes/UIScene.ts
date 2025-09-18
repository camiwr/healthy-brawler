import { Scene } from 'phaser';

export class UIScene extends Scene {
    private hearts: Phaser.GameObjects.Sprite[] = [];
    private maxHealth: number = 5; // A vida máxima do jogador

    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        // Pega a referência da cena do jogo principal
        const gameScene = this.scene.get('LevelOneScene');
        
        // Desenha os corações na tela com a vida inicial
        this.drawHearts(this.maxHealth);

        // Ouve o evento de 'playerHealthChanged' que a cena do jogo vai emitir
        gameScene.events.on('playerHealthChanged', (newHealth: number) => {
            this.updateHearts(newHealth);
        });
    }

    // Função para criar os corações pela primeira vez
    private drawHearts(initialHealth: number): void {
        for (let i = 0; i < this.maxHealth; i++) {
            // Cria um sprite de coração na posição correta
            const heart = this.add.sprite(30 + (i * 20), 30, 'hearts');
            this.hearts.push(heart);
        }
        this.updateHearts(initialHealth);
    }

    // Função para ATUALIZAR os corações quando o jogador toma dano
    private updateHearts(currentHealth: number): void {
        for (let i = 0; i < this.hearts.length; i++) {
            // O coração está "cheio" se a vida atual for maior que o índice do coração
            if (i < currentHealth) {
                this.hearts[i].setFrame(0); // Frame 0 = coração cheio
            } else {
                this.hearts[i].setFrame(4); // Frame 4 = coração vazio
            }
        }
    }
}
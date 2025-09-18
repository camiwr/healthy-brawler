import { Scene } from 'phaser';

export class GameOverScene extends Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        const restartButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'Clique para Tentar Novamente', {
            fontSize: '32px', color: '#fff'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            // Reinicia a cena da fase 1
            this.scene.start('LevelOneScene');
        });
    }
}
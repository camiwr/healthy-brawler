import { Scene } from 'phaser';

export class GameOverScene extends Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000');
        
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'gameover');

        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'Clique para Tentar Novamente', {
            fontSize: '24px', color: '#fff'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('LevelOneScene');
        });
    }
}
import { Scene } from 'phaser';
import { GameProgress } from '../utils/GameProgress'; // <-- Importe o assistente de progresso

export class LevelOneScene extends Scene {
    constructor() {
        super('LevelOneScene');
    }

    create() {
        this.add.text(10, 50, 'Fase 1 - Aperte "W" para Vencer!', { color: '#fff' });
        
        // --- ADICIONE O CÓDIGO ABAIXO ---
        // Cria um ouvinte para a tecla 'W'
        if (this.input.keyboard) {
            const winKey = this.input.keyboard.addKey('W');

            winKey.on('down', () => {
                console.log('Fase 1 vencida!');
                
                // Desbloqueia o próximo nível (passamos o número do nível atual)
                GameProgress.unlockNextLevel(1);

                // Volta para a tela de seleção de fases
                this.scene.start('LevelSelectScene');
            });
        } else {
            console.error('Keyboard input is not available.');
        }
    }
}
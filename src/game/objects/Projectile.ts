import { Physics, Scene } from 'phaser';

// Importa o Enum de Direção do Player
import { Direction } from './Player';

export class Projectile extends Physics.Arcade.Sprite {
    
    private speed = 400; // Velocidade do projétil

    constructor(scene: Scene, x: number, y: number) {
        // Usa o 'proj_1' (FB500-1.png) como textura base
        super(scene, x, y, 'proj_1');
    }

    // A cena vai chamar esta função quando o projétil for disparado
    public fire(direction: Direction): void {
        this.scene.physics.add.existing(this); // Adiciona à física

        // Ativa o projétil e o torna visível
        this.setActive(true).setVisible(true);

        // Toca a animação de "voar" em loop
        this.anims.play('projectile-fly', true);

        // Define a velocidade baseado na direção
        switch (direction) {
            case Direction.UP:
                this.setVelocity(0, -this.speed);
                break;
            case Direction.DOWN:
                this.setVelocity(0, this.speed);
                break;
            case Direction.LEFT:
                this.setVelocity(-this.speed, 0);
                break;
            case Direction.RIGHT:
                this.setVelocity(this.speed, 0);
                break;
        }

        // Define um "tempo de vida" para o projétil (2 segundos)
        // Isso garante que ele se destrua se não atingir nada
        this.scene.time.delayedCall(2000, () => {
            if (this.active) {
                this.destroy();
            }
        });
    }

    // Função que será chamada quando o projétil colidir
    public hit(): void {
        // (No futuro, podemos adicionar a animação de explosão aqui)
        this.destroy(); // Por enquanto, apenas destrói o projétil
    }
}
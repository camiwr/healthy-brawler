import { Scene, Physics } from 'phaser';
import { Player } from './Player';

export class Slime extends Physics.Arcade.Sprite {
    public health: number = 3;
    private player: Player;
    private moveSpeed: number = 40;

    constructor(scene: Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'slime');
        this.player = player;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.anims.play('slime-idle');
    }

    public takeDamage(damage: number): void {
        // Se o slime já está morrendo, não faça nada.
        if (!this.active) {
            return;
        }
        this.health -= damage;

        if (this.health <= 0) {
            // --- CORREÇÃO DA MORTE ---
            this.active = false; // Desativa o slime para que ele não se mova mais
            this.disableBody(true, false); // Desliga a física dele
            this.anims.play('slime-die'); // Toca a animação de morte

            // Ouve o evento 'animationcomplete'. Quando a animação de morte terminar...
            this.once('animationcomplete', () => {
                this.destroy(); // ...então remove o slime do jogo.
            });
            // -------------------------
        } else {
            // Efeito de piscar ao tomar dano
            this.scene.tweens.add({ targets: this, alpha: 0.5, duration: 100, yoyo: true });
        }
    }

    public update(): void {
        if (!this.active || !this.player.active) {
            this.setVelocity(0);
            return;
        }

        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
        if (distanceToPlayer < 150) {
            this.scene.physics.moveToObject(this, this.player, this.moveSpeed);
            this.anims.play('slime-move', true);
        } else {
            this.setVelocity(0);
            this.anims.play('slime-idle', true);
        }
    }
}
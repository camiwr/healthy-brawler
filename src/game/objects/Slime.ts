import { Scene, Physics } from 'phaser';
import { Player } from './Player';

// Enum para controlar o estado da animação
enum SlimeState {
    IDLE,
    MOVING,
    DYING 
}

export class Slime extends Physics.Arcade.Sprite {
    public health: number = 3;
    private player: Player;
    private moveSpeed: number = 40;
    
    private currentState: SlimeState;

    constructor(scene: Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'slime');
        this.player = player;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        this.currentState = SlimeState.IDLE;
        this.anims.play('slime-idle');
    }

    /**
     * Lógica de Dano e Morte (Corrigida)
     */
    public takeDamage(damage: number): void {
        // Se já está morrendo, não faça nada
        if (this.currentState === SlimeState.DYING) { // <-- 2. VERIFICA O NOVO ESTADO
            return;
        }
        this.health -= damage;

        if (this.health <= 0) {
            this.currentState = SlimeState.DYING;  
            this.disableBody(true, false);     
            this.anims.play('slime-die');      
            this.scene.time.delayedCall(500, () => {
                this.destroy();
            });
            
        } else {
            // Se ainda tem vida, só pisca
            this.scene.tweens.add({ targets: this, alpha: 0.5, duration: 100, yoyo: true });
        }
    }

    /**
     * Lógica de Update (Corrigida para Animação e Morte)
     */
    public update(): void {
        if (this.currentState === SlimeState.DYING) {
            return; 
        }

        // Se o player morreu, o slime para
        if (!this.player.active) {
            this.setVelocity(0);
            return;
        }

        // (Lógica de movimento normal)
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
        
        if (distanceToPlayer < 150) {
            this.scene.physics.moveToObject(this, this.player, this.moveSpeed);

            if (this.currentState !== SlimeState.MOVING) {
                this.anims.play('slime-move', true);
                this.currentState = SlimeState.MOVING;
            }
        } else {
            this.setVelocity(0);

            if (this.currentState !== SlimeState.IDLE) {
                this.anims.play('slime-idle', true);
                this.currentState = SlimeState.IDLE;
            }
        }
    }
}
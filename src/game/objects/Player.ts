import { Scene, Physics } from 'phaser';
import { Slime } from './Slime';

// Um 'enum' para guardar a direção de forma clara
enum Direction { UP, DOWN, LEFT, RIGHT }

export class Player extends Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private attackKey: Phaser.Input.Keyboard.Key;
    public health: number = 5;
    private isInvulnerable: boolean = false;
    private isAttacking: boolean = false;
    private facingDirection: Direction = Direction.DOWN; // Começa olhando para baixo

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        // Ajusta a "caixa" de colisão para ser mais precisa
        this.setSize(16, 16).setOffset(0, 16);

        if (this.scene && this.scene.input && this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            this.attackKey = this.scene.input.keyboard.addKey('SPACE');
        } else {
            throw new Error('Scene or keyboard input is not available.');
        }
    }

    public takeDamage(damage: number): void {
        // ... (o código de takeDamage continua o mesmo da versão anterior)
        if (this.isInvulnerable || !this.active) return;
        this.health -= damage;
        this.isInvulnerable = true;
        this.scene.events.emit('playerHealthChanged', this.health);

        if (this.health <= 0) {
            this.active = false;
            this.setVelocity(0);
            this.anims.play('player-die');
            this.once('animationcomplete', () => {
                this.scene.scene.start('GameOverScene');
            });
        } else {
            this.scene.tweens.add({
                targets: this, alpha: 0.5, duration: 150, yoyo: true, repeat: 4,
                onComplete: () => { this.isInvulnerable = false; this.setAlpha(1); }
            });
        }
    }
    
    // --- LÓGICA DE ATAQUE CORRIGIDA ---
    private attack(): void {
        if (this.isAttacking) return; // Se já está atacando, não faz nada
        this.isAttacking = true;
        this.setVelocity(0); // Para o jogador para poder atacar

        // Toca a animação de ataque baseada na direção que o jogador está olhando
        let animKey: string;
        switch (this.facingDirection) {
            case Direction.UP: animKey = 'player-attack-up'; break;
            case Direction.DOWN: animKey = 'player-attack-down'; break;
            default: animKey = 'player-attack-side'; break;
        }
        this.anims.play(animKey);

        // A lógica de dano real
        const attackRange = 40;
        const slimes = (this.scene as LevelOneScene).getSlimesGroup();
        slimes.children.each(child => {
            const slime = child as Slime;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, slime.x, slime.y);
            if (distance < attackRange) {
                slime.takeDamage(1);
            }
            return null; // or return false; either is valid
        });

        // Espera a animação de ataque terminar para permitir que o jogador se mova/ataque de novo
        this.once('animationcomplete', () => {
            this.isAttacking = false;
        });
    }

    // --- LÓGICA DE MOVIMENTO E ANIMAÇÃO CORRIGIDA ---
    private handleMovementAndAnimation(): void {
        const speed = 175;
        this.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.flipX = true; // Vira o sprite para a esquerda
            this.facingDirection = Direction.LEFT;
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(speed);
            this.flipX = false; // Vira para a direita
            this.facingDirection = Direction.RIGHT;
        }

        if (this.cursors.up.isDown) {
            this.setVelocityY(-speed);
            this.facingDirection = Direction.UP;
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(speed);
            this.facingDirection = Direction.DOWN;
        }

        // Agora, atualiza a animação com base na velocidade e direção
        if (this.body && this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            // Se parado, toca a animação 'idle' correspondente
            this.anims.stop(); // Para a animação anterior
        } else if (this.body) {
            // Se movendo, toca a animação de andar correta
            if (this.facingDirection === Direction.DOWN) this.anims.play('player-walk-down', true);
            else if (this.facingDirection === Direction.UP) this.anims.play('player-walk-up', true);
            else this.anims.play('player-walk-side', true);
        }
    }

    public update() {
        if (!this.active) return; // Se estiver morrendo, não faz nada

        // Se o jogador pressionar o ataque
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.attack();
        }

        // Se o jogador não estiver atacando, ele pode se mover
        if (!this.isAttacking) {
            this.handleMovementAndAnimation();
        }
    }
}
// Adiciona a referência para a cena para o TypeScript não reclamar
type LevelOneScene = import('../scenes/LevelOneScene').LevelOneScene;
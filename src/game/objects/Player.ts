import { Scene, Physics } from 'phaser';
import { Slime } from './Slime';
import { Projectile } from './Projectile';

// O 'enum' Direction agora será usado pelo Projectile também
export enum Direction { UP, DOWN, LEFT, RIGHT }

export class Player extends Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private attackKey: Phaser.Input.Keyboard.Key;
    
    public health: number; // Será definido no construtor
    private maxHealth: number = 5; // Define a vida máxima
    private isInvulnerable: boolean = false;
    private isAttacking: boolean = false;
    private facingDirection: Direction = Direction.DOWN; 

    // --- 1. Adicionada a propriedade para guardar os projéteis ---
    private projectiles: Phaser.Physics.Arcade.Group;

    // --- 2. Construtor modificado para receber o grupo de projéteis ---
    constructor(scene: Scene, x: number, y: number, projectiles: Phaser.Physics.Arcade.Group) {
        super(scene, x, y, 'player');
        
        this.projectiles = projectiles; // <-- Armazena o grupo
        this.health = this.maxHealth; // Define a vida inicial

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setSize(16, 16).setOffset(0, 16);

        if (this.scene && this.scene.input && this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            this.attackKey = this.scene.input.keyboard.addKey('SPACE');
        } else {
            throw new Error('Scene or keyboard input is not available.');
        }
    }

    public takeDamage(damage: number): void {
        if (this.isInvulnerable || !this.active) return;
        this.health -= damage;
        this.isInvulnerable = true;
        this.scene.events.emit('playerHealthChanged', this.health);

        if (this.health <= 0) {
            this.active = false;
            this.setVelocity(0);
            
            // // Sugestão 3 (animação de morte) que discutimos antes:
            // this.anims.play('player-die');
            // this.once('animationcomplete', () => {
                this.scene.scene.pause(this.scene.scene.key); // Pausa a cena atual
                this.scene.scene.launch('GameOverScene', { 
                    parentSceneKey: this.scene.scene.key 
                });
            // });
        } else {
            this.scene.tweens.add({
                targets: this, alpha: 0.5, duration: 150, yoyo: true, repeat: 4,
                onComplete: () => { this.isInvulnerable = false; this.setAlpha(1); }
            });
        }
    }
    
    public gainHealth(amount: number): void {
        if (!this.active) return;
        this.health += amount;

        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }

        this.scene.events.emit('playerHealthChanged', this.health);
        
        this.scene.tweens.add({ 
            targets: this, 
            alpha: 0.5, 
            tint: 0x00ff00,
            duration: 100, 
            yoyo: true,
            onComplete: () => {
                this.clearTint();
                this.setAlpha(1);
            }
        });
    }
    
    // --- 3. LÓGICA DE ATAQUE MODIFICADA (Simplificada) ---
    private attack(): void {
        if (this.isAttacking) return; 
        this.isAttacking = true;
        this.setVelocity(0); 

        // Toca a animação de ataque
        let animKey: string;
        switch (this.facingDirection) {
            case Direction.UP: animKey = 'player-attack-up'; break;
            case Direction.DOWN: animKey = 'player-attack-down'; break;
            default: animKey = 'player-attack-side'; break;
        }
        this.anims.play(animKey);

        const projectile = this.projectiles.get(this.x, this.y) as Projectile;7
        
        if (projectile) {
            projectile.setDisplaySize(24, 24); 
            projectile.fire(this.facingDirection);
        }

        this.once('animationcomplete', () => {
            this.isAttacking = false;
        });
    }
    // --- FIM DA LÓGICA DE ATAQUE ---

    private handleMovementAndAnimation(): void {
        const speed = 175;
        this.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.flipX = true; 
            this.facingDirection = Direction.LEFT;
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(speed);
            this.flipX = false; 
            this.facingDirection = Direction.RIGHT;
        }

        if (this.cursors.up.isDown) {
            this.setVelocityY(-speed);
            this.facingDirection = Direction.UP;
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(speed);
            this.facingDirection = Direction.RIGHT;
        }

        if (this.body && this.body.velocity.x === 0 && this.body.velocity.y === 0) {
            this.anims.stop();
        } else if (this.body) {
            if (this.facingDirection === Direction.DOWN) this.anims.play('player-walk-down', true);
            else if (this.facingDirection === Direction.UP) this.anims.play('player-walk-up', true);
            else this.anims.play('player-walk-side', true);
        }
    }

    public update() {
        if (!this.active) return; 

        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.attack();
        }

        if (!this.isAttacking) {
            this.handleMovementAndAnimation();
        }
    }
}

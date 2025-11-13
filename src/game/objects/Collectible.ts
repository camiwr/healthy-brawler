import { Physics, Scene } from 'phaser';

export class Collectible extends Physics.Arcade.Sprite {
    
    private itemType: string;
    private isCollected: boolean = false; // <-- 1. Adiciona estado de coleta

    constructor(scene: Scene, x: number, y: number, texture: string, animKey: string, type: string) {
        super(scene, x, y, texture);
        
        this.itemType = type;
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.anims.play(animKey, true);
        
        scene.tweens.add({
            targets: this,
            y: y - 5,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    public collect(): string {
        // Se já foi coletado, não faz nada
        if (this.isCollected) {
            return '';
        }

        this.isCollected = true; // <-- 2. Define o estado
        this.disableBody(true, false); 
        this.scene.tweens.killTweensOf(this);
        this.anims.play('item-collected', true); // <-- 3. Toca a animação

        // Removemos o 'this.once()' que estava a falhar
        
        return this.itemType;
    }

    public update(): void {
        if (this.isCollected) {
            // ...e a animação "item-collected" terminou de tocar (progresso == 1)
            if (this.anims.currentAnim && this.anims.currentAnim.key === 'item-collected' && this.anims.getProgress() === 1) {
                this.destroy(); // Destrói o objeto
            }
        }
    }
}
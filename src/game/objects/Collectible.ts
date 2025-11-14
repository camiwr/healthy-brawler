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
        if (this.isCollected) {
            return '';
        }

        this.isCollected = true; 
        this.disableBody(true, false);
        this.scene.tweens.killTweensOf(this);


        return this.itemType;
    }

    public update(): void {
        if (this.isCollected) {
            this.destroy();
        }
    }
}
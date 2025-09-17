import { Scene, Physics } from 'phaser';

export class Player extends Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.cursors = this.scene.input.keyboard
            ? this.scene.input.keyboard.createCursorKeys()
            : { up: { isDown: false }, down: { isDown: false }, left: { isDown: false }, right: { isDown: false } } as Phaser.Types.Input.Keyboard.CursorKeys;
    }

    public update() {
        const speed = 175;
        this.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
            this.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(speed);
        }
    }
}
import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress: number) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.image('logo_brawler', 'logo-healthy-brawler.png');
        this.load.image('apple', './fruits/apple.png');
        this.load.image('banana', './fruits/banana.png');
        this.load.image('carrot', './fruits/carrot.png');
        this.load.image('grape', './fruits/grape.png');
        this.load.image('pineapple', './fruits/pineapple.png');
        this.load.image('strawberry', './fruits/strawberry.png');
        this.load.image('watermelon', './fruits/watermelon.png');
        this.load.image('tomato', './fruits/tomato.png');
        this.load.image('corn', './fruits/corn.png');
        this.load.image('lime', './fruits/lime.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('SplashScreen');
    }
}

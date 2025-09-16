import { Boot } from './scenes/BootScene';
import { GameOver } from './scenes/GameOverScene';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/PreloaderScene';
import { SplashScreen } from './scenes/SplashScreen';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { LevelOneScene } from './scenes/LevelOneScene';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1224,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
     physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
        }
    },
    scene: [
        Boot,
        Preloader,
        SplashScreen,
        LevelSelectScene,
        LevelOneScene,
        GameOver,
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;

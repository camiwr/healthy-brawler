import { Boot } from './scenes/BootScene';
import { GameOver } from './scenes/GameOverScene';
import { Game as MainGame } from './scenes/LevelOneScene';
import { MainMenu } from './scenes/MainMenuScene';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/PreloaderScene';
import { SplashScreen } from './scenes/SplashScreen';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
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
        MainMenu,
        MainGame,
        GameOver,
        SplashScreen
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;

import { Boot } from './scenes/BootScene';
import { GameOverScene } from './scenes/GameOverScene';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/PreloaderScene';
import { SplashScreen } from './scenes/SplashScreen';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { LevelOneScene } from './scenes/LevelOneScene';
import { UIScene } from './scenes/UIScene';
import { VictoryScene } from './scenes/VictoryScene';
import { TutorialScene } from './scenes/TutorialScene';
import { EducationScene } from './scenes/EducationScene';
import { LevelTwoScene } from './scenes/LevelTwoScene';
import { LevelThreeScene } from './scenes/LevelThreeScene';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    scale: {
        parent: 'game-container',
        mode: Scale.FIT, 
        autoCenter: Scale.CENTER_BOTH, 
        width: 1000,
        height: 540
    },
    pixelArt: true,
    backgroundColor: '#78c3fb',
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
        LevelTwoScene,
        LevelThreeScene,
        GameOverScene,
        UIScene,
        VictoryScene,
        TutorialScene,
        EducationScene,
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;

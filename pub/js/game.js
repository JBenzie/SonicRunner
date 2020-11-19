import TitleScene from './titleScene.js';
import GameScene from './gameScene.js';

window.onload = function() {

  // Our game scene
  var gameScene = new GameScene();
  var titleScene = new TitleScene();

  //* Game scene */
  var config = {
    type: Phaser.AUTO,
    width: 1334,
    height: 750,
    backgroundColor: 0x000000,
    physics:{
      default: "arcade",
      arcade: {
        debug: false
      }        
    } 
  };
  var game = new Phaser.Game(config);
  // global game options
  game.gameOptions = {

    // platform speed range, in pixels per second
    platformSpeedRange: [250, 250],

    // tree speed, in pixels per second
    treeSpeed: 60,

    // spawn range, how far should be the rightmost platform from the right edge
    // before next platform spawns, in pixels
    spawnRange: [80, 300],

    // platform width range, in pixels
    platformSizeRange: [90, 300],

    // a height range between rightmost platform and next platform to be spawned
    platformHeightRange: [-5, 5],

    // a scale to be multiplied by platformHeightRange
    platformHeighScale: 20,

    // platform max and min height, as screen height ratio
    platformVerticalLimit: [0.4, 0.8],

    // player gravity
    playerGravity: 900,

    // player jump force
    jumpForce: 450,

    // player starting X position
    playerStartPosition: 350,

    // consecutive jumps allowed
    jumps: 2,

    // % of probability a ring appears over the platform
    ringPercent: 65,

    // % of probability spikes appear on the platform
    spikePercent: 65,

    // turn bg music on/off
    musicPlaying: false
  }
  window.focus();
  resize();
  window.addEventListener("resize", resize, false);

  function resize(){
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
  }

// load scenes
game.scene.add('titleScene', titleScene);
game.scene.add('gameScene', gameScene);

// start title
game.scene.start('titleScene');

}




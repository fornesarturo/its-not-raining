// This script setups the scene manager and 
// constants to be used throughout the game.

// Canvas constants.
const WIDTH = 900;
const HEIGHT = 900;
// The 'raindrops' seen in the background
// of the menu and the leaderboard, the ones
// you, the player, is trying to stop.
var drops = [];

// To store the name of the player
var SCORES = {};

// JSON to store various sounds to be used.
var SOUNDS = {};

function preload() {
    soundFormats('mp3','ogg');
    // Music: www.bensound.com
    SOUNDS.backgroundMusic = loadSound('./../sounds/bensound-scifi.ogg');
    SOUNDS.backgroundMusic.setVolume(0.3);
    // Sound Actor: Güereca
    SOUNDS.pew = loadSound('./../sounds/pewGuereca.ogg');
    SOUNDS.pew.setVolume(0.1);
    // Sound from: SlykMrbyches
    SOUNDS.enemyDeath = loadSound('./../sounds/slykmrbyches-splattt.ogg');
    SOUNDS.enemyDeath.setVolume(0.3);
    // Sound Actor: Martell
    SOUNDS.jump = loadSound('./../sounds/jumpMartell.ogg');
}

function setup() {
    createCanvas(WIDTH, HEIGHT);
    // From lib/scenemanager.js
    var mgr = new SceneManager();
    // .wire() connects the 'draw', 'mousePressed', and 
    // 'keyPressed' events from P5.
    mgr.wire();
    mgr.addScene(Menu);
    mgr.addScene(Game);
    mgr.addScene(Leaderboard);
    mgr.addScene(Submit);
    mgr.addScene(Lore);

    // Create the 'raindrops' that will be drawn.
    for (var i = 0; i < 100; i++) {
        // From objects/drop.js
        drops[i] = new Drop();
    }

    // Start the background music.
    SOUNDS.backgroundMusic.loop();

    // Start by showing the Menu scene.
    mgr.showScene(Menu);
}
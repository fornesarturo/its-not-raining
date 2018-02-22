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
var NICKNAME = "";

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

    // Create the 'raindrops' that will be drawn.
    for (var i = 0; i < 100; i++) {
        // From objects/drop.js
        drops[i] = new Drop();
    }

    // Start by showing the Menu scene.
    mgr.showScene(Menu);
}
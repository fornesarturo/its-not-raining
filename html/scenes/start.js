const WIDTH = 900;
const HEIGHT = 900;

function setup() {
    createCanvas(WIDTH, HEIGHT);

    var mgr = new SceneManager();
    mgr.wire();
    mgr.addScene(Menu);
    mgr.addScene(Game);
    mgr.addScene(Leaderboard);
    mgr.showScene(Menu);
}
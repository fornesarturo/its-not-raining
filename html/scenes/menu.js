function Menu() {
    this.setup = () => {

    }

    this.draw = () => {
        background(0, 0, 0);
        fill(255, 255, 255);
        textSize(100);
        text("MENU", 300, 200);

        textSize(80);
        text("Press '1' to play", 150, 400);

        textSize(80);
        text("Press '2' for leaderboard", 175, 600, 500);
    }

    this.keyPressed = () => {
        switch(key) {   
            case '1':
                console.log("Game");
                this.sceneManager.showScene(Game);
                break;
            case '2':
                console.log("Leaderboard");
                this.sceneManager.showScene(Leaderboard); 
                break;   
        }
    }
}
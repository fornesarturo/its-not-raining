function Menu() {
    var drops = [];
    this.setup = () => {
        for (var i = 0; i < 100; i++) {
            drops[i] = new Drop();
        }
    }

    this.draw = () => {
        background(0);
        textAlign(CENTER, CENTER);
        rectMode(CENTER);

        drawText();
        
        // Draw rain
        for (var i = 0; i < drops.length; i++) {
            drops[i].fall();
            drops[i].show();
        }
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

    function drawText() {
        translate(WIDTH / 2, 0);
        strokeWeight(6);
        stroke(255);
        fill(0, 0);
        rect(0, HEIGHT * 0.15, 600, 130);
    
        fill(255);
        noStroke();
        textFont('Arial');
    
        textSize(80);
        text("It's Not Raining", 0, HEIGHT * 0.15);
    
        textSize(50);
        text("MENU", 0, HEIGHT * 0.4);
    
        textSize(40);
        text("> Press '1' to play", 0, 650);
    
        textSize(40);
        text("> Press '2' for leaderboard", 0, 750);
    }
}
// This scene represents the menu.
// It acts as the HUB and 'main' scene for It's not raining,
// having connections to both the game and the leaderboard.
function Menu() {
    this.setup = () => {
        // What will happen the first time this Scene is loaded.
    }

    this.draw = () => {
        // 
        background(0);
        textAlign(CENTER, CENTER);
        rectMode(CENTER);

        drawText();
        
        // Draw the 'raindrops'
        for (var i = 0; i < drops.length; i++) {
            drops[i].fall();
            drops[i].show();
        }
    }

    this.keyPressed = () => {
        switch(key) {   
            case '1':
                // Load the Game scene.
                this.sceneManager.showScene(Game);
                break;
            case '2':
                // Load the Leaderboard scene.
                this.sceneManager.showScene(Leaderboard); 
                break;
            case '3':
                // Load the Leaderboard scene.
                this.sceneManager.showScene(Lore); 
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

        textSize(40);
        text("> Press '3' to read the Lore", 0, 850);
    }
}
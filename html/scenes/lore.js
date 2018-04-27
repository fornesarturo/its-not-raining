function Lore() {
    this.setup = () => {

    }

    this.draw = () => {
        background(0);

        drawLore();

        // Draw the 'raindrops'
        for (var i = 0; i < drops.length; i++) {
            drops[i].fall();
            drops[i].show();
        }
    }

    this.keyPressed = () => {
        switch(key) {
            case '1':
                // Load the Menu scene to 'go back'.
                this.sceneManager.showScene(Menu);
                break;
        }
    }

    function drawLore() {
        // Align
        textAlign(CENTER, CENTER);
        rectMode(CENTER);
        translate(WIDTH / 2, 0);

        // Rectangle surrounding title.
        strokeWeight(6);
        stroke(255);
        fill(0, 0);
        rect(0, HEIGHT * 0.165, STRINGS[LANG].loreTitleWidth, 100);
        
        // Title
        fill(255);
        noStroke();
        textSize(80);
        text(STRINGS[LANG].loreTitle, 0, 150);
    
        textSize(40);
        text(STRINGS[LANG].lore, HEIGHT * 0.025, HEIGHT / 2, HEIGHT * 0.8, HEIGHT);

        textSize(30);
        text(STRINGS[LANG].pressToReturn, 0, 870);
    }
}


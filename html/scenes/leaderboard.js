// This scene shows the leaderboard.
// It calls the server to get the score and trims it down
// to the best 10 scores.
function Leaderboard() {

    // Flag to check if the request to the server is completed.
    var ready = false;

    // Store locally the server's response.
    var leaderboardJSON;
    var leaderboardLength;

    this.enter = () => {
        // This function runs everytime one enters
        // the scene.
        
        // Set the options to match our server.
        var options = {
            hostname: 'localhost',
            port: 1337,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        };
        // GET the score JSON and store it in a scene variable
        fetch("/score", options)
            .then(res => res.json())
            .then(resJSON => {
                leaderboardJSON = resJSON;
                ready = true;
                if (leaderboardJSON.length >= 10)
                    leaderboardLength = 10;
                else
                    leaderboardLength = leaderboardJSON.length;
            });
    }

    this.setup = () => {

    }

    this.draw = () => {
        background(0, 0, 0);
        if (ready) {
            // Rectangle surrounding title.
            strokeWeight(6);
            stroke(255);
            fill(0, 0);
            rect(HEIGHT * 0.15, HEIGHT * 0.06, 650, 130);

            // Title
            fill(255);
            noStroke();
            textSize(80);
            text("Leaderboard", HEIGHT * 0.25, 150);
            // Bottom hint to return to menu.
            textSize(30);
            text("> Press '1' to return", 60, 870);
            // Leaderboard Table.
            textSize(50);
            for (let i = 0; i < leaderboardLength; i++) {
                fill(255, 255, 255);
                let score = leaderboardJSON[i].score.toString();
                let userId = leaderboardJSON[i].userId;
                text((i + 1).toString(), 195, 270 + i*60);
                text(score, 345, 270 + i*60);
                text(userId, 605, 270 + i*60);
            }

            // Draw the 'raindrops'
            for (var i = 0; i < drops.length; i++) {
                drops[i].fall();
                drops[i].show();
            }   
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
}
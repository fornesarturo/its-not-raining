function Leaderboard() {

    var ready = false;
    var leaderboardJSON;
    var leaderboardLength;

    this.enter = () => {
        var options = {
            hostname: 'localhost',
            port: 1337,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET'
        };
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
            fill(255, 255, 255);
            textSize(100);
            text("LEADERBOARD", 100, 200);
            textSize(30);
            text("Press '1' to return", 100, 850);
            textSize(50);
            for (let i = 0; i < leaderboardLength; i++) {
                fill(255, 255, 255);
                let toWrite = leaderboardJSON[i].score.toString() + "\t\t" + leaderboardJSON[i].userId;
                text(toWrite, 225, 300 + i*50);
            }
        }
    }

    this.keyPressed = () => {
        switch(key) {
            case '1':
                this.sceneManager.showScene(Menu);
                break;
        }
    }
}
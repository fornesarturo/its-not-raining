function Submit() {
    var self = this;

    var L;
    var current;

    this.enter = () => {
        // This function runs everytime one enters
        // the scene.
        L = [null, "A", "A", "A", "A"];
        current = 1;
    }

    this.setup = () => {
    }

    this.draw = () => {
        background(0, 0, 0);
        // translate(WIDTH / 2.0, 0);

        rectMode(CENTER);
        strokeWeight(6);
        stroke(255);
        fill(0, 0);
        rect(WIDTH / 2.0, HEIGHT * 0.15, 800, 130);

        textAlign(CENTER, CENTER);
        fill(255);
        noStroke();
        textSize(80);
        text(STRINGS[LANG].scoreTitle, WIDTH / 2.0, 150);

        textAlign(CENTER, CENTER);
        fill(255);
        noStroke();
        textSize(80);
        text(STRINGS[LANG].scoreSubmit, WIDTH / 2.0, HEIGHT * (4/5));

        textAlign(CENTER, CENTER);
        fill(255);
        noStroke();
        textSize(80);
        text(L[1], WIDTH * (1 / 5), HEIGHT / 2.0);

        textAlign(CENTER, CENTER);
        fill(255);
        noStroke();
        textSize(80);
        text(L[2], WIDTH * (2 / 5), HEIGHT / 2.0);

        textAlign(CENTER, CENTER);
        fill(255);
        noStroke();
        textSize(80);
        text(L[3], WIDTH * (3 / 5), HEIGHT / 2.0);

        textAlign(CENTER, CENTER);
        fill(255);
        noStroke();
        textSize(80);
        text(L[4], WIDTH * (4 / 5), HEIGHT / 2.0);

        if (keyWentDown("right"))
            current = min(current + 1, 4);

        if (keyWentDown("left"))
            current = max(current - 1, 1);

        if (keyWentDown("up"))
            if (L[current] == 'Z'){
                L[current] = 'A';
            }
            else {
                L[current] = String.fromCharCode(
                    min(
                        L[current].charCodeAt(0) + 1,
                        "Z".charCodeAt(0)
                    )
                );
            }

        if (keyWentDown("down"))
            if (L[current] == 'A'){
                L[current] = 'Z';
            }
            else {
                L[current] = String.fromCharCode(
                    max(
                        L[current].charCodeAt(0) - 1,
                        "A".charCodeAt(0)
                    )
                );
            }

        if (keyWentDown("space"))
            storeName();

        drawArrows(current);
    }

    function drawArrows(i) {
        let x, y;
        x = WIDTH * (i / 5.0);
        y = HEIGHT / 2.0;
        strokeWeight(6);
        stroke(255);
        fill(255, 255, 255);
        triangle(x - 10, y - 50, x + 10, y - 50, x, y - 20 - 50);
        triangle(x - 10, y + 50, x + 10, y + 50, x, y + 20 + 50);
        triangle(x + 50, y + 10, x + 50, y - 10, x + 50 + 20, y);
        triangle(x - 50, y + 10, x - 50, y - 10, x - 50 - 20, y);
    }

    function storeName(){
        let nickname = L[1] + L[2] + L[3] + L[4];
        SCORES["userId"] = nickname;
        postScore();
        self.sceneManager.showScene(Leaderboard);
    }

    function postScore() { 
        var data = {
            userId: SCORES["userId"],
            score: SCORES["score"]
        }
        var options = {
            hostname: 'localhost',
            port: 1337,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        };
        fetch("/score", options)
        .then(res => {
            console.log(res);
        });
    }
}

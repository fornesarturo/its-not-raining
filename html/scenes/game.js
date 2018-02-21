// This scene show the game itself.
// This is where the gameplay lies.
function Game() {
    // To be able to use 'this'-like stuff in functions inside
    // anonymous functions.
    var self = this;
    // Gameplay constants
    const SPEED = 7;
    const GRAVITY = 1;
    const JUMP = 15;
    const WALL_GRAB = 2;
    // Margin
    const leftWall = 0;
    const rightWall = 899;

    // Level loading
    var levelLoaded, levelId;
    // Time
    var timeStart, timeEnd;
    // Sprites
    var player;
    // Structures
    var walls, end;
    // Obstacles and enemies
    var obstacles;
    // Text
    var textToDraw;

    // Flags
    var direction, waitForMovement;
    var levelEnded;

    // Store the current level that's being played
    // locally.
    var currentLevel;

    var scores;

    this.enter = () => {
        // Groups for the sprites that function in the same way.
        walls = Group();
        obstacles = Group();
        scores = {};
        levelId = 1;
        levelLoaded = false;
        let data = { "id": levelId };
        loadLevel(data);
    }

    this.setup = () => {
        
    }

    function loadLevel(data) {
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
        fetch("/getLevel", options)
        .then(res => res.json())
        .then(resJSON => {
            currentLevel = resJSON;
            timeStart = new Date();
            reset(currentLevel);
        });
    }

    function reset(res) {
        if (res == null){
            endGame();
            return;
        }
        textToDraw = false;
        // Build from request response.
        for(var key in res) {
            if(res.hasOwnProperty(key)) {
                if(key == "end") {
                    var endJSON = res[key];
                    end = createSprite(endJSON[0], endJSON[1], endJSON[2], endJSON[3]);
                }
                else if(key == "obstacles") {
                    var obstaclesJSON = res[key];
                    var l = obstaclesJSON.length;
                    for(var i = 0; i < l; i++) {
                        index = obstaclesJSON[i].coordinates;
                        let obst = createSprite(index[0], index[1], index[2], index[3]);
                        obst.shapeColor = color(255);
                        obst.setupFunc = eval(obstaclesJSON[i].setup);
                        obst.behaviourFunc = eval(obstaclesJSON[i].behaviour);
                        obstacles.add(obst);
                    }
                }
                else if(key == "structures") {
                    var structuresJSON = res[key];
                    var l = structuresJSON.length;
                    for(var i = 0; i < l; i++) {
                        index = structuresJSON[i]
                        let wall = createSprite(index[0], index[1], index[2], index[3]);
                        walls.add(wall);
                    }
                }
                else if(key == "player") {
                    var playerJSON = res[key];
                    player = createSprite(playerJSON[0], playerJSON[1], 25, 25);
                    player.position.x = playerJSON[0];
                    player.position.y = playerJSON[1];
                }
                else if(key == "text") {
                    textToDraw = res[key];
                }
            }
        }

        for(let i = 0; i < obstacles.length; i++) {
            obstacles[i].setupFunc(obstacles[i]);
        }

        waitForMovement = false;
        levelEnded = false;
        player.velocity.x = 0;
        timeEnd = new Date();
        levelLoaded = true;
        updateSprites(true);
    }

    this.draw = () => {
        background(0, 0, 0);
        // Draw GameOverText
        if (textToDraw && levelEnded)
            drawText();
        if(levelLoaded) {

            // Draw text if there's any.
            if (textToDraw)
                drawText();

            if (!waitForMovement)
                player.velocity.x = 0;

            // Restric position outside of canvas
            if (player.position.x <= leftWall)
                player.position.x = leftWall + 2;
            if (player.position.x >= rightWall)
                player.position.x = rightWall - 2;

            // Basic Movement.
            if (keyDown("left")) {
                if (!waitForMovement)
                    player.velocity.x = -SPEED;
            }
            if (keyDown("right")) {
                if (!waitForMovement)
                    player.velocity.x = SPEED;
            }

            // Stop Movement.
            if (keyWentUp("left") || keyWentUp("right")) {
                if (!waitForMovement) {
                    player.velocity.x = 0;
                }
            }

            player.collide(walls, (sprite, target) => {
                if ((sprite.touching.left || sprite.touching.right) && !sprite.touching.bottom) {
                    player.velocity.y = WALL_GRAB;
                    direction = target.position.x - sprite.position.x;
                }
                else if (sprite.touching.bottom) {
                    sprite.velocity.y = 0.001;
                }
                if (sprite.touching.top){
                    player.velocity.y = 0;
                }
            });

            if (!player.touching.bottom)
                player.velocity.y += GRAVITY;

            if (keyWentDown("space")) {
                if ((player.touching.left || player.touching.right) && !player.touching.bottom) {
                    waitForMovement = true;
                    if (direction < 0) {
                        player.setSpeed(20, -55);
                    } else {
                        player.setSpeed(20, -125);
                    }
                    setTimeout(() => {
                        waitForMovement = false;
                    }, 200);
                } else if (player.touching.bottom) {
                    player.velocity.y = -JUMP;
                }
            }

            // Obstacles interactions
            player.overlap(obstacles, (sprite, target) => {
                levelLoaded = false;
                restartLevel();
            });

            // Update obstacles
            for(let i = 0; i < obstacles.length; i++)
                obstacles[i].behaviourFunc(obstacles[i]);

            player.overlap(end, (sprite, target) => {
                levelEnded = true;
                levelLoaded = false;
                levelEnd();
            });

            player.debug = mouseIsPressed;
            drawSprites();
            
            if(!levelEnded)
                timeEnd = new Date();
            updateTimer();
        }
    }

    function updateTimer(){
        let timer = timeEnd - timeStart;
        let seconds = Math.floor((timer) / 1000);
        let ms = Math.floor(timer % 1000);
        // Add timer
        textSize(40);
        fill(255, 255, 255);
        text(seconds + "." + ms , WIDTH / 10, HEIGHT / 10);
    }

    function restartLevel() {
        walls.removeSprites();
        obstacles.removeSprites();
        clearSprites();
        reset(currentLevel);
    }

    function forcedRestartLevel() {
        walls.removeSprites();
        obstacles.removeSprites();
        clearSprites();
        let data = { "id": levelId };
        loadLevel(data);
    }

    function levelEnd() {
        let timer = timeEnd - timeStart;
        let seconds = Math.floor((timer) / 1000);
        let ms = Math.floor(timer % 1000);
        scores[levelId] = timer;
        textToDraw = [{
            fill: [255, 255, 255],
            textSize: 60,
            texts: [["Level Cleared!\n" + seconds + "." + ms + "s", WIDTH/2 - 200, HEIGHT/2, 424, 1000]]
        }];
        updateSprites(false);
        clearSprites();
        let data = { "id" : ++levelId };
        loadLevel(data);
    }

    function clearSprites() {
        player.remove();
        end.remove();
        walls.removeSprites();
        obstacles.removeSprites();
        while (walls.length > 0)
            walls[0].remove();
        while (obstacles.length > 0)
            obstacles[0].remove();
    }

    function drawText() {
        let l = textToDraw.length;
        
        for (let i = 0; i < l; i++) {
            let instance = textToDraw[i];
            fill(instance.fill[0], instance.fill[1], instance.fill[2]);
            textSize(instance.textSize);
            for (let textIndex in instance.texts) {
                let textInstance = instance.texts[textIndex];
                if (textInstance.length == 5){
                    text(textInstance[0], textInstance[1], textInstance[2], textInstance[3], textInstance[4]);}
                else if (textInstance.length == 3)
                    text(textInstance[0], textInstance[1], textInstance[2]);
            }
        }
    }

    function getNickname(){
        let exp = /^[a-z0-9]+$/i;
        let nickname = prompt("Enter a nickname:");
        while (nickname == "" || nickname == null || nickname.length != 4 || nickname !== nickname.toUpperCase() || !nickname.match(exp)){
            nickname = prompt("Please entera valid nickname:");
        }
        return nickname;
    }

    function endGame(){
        let nickname = getNickname();
        let total = 0;
        for (let i = 1; i < levelId; i++){
            total += scores[i];
        }
        scores["userId"] = nickname;
        scores["score"] = total;
        console.log(scores);
        postScore();
        levelEnded = false;
        scores = {};
        levelId = 1;
        levelLoaded = false;
        let data = { "id" : levelId };
        self.sceneManager.showScene(Leaderboard);
    }

    function postScore(){
        var data = {
            userId: scores["userId"],
            score: scores["score"]
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

    this.keyPressed = () => {
        switch(keyCode) {
            case CONTROL:
                // Force reloading.
                forcedRestartLevel();
                break;
        }
    }
}

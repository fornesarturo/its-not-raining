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
    // Display text duration
    const ENEMY_POINTS_DURATION = 1000;
    // Destroyed enemy array positions
    const enemyPosX = 0;
    const enemyPosY = 1;
    const enemyKillTime = 2;

    // Level loading
    var levelLoaded, levelId;
    // Time
    var timeStart, timeEnd;
    // Sprites
    var player;
    // Bullets
    var bullets;
    // Structures
    var walls, end;
    // Obstacles and enemies
    var obstacles, bounceWalls, bonice;
    // multiple bounce helper
    var currentBounce;
    // Text
    var textToDraw;

    // Flags
    var direction, waitForMovement;
    var levelEnded;

    var destroyedEnemies;

    // Store the current level that's being played
    // locally.
    var currentLevel;

    this.enter = () => {
        // Groups for the sprites that function in the same way.
        walls = Group();
        obstacles = Group();
        bullets = Group();
        bonice = Group();
        bounceWalls = Group();
        SCORES = {};
        levelId = 1;
        levelLoaded = false;
        let data = { "id": levelId };
        loadLevel(data);
    }

    this.setup = () => { }

    async function loadLevel(data) {
        let options = {
            hostname: 'localhost',
            port: 1337,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        };
        return await fetch("/getLevel", options)
        .then(res => res.json())
        .then(resJSON => {
            currentLevel = resJSON;
            SCORES[levelId] = 0;
            timeStart = new Date();
            reset(currentLevel);
        });
    }

    async function loadText(id) {
        let options = {
            hostname: 'localhost',
            port: 1337,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'GET',
        };
        let url = "/getLevelText?id=" + id;
        return await fetch(url, options)
        .then(res => {
            return res.json()
        })
        .then(resJSON => {
            return resJSON;
        });
    }

    function reset(res) {
        // When you've played the last level, the server responds with a 'null'
        // when asked for the next level.
        if (res == null){
            endGame();
            return;
        }
        textToDraw = false;
        destroyedEnemies = [];
        // Build from request response.
        for(let key in res) {
            if(res.hasOwnProperty(key)) {
                if(key == "end") {
                    let endJSON = res[key];
                    end = createSprite(endJSON[0], endJSON[1], endJSON[2], endJSON[3]);
                    end.shapeColor = color(40, 169, 183);
                }
                else if(key == "obstacles") {
                    let obstaclesJSON = res[key];
                    let l = obstaclesJSON.length;
                    for(let i = 0; i < l; i++) {
                        index = obstaclesJSON[i].coordinates;
                        let obst = createSprite(index[0], index[1], index[2], index[3]);
                        if(obstaclesJSON[i].colorFill) {
                            obst.shapeColor = color(obstaclesJSON[i].colorFill);
                        }
                        else {
                            obst.shapeColor = color(255);
                        }
                        obst.setupFunc = eval(obstaclesJSON[i].setup);
                        obst.behaviourFunc = eval(obstaclesJSON[i].behaviour);
                        obst.immune = obstaclesJSON[i].immune || false;
                        obstacles.add(obst);
                    }
                }
                else if(key == "structures") {
                    let structuresJSON = res[key];
                    let l = structuresJSON.length;
                    for(let i = 0; i < l; i++) {
                        index = structuresJSON[i]
                        let wall = createSprite(index[0], index[1], index[2], index[3]);
                        walls.add(wall);
                    }
                }
                else if(key == "player") {
                    let playerJSON = res[key];
                    player = createSprite(playerJSON[0], playerJSON[1], 25, 25);
                    player.position.x = playerJSON[0];
                    player.position.y = playerJSON[1];
                    player.shapeColor = color(192, 70, 26);
                }
                else if(key == "text") {
                    if(res[key] == true) {
                        console.log("MUST ASK FOR TEXT");
                        loadText(res.id).then(
                            (textJSON) => {
                                textToDraw = textJSON[LANG];
                            }
                        );
                    }
                    // textToDraw = res[key];
                }
                else if (key == "bounceObstacles") {
                    let bounceObstJSON = res[key];
                    let l = bounceObstJSON.length;
                    for (let i = 0; i < l; i++) {
                        index = bounceObstJSON[i];
                        let bWall = createSprite(index[0], index[1], index[2], index[3]);
                        bWall.shapeColor = color(252, 191, 106);
                        bounceWalls.add(bWall);
                        // walls.add(bWall);
                    }
                }
                else if (key == "ice") {
                    var iceJSON = res[key];
                    var l = iceJSON.length;
                    for (var i = 0; i < l; i++) {
                        index = iceJSON[i];
                        let iceObj = createSprite(index[0], index[1], index[2], index[3]);
                        iceObj.shapeColor = color(66, 244, 241);
                        bonice.add(iceObj);
                        // walls.add(bWall);
                    }
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
        currentBounce = 0;
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

            // Draw text when an enemy was destroyed
            if (destroyedEnemies.length > 0)
            {
                drawEnemyText();
            }

            let iceTouched = player.collide(bonice, (sprite, target) => {
                if (!keyDown("left") && !keyDown("right")){
                    sprite.velocity.x *= 0.95;
                }
                else {
                    player.velocity.x = 0;
                }
                if (sprite.touching.bottom) {
                    sprite.velocity.y = 0.001;
                }
            });
            if (!waitForMovement && !iceTouched)
                player.velocity.x = 0;

            // Restric position outside of canvas
            if (player.position.x <= leftWall)
                player.position.x = leftWall + 2;
            if (player.position.x >= rightWall)
                player.position.x = rightWall - 2;

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
                    SOUNDS.jump.play();
                    if (direction < 0) {
                        player.setSpeed(20, -55);
                    } else {
                        player.setSpeed(20, -125);
                    }
                    ((me) => {
                        setTimeout(() => {
                            if (me == currentBounce){
                                waitForMovement = false;
                                currentBounce = 0;
                            }
                        }, 200);
                    })(++currentBounce);
                } else if (player.touching.bottom || iceTouched) {
                    SOUNDS.jump.play();
                    player.velocity.y = -JUMP;
                }
            }

            player.collide(bounceWalls, (sprite, target) => {
                SOUNDS.bounce.play();
                if ((sprite.touching.left || sprite.touching.right) && !sprite.touching.bottom) {
                    // Do an automatic walljump
                    direction = target.position.x - sprite.position.x;
                    waitForMovement = true;
                    if (direction < 0) {
                        player.setSpeed(20, -55);
                    } else {
                        player.setSpeed(20, -125);
                    }
                    ((me) => {
                        setTimeout(() => {
                            if (me == currentBounce){
                                waitForMovement = false;
                                currentBounce = 0;
                            }
                        }, 400);
                    })(++currentBounce);
                }
                else if (sprite.touching.bottom) {
                    // Bounce upwards when touching with the bottom of the player.
                    player.velocity.y = -JUMP;
                }
                if (sprite.touching.top){
                    // Bounce downwards when touching with the top of the player.
                    player.velocity.y = JUMP;
                }
            });

            // player.collide(bonice, (sprite, target) => {
            //     if (sprite.touching.bottom) {
            //         // "Reduce friction" effect
            //         sprite.velocity.y = 0.001;
            //         if (keyWentDown("space")) {
            //             SOUNDS.jump.play();
            //             player.velocity.y = -JUMP;
            //         }
            //         console.log("ice");
            //     }
            // });

            // Basic Movement.
            if (keyDown("left")) {
                if (!waitForMovement)
                    player.addSpeed(-SPEED, 0);
            }
            if (keyDown("right")) {
                if (!waitForMovement)
                    player.addSpeed(SPEED, 0);
            }

            // Fire a bullet to the left.
            if (keyWentDown("z")) {
                fireBullet(-1);
            }

            // Fire a bullet to the right.
            if (keyWentDown("x")) {
                fireBullet(1);
            }

            // Whenever a bullet collides with an obstacle.
            bullets.collide(obstacles, (bullet, obstacle) => {
                //Destroy the bullet
                bullet.remove();

                // If the obstacle can be destroyed
                if(!obstacle.immune) {
                    // Get obstacle pos before destroying it
                    let x = obstacle.position.x;
                    let y = obstacle.position.y;

                    // Play enemy death sound.
                    SOUNDS.enemyDeath.play()

                    // Destroy the obstacle.
                    obstacle.remove();

                    // Set destroyed position and time
                    destroyedEnemies.push([x, y, millis() + ENEMY_POINTS_DURATION]);

                    // Add 2 seconds to the starting timer of the level,
                    // which results in having 2 seconds less overall.
                    timeStart.setSeconds(timeStart.getSeconds() + 2);
                }
            });

            // Whenever a bullet collides with a wall.
            bullets.collide(walls, (bullet, wall) => {
                // Just destroy the bullet, it shouldn't
                // be playing with walls, anyway.
                bullet.remove();
            });
            
            // Whenever a bullet collides with a bouncy wall.
            bullets.collide(bounceWalls, (bullet, bounceWall) => {
                // Just destroy the bullet, it shouldn't
                // be playing with bouncy walls, anyway.
                bullet.remove();
            });

            // Obstacles interactions.
            player.overlap(obstacles, (sprite, target) => {
                levelLoaded = false;
                restartLevel();
            });

            // Obstacles collision with bouncy walls.
            obstacles.collide(bounceWalls, function (sprite, target) { 
                sprite.velocity.x *= -1; 
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

    function drawEnemyText() {
        textSize(30);
        fill(255, 0, 0);

        for (let i = 0; i < destroyedEnemies.length; i++) {
            if (millis() < destroyedEnemies[i][enemyKillTime]) {
                text("- 2s", destroyedEnemies[i][enemyPosX], destroyedEnemies[i][enemyPosY]);    
            }
            else {
                destroyedEnemies.splice(i, 1);
            }
        }
    }

    function updateTimer(){
        let timer = timeEnd - timeStart;
        if (timer < 0) timeStart = new Date();
        let seconds = Math.floor((timer) / 1000);
        let ms = Math.floor(timer % 1000);
        // Add timer
        textSize(40);
        fill(255, 255, 255);
        text(seconds + "." + ms , WIDTH / 10, HEIGHT / 10);
    }

    function fireBullet(direction) {
        SOUNDS.pew.play()
        let bullet = createSprite(player.position.x + (direction * 5), player.position.y, 8, 8);
        bullet.shapeColor = color(255, 61, 61);
        // Go either right or left.
        bullet.velocity.x = direction * 6;
        bullets.add(bullet);
    }

    function restartLevel() {
        clearSprites();
        reset(currentLevel);
    }

    function forcedRestartLevel() {
        clearSprites();
        let data = { "id": levelId };
        loadLevel(data);
    }

    function levelEnd() {
        let timer = timeEnd - timeStart;
        let seconds = Math.floor((timer) / 1000);
        let ms = Math.floor(timer % 1000);
        SCORES[levelId] += timer;
        textToDraw = [{
            fill: [255, 255, 255],
            textSize: 60,
            texts: [[STRINGS[LANG].levelCleared + "\n" + seconds + "." + ms + "s", WIDTH/2 - 200, HEIGHT/2, 424, 1000]]
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
        bullets.removeSprites();
        bonice.removeSprites();
        bounceWalls.removeSprites();
        while (walls.length > 0)
            walls[0].remove();
        while (obstacles.length > 0)
            obstacles[0].remove();
        while (bullets.length > 0)
            bullets[0].remove();
        while (bonice.length > 0)
            bonice[0].remove();
        while (bounceWalls.length > 0)
            bounceWalls[0].remove();
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

    function endGame(){
        let total = 0;
        for (let i = 1; i < levelId; i++){
            total += SCORES[i];
        }
        SCORES["score"] = total;
        levelEnded = false;
        levelId = 1;
        levelLoaded = false;
        self.sceneManager.showScene(Submit);
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

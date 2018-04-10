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
    // destroyed enemy array positions
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
    var obstacles, bounceObs;
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
        bounceObs = Group();
        SCORES = {};
        levelId = 1;
        levelLoaded = false;
        let data = { "id": levelId };
        loadLevel(data);
    }

    this.setup = () => {
        
    }

    function loadLevel(data) {
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
        fetch("/getLevel", options)
        .then(res => res.json())
        .then(resJSON => {
            currentLevel = resJSON;
            SCORES[levelId] = 0;
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
                        obst.shapeColor = color(255);
                        obst.setupFunc = eval(obstaclesJSON[i].setup);
                        obst.behaviourFunc = eval(obstaclesJSON[i].behaviour);
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
                    textToDraw = res[key];
                }
                else if (key == "bounceObstacles") {
                    let bounceObstJSON = res[key];
                    let l = bounceObstJSON.length;
                    for (let i = 0; i < l; i++) {
                        index = bounceObstJSON[i];
                        let bWall = createSprite(index[0], index[1], index[2], index[3]);
                        bWall.shapeColor = color(252, 191, 106);
                        bounceObs.add(bWall);
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

            if (!waitForMovement)
                player.velocity.x = 0;

            // Restric position outside of canvas
            if (player.position.x <= leftWall)
                player.position.x = leftWall + 2;
            if (player.position.x >= rightWall)
                player.position.x = rightWall - 2;

            // // Basic Movement.
            // if (keyDown("left")) {
            //     if (!waitForMovement)
            //         player.velocity.x = -SPEED;
            // }
            // if (keyDown("right")) {
            //     if (!waitForMovement)
            //         player.velocity.x = SPEED;
            // }

            // // Stop Movement.
            // if (keyWentUp("left") || keyWentUp("right")) {
            //     if (!waitForMovement) {
            //         player.velocity.x = 0;
            //     }
            // }

            player.overlap(walls, (sprite, target) => {
                sprite.collide(target);
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
                    ((me) => {
                        setTimeout(() => {
                            if (me == currentBounce){
                                waitForMovement = false;
                                currentBounce = 0;
                            }
                        }, 400);
                    })(++currentBounce);
                } else if (player.touching.bottom) {
                    player.velocity.y = -JUMP;
                }
            }

            player.collide(bounceObs, (sprite, target) => {
                
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
                    // jump
                    player.velocity.y = -JUMP;
                }
                if (sprite.touching.top){
                    // jump down
                    player.velocity.y = JUMP;
                }
            });

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
                // Get obstacle pos before destroying it
                let x = obstacle.position.x;
                let y = obstacle.position.y;

                // Destroy the bullet and the obstacle.
                bullet.remove();
                obstacle.remove();

                // Set destroyed position and time
                destroyedEnemies.push([x, y, millis() + ENEMY_POINTS_DURATION]);

                // Add 2 seconds to the starting timer of the level,
                // which results in having 2 seconds less overall.
                timeStart.setSeconds(timeStart.getSeconds() + 2);
            });

            // Whenever a bullet collides with a wall.
            bullets.collide(walls, (bullet, wall) => {
                // Just destroy the bullet, it shouldn't
                // be playing with walls, anyway.
                bullet.remove();
            });

            // Obstacles interactions.
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

    function drawEnemyText() {
        textSize(30);
        fill(255, 0, 0);

        for (let i = 0; i < destroyedEnemies.length; i++)
        {
            if ( millis() < destroyedEnemies[i][enemyKillTime] )    
            {
                text("+ 10", destroyedEnemies[i][enemyPosX], destroyedEnemies[i][enemyPosY]);    
            }
            else
            {
                destroyedEnemies.splice(i, 1);
            }
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

    function fireBullet(direction) {
        let bullet = createSprite(player.position.x + (direction * 5), player.position.y, 8, 8);
        bullet.shapeColor = color(255, 61, 61);
        // Go either right or left.
        bullet.velocity.x = direction * 6;
        // Setup what the 'draw' function should do with this Sprite.
        bullet.behaviourFunc = (o) => {
            o.collide(walls, (sprite, target) => {
                o.remove();
            });
            o.collide(obstacles, (sprite, target) => {
                timeStart.setSeconds(timeStart.getSeconds() + 2);
                // SCORES[levelId] -= 10;
                target.destroy();
                o.destroy();
            });
        }
        bullets.add(bullet);
    }

    function restartLevel() {
        walls.removeSprites();
        obstacles.removeSprites();
        bounceObs.removeSprites();
        clearSprites();
        reset(currentLevel);
    }

    function forcedRestartLevel() {
        walls.removeSprites();
        obstacles.removeSprites();
        bounceObs.removeSprites();
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
        bullets.removeSprites();
        bounceObs.removeSprites();
        while (walls.length > 0)
            walls[0].remove();
        while (obstacles.length > 0)
            obstacles[0].remove();
        while (bullets.length > 0)
            bullets[0].remove();
        while (bounceObs.length > 0)
            bounceObs[0].remove();
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

    function getNickname() {
        let exp = /^[a-z0-9]+$/i;
        let nickname = prompt("Enter a nickname:");
        while (nickname == "" || nickname == null || nickname.length != 4 || nickname !== nickname.toUpperCase() || !nickname.match(exp)){
            nickname = prompt("Please entera valid nickname:");
        }
        return nickname;
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

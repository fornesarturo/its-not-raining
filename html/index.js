// Universal constants.
const SPEED = 7;
const GRAVITY = 1;
const JUMP = 15;
const WALL_GRAB = 2;
const WIDTH = 1800;
const HEIGHT = 600;

// Level loaded flag
var levelLoaded

// Time
var timeStart, timeEnd;

var levelEnded;

// Sprites.
var player;

// Structures.
var walls, end;

// Obstacles and enemies
var obstacles;

var collidingWall;

var walled, grounded, direction, waitForMovement;

function setup() {

    createCanvas(WIDTH, HEIGHT);
    player = createSprite(300, 200, 50, 50);
    walls = Group();
    obstacles = Group();

    levelLoaded = false;
    let data = {"id" : 1};
    loadLevel(data);
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
    .then(resJSON => reset(resJSON));
}

function reset(res) {

    console.log(res);

    // Build from request response.
    for(var key in res) {
        if(res.hasOwnProperty(key)) {
            if(key == "end") {
                var endJSON = res[key][0];
                end = createSprite(endJSON[0], endJSON[1], endJSON[2], endJSON[3]);
            }
            else if(key == "obstacles") {
                var obstaclesJSON = res[key][0];
                let obst = createSprite(obstaclesJSON[0], obstaclesJSON[1], obstaclesJSON[2], obstaclesJSON[3]);
                obst.shapeColor = color(255);
                obst.setupFunc = (obstF) => {
                    obstF.velocity.x = 5;
                };
                obst.behaviourFunc = (obstF) => {
                    obstF.collide(walls, function(sprite, target) {
                        sprite.velocity.x *= -1;
                    });
                };
                obstacles.add(obst);
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
                var playerJSON = res[key][0];
                player.position.x = playerJSON[0];
                player.position.y = playerJSON[1];
            }
        }
    }

    walled = false;
    grounded = false;
    waitForMovement = false;
    levelEnded = false;
    player.velocity.x = 0;
    timeStart = new Date();
    timeEnd = new Date();
    levelLoaded = true;
}

function draw() {
    background(0, 0, 0);

    if(levelLoaded) {

        if (!waitForMovement)
            player.velocity.x = 0;

        // Basic Movement.
        if (keyDown("left")) {
            if (!waitForMovement)
                player.velocity.x = -SPEED;
            if (direction > 0 && walled)
                walled = false;
        }
        if (keyDown("right")) {
            if (!waitForMovement)
                player.velocity.x = SPEED;
            if (direction < 0 && walled)
                walled = false;
        }

        // Stop Movement.
        if (keyWentUp("left") || keyWentUp("right")) {
            if (!waitForMovement) {
                player.velocity.x = 0;
                walled = false;
            }
        }
        
        player.collide(walls, function(sprite, target) {
            if ((sprite.touching.left || sprite.touching.right) && !sprite.touching.bottom) {
                walled = true;
                player.velocity.y = WALL_GRAB;
                direction = target.position.x - sprite.position.x;
                grounded = false;
            }
            else if (sprite.touching.bottom)
                grounded = true;
        });

        if (!grounded) {
            player.velocity.y += GRAVITY;
        }

        if (keyWentDown("space")) {
            if (walled && !grounded) {
                walled = false;
                waitForMovement = true;
                if (direction < 0) {
                    player.setSpeed(20, -55);
                } else {
                    player.setSpeed(20, -125);
                }
                setTimeout(function () {
                    waitForMovement = false;
                }, 200);
            } else if (grounded) {
                player.velocity.y = -JUMP;
                grounded = false;
            }
        }

        // Obstacles interactions
        if (player.overlap(obstacles)) {
            restartLevel();
        }

        // Update obstacles
        for(let i = 0; i < obstacles.length; ++i){
            obstacles[i].behaviourFunc(obstacles[i]);
        }

        if (end.overlap(player)) {
            levelEnd();
        }

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
    textSize(60);
    fill(255, 255, 255);
    text(seconds + "." + ms , WIDTH * (3/4), HEIGHT / 4);
}

function restartLevel() {
    walls.removeSprites();
    obstacles.removeSprites();
    let data = {"id": 1};
    loadLevel(data);
}

function levelEnd() {
    levelEnded = true;
    textSize(60);
    fill(255, 255, 255);
    text("GAME OVER", WIDTH / 2, HEIGHT / 2);
    updateSprites(false);
    let data = {"id": 1};
    loadLevel(data)
}

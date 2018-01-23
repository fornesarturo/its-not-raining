// Universal constants.
const SPEED = 7;
const GRAVITY = 1;
const JUMP = 15;
const WALL_GRAB = 2;
const WIDTH = 1800;
const HEIGHT = 600;

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

    reset();

    player.velocity.x = 0;

    timeStart = new Date();
    timeEnd = new Date();
}

function reset() {

    // Enemies and obstacles setup
    let obst1 = createSprite(500, 500, 50, 50);
    obst1.shapeColor = color(255);
    obst1.setupFunc = (obst) => {
        obst.velocity.x = 5;
    };
    obst1.behaviourFunc = (obst) => {
        obst.collide(walls, function(sprite, target) {
            sprite.velocity.x *= -1;
        });
    };
    obstacles.add(obst1);

    for(let i = 0; i < obstacles.length; ++i){
        obstacles[i].setupFunc(obstacles[i]);
    }

    let wallA = createSprite(50, 300, 100, 500);
    let wallB = createSprite(400, 300, 100, 500);
    let wallC = createSprite(750, 300, 100, 500);
    let ground = createSprite(400, 600, 1800, 100);
    walls.add(wallA);
    walls.add(wallB);
    walls.add(wallC);
    walls.add(ground);

    end = createSprite(1200, 500, 50, 50);

    walled = false;
    grounded = false;
    waitForMovement = false;

    player.position.x = 300;
    player.position.y = 200;

    levelEnded = false;
}

function draw() {
    background(0, 0, 0);

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

    for(let i = 0; i < obstacles.length; ++i){
        obstacles[i].behaviourFunc(obstacles[i]);
    }

    // Obstacles interactions
    if (player.overlap(obstacles)) {
        restartLevel();
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
    reset();
}

function levelEnd() {
    levelEnded = true;
    textSize(60);
    fill(255, 255, 255);
    text("GAME OVER", WIDTH / 2, HEIGHT / 2);
    updateSprites(false);
    let data = {"id": 1};
    httpPost(
        "/",
        'json',
        data,
        function(result) {
            let jsonLevel = JSON.parse(result);
            fill(0, 0, 0);
            text("Done with JSON Level: \n" + JSON.stringify(jsonLevel), WIDTH / 4, HEIGHT / 4);
        },
        function(error) {
            console.log(error);
        }
    )
}

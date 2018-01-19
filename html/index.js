// Universal constants.
const SPEED = 7;
const GRAVITY = 1;
const JUMP = 15;
const WALL_GRAB = 2;

// Sprites.
var mySprite;

// Structures.
var walls;

// Obstacles and enemies
var obstacles;

var collidingWall;

var walled, grounded, direction, waitForMovement;

function setup() {
    createCanvas(1800, 600);
    player = createSprite(300, 200, 50, 50);
    walls = Group();
    obstacles = Group();

    walled = false;
    grounded = false;
    waitForMovement = false;

    reset();

    player.velocity.x = 0;
}

function reset() {

    // Enemies and obstacles setup
    let obst1 = createSprite(500, 500, 50, 50);
    obst1.shapeColor = color(255);
    obstacles.add(obst1);

    let wallA = createSprite(50, 300, 100, 500);
    let wallB = createSprite(400, 300, 100, 500);
    let wallC = createSprite(750, 300, 100, 500);
    let ground = createSprite(400, 600, 1800, 100);
    walls.add(wallA);
    walls.add(wallB);
    walls.add(wallC);
    walls.add(ground);

    player.position.x = 300;
    player.position.y = 200;
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
        if(walled && !grounded) {
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
    if ( player.overlap(obstacles) ) {
        restartLevel();
    }

    player.debug = mouseIsPressed;
    drawSprites();
}

function restartLevel() {
    walls.removeSprites();
    obstacles.removeSprites();
    reset();
}
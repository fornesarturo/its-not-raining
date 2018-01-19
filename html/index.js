// Universal constants.
const SPEED = 7;
const GRAVITY = 1;
const JUMP = 15;
const WALL_GRAB = 2;
const WIDTH = 1800;
const HEIGHT = 600;

// Sprites.
var mySprite;

// Structures.
var ground, walls;
var end;

var collidingWall;

var walled, grounded, direction, waitForMovement;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    player = createSprite(300, 200, 50, 50);
    ground = createSprite(400, 600, 1800, 100);
    walls = Group();

    let wallA = createSprite(50, 300, 100, 500);
    let wallB = createSprite(400, 300, 100, 500);
    let wallC = createSprite(750, 300, 100, 500);
    walls.add(wallA);
    walls.add(wallB);
    walls.add(wallC);
    walled = false;
    grounded = false;
    waitForMovement = false;

    end = createSprite(1200, 500, 50, 50);

    player.velocity.x = 0;
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
    
    player.collide(ground, function(a, b) {
        grounded = true;
    });

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

    if(end.overlap(player)){
        levelEnd();
    }

    player.debug = mouseIsPressed;
    drawSprites();
}

function levelEnd(){
    textSize(60);
    fill(255, 255, 255);
    text("GAME OVER", WIDTH / 2, HEIGHT / 2);
    updateSprites(false);
}

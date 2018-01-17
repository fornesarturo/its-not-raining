// Universal constants.
const SPEED = 7;
const GRAVITY = 1;
const JUMP = 15;
const WALL_GRAB = 2;

// Sprites.
var mySprite;

// Structures.
var ground, walls;

var collidingWall;

var walled, grounded, direction, waitForMovement;

function setup() {
    createCanvas(800, 600);
    player = createSprite(400, 200, 50, 50);
    ground = createSprite(400, 600, 800, 100);
    walls = Group();

    let wallA = createSprite(50, 300, 100, 500);
    let wallB = createSprite(350, 300, 100, 500);
    walls.add(wallA);
    walls.add(wallB);
    walled = false;
    grounded = false;
    waitForMovement = false;

    player.velocity.x = 0;
}

function draw() {
    background(0, 0, 0);
    walled = false;

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
        player.velocity.x = 0;
    }
    
    player.collide(ground, function(a, b) {
        grounded = true;
    });

    if (!grounded) {
        player.velocity.y += GRAVITY;
    }

    player.collide(walls, function(sprite, target) {
        walled = true;
        player.velocity.y = WALL_GRAB;
        direction = target.position.x - sprite.position.x;
    });

    if (keyWentDown("space")) {
        if(walled && !grounded) {
            waitForMovement = true;
            if (direction < 0) {
                player.velocity.y = -JUMP;
                player.velocity.x = JUMP;
            } else {
                player.velocity.y = -JUMP; 
                player.velocity.x = -JUMP;
            }
            setTimeout(function () {
                waitForMovement = false;
            }, 150);
        } else if (grounded) {
            player.velocity.y = -JUMP;
            grounded = false;
        }
    }

    drawSprites();
}
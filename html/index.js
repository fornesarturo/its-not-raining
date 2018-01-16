// Universal constants.
const SPEED = 7;
const GRAVITY = 1;
const JUMP = 15;

// Sprites.
var mySprite;
// Structures.
var floor, wall;

var walled;

function setup() {
    createCanvas(800, 600);
    mySprite = createSprite(400, 200, 50, 50);
    floor = createSprite(400, 600, 800, 100);
    wall = createSprite(0, 300, 200, 500);
    walled = false;
}

function draw() {
    background(0, 0, 0);
    walled = false;
    mySprite.velocity.x = 0;
    mySprite.velocity.y += GRAVITY;

    // Basic Movement.
    if (keyDown("left"))
        mySprite.velocity.x = -SPEED;
    if (keyDown("right"))
        mySprite.velocity.x = SPEED;

    // Floor and Wall.
    if (mySprite.collide(floor)) {
        mySprite.velocity.y = 0;
        if (keyWentDown("space"))
            mySprite.velocity.y = -JUMP;
    }

    if (mySprite.collide(wall)) {
        let direction = wall.position.x - mySprite.position.x;
        mySprite.velocity.x = 0;
        if (direction < 0) {
            if (keyDown("left")) {
                mySprite.velocity.y += GRAVITY/2;
                // Wall hog to the left.
                if (keyWentDown("space")) {
                    mySprite.velocity.y = -JUMP * 2;
                    mySprite.velocity.x = -JUMP * 4;
                }
            }
        } else {
            if (keyDown("right")) {
                mySprite.velocity.y += GRAVITY / 2;
                // Wall hog to the right.
                if (keyWentDown("space")) {
                    mySprite.velocity.y = -JUMP * 2;
                    mySprite.velocity.x = -JUMP * 4;
                }
            }
            
        }
    }

    drawSprites();
}
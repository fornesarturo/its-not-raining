var level0 = {
    "id": 0,
    "player": [
        300,
        400
    ],
    "structures": [
        [
            50,
            300,
            100,
            500
        ],
        [
            400,
            300,
            100,
            500
        ],
        [
            750,
            300,
            100,
            500
        ],
        [
            400,
            600,
            1800,
            100
        ]
    ],
    "obstacles": [
        {
            "coordinates": [
                500,
                500,
                50,
                50
            ],
            "setup": "(o) => { o.velocity.x = 5; }",
            "behaviour": "(o) => { o.collide(walls, function(sprite, target) { sprite.velocity.x *= -1; }); }"
        }
    ],
    "end": [
        850,
        450,
        50,
        50
    ]
}

module.exports = level0;
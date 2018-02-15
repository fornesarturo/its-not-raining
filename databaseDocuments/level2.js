var level2 = {
    "id": 2,
    "player": [
        50,
        800
    ],
    "structures": [
        [
            200,
            750,
            35,
            300
        ],
        [
            370,
            660,
            60,
            20
        ],
        [
            550,
            660,
            60,
            20
        ],
        [
            300,
            775,
            60,
            20
        ],
        [
            450,
            775,
            60,
            20
        ],
        [
            600,
            775,
            60,
            20
        ],
        [
            700,
            750,
            35,
            300
        ],
        [
           700,
           300,
           35,
           250
        ],
        [
            300,
            200,
            60,
            20
         ],
        [
            500,
            200,
            60,
            20
         ],
        [
            0,
            600,
            50,
            1300
        ],
        [
            900,
            600,
            50,
            1300
        ],
        [
            450,
            5,
            950,
            50
        ],
        [
            450,
            890,
            950,
            50
        ]
    ],
    "obstacles": [
        {
            "coordinates": [
                575,
                600,
                40,
                40
            ],
            "setup": "(o) => { o.velocity.x = -5; }",
            "behaviour": "(o) => { o.collide(walls, function(sprite, target) { sprite.velocity.x *= -1; }); }"
        },
        {
            "coordinates": [
                300,
                825,
                40,
                40
            ],
            "setup": "(o) => { o.velocity.x = 5; }",
            "behaviour": "(o) => { o.collide(walls, function(sprite, target) { sprite.velocity.x *= -1; }); }"
        }
    ],
    "end": [
        100,
        150,
        35,
        35
    ]
}

module.exports = level2;
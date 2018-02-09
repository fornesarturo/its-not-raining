var level1 = {
    "id": 1,
    "player": [
        250,
        800
    ],
    "structures": [
        [
            0,
            600,
            100,
            1300
        ],
        [
            325,
            600,
            50,
            550
        ],
        [
            625,
            300,
            50,
            650
        ],
        [
            625,
            800,
            50,
            150
        ],
        [
            900,
            600,
            100,
            1300
        ],
        [
            450,
            890,
            950,
            50
        ],
        [
            450,
            5,
            950,
            50
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
        830,
        50,
        35,
        35
    ],
    "text": [
        {
            "fill": [
                255,
                255,
                255
            ],
            "textSize": 10,
            "texts": [
                [
                    "Move with ARROW KEYS",
                    90,
                    810,
                    90,
                    225
                ],
                [
                    "Jump with SPACE",
                    90,
                    765
                ],
                [
                    "Level ends here",
                    747,
                    90
                ]
            ]
        },
        {
            "fill": [
                255,
                255,
                255
            ],
            "textSize": 15,
            "texts": [
                [
                    "Jump when touching a wall and above the floor",
                    90,
                    630,
                    150,
                    300
                ]
            ]
        }
    ]
}

module.exports = level1;
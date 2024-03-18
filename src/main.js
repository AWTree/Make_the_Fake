// Arno Wu
// Hit-Monkey: The Road to Shuro

'use strict'

// global variables
let cursors
const SCALE = 0.5
const tileSize = 35

// main game object
let config = {
    parent: 'game-canvas',
    type: Phaser.WEBGL,
    pixelArt: true,
    width: 800,
    height: 500,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [ Menu, Load, Play, Play2, Tutorial, Credits ]
}

let game = new Phaser.Game(config)

// reserve keyboard bindings
let keyR, keyESC, keySPACE
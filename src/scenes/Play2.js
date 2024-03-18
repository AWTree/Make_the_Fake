class Play2 extends Phaser.Scene {
    constructor() {
        super('playScene2')
    }

    init() {
        // variables and settings
        this.ACCELERATION = 1500
        this.MAX_X_VEL = 500        // pixels/second
        this.MAX_Y_VEL = 5000
        this.DRAG = 600             // DRAG < ACCELERATION = icy slide
        this.MAX_JUMPS = 2          // change for double/triple/etc.
        this.JUMP_VELOCITY = -700
        this.physics.world.gravity.y = 2600
        this.score = 0
    }

    create() {
        // tilemap 
        const map = this.add.tilemap('tilemapJSON')
        const tileset = map.addTilesetImage('tileset', 'tilesetImage')
        const bgLayer = map.createLayer('Background', 'tileset', 0, 0)
        const terrainLayer = map.createLayer('Terrain', 'tileset', 0, 0)
        const buildingLayer = map.createLayer('Buildings', 'tileset', 0, 0)

        terrainLayer.setCollisionByProperty({ collides: true })
        buildingLayer.setCollisionByProperty({ collides: true })

        // set bgm
        this.sound.play('training_room_bgm', {volumn: 0.5, loop: true})

        // show scene name
        const centerX = this.cameras.main.width / 2
        const centerY = this.cameras.main.height / 2

        let trainingRoomText = this.add.text(centerX, centerY, 'Eliminate All Enemy', {
            fontSize: '42px',
            fill: '#F00'
        }).setOrigin(0.5) // This centers the text
    
        // set a timed event to remove the text after a few seconds 
        this.time.delayedCall(1500, () => {
            trainingRoomText.destroy() // This removes the text from the scene
        }, [], this)

        // add monkey sprite
        this.monkey = new Monkey(this, this.sys.game.config.width / 2 - 260, this.sys.game.config.height / 2 - 200, 'monkey_atlas', 'idle')
        this.monkey.body.setCollideWorldBounds(true)

        // add enemy sprite (x3)
        this.enemy1 = new Enemy(this, 100, 400, 'training_atlas', 'bot')
        this.enemy2 = new Enemy(this, 350, 400, 'training_atlas', 'bot')
        this.enemy3 = new Enemy(this, 600, 400, 'training_atlas', 'bot')

        // initialize enemies group
        this.enemies = this.physics.add.group() // physics group 

        this.time.delayedCall(1000, () => {
            this.enemies.add(this.enemy1)
        }, [], this)
        this.time.delayedCall(1600, () => {
            this.enemies.add(this.enemy2)
        }, [], this)
        this.time.delayedCall(2200, () => {
            this.enemies.add(this.enemy3)
        }, [], this)

        // set camera bounds
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.monkey, true, 0.25, 0.25)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        // add physics collider
        this.physics.add.collider(this.monkey, this.terrainLayer) // monkey physics
        this.physics.add.collider(this.monkey, this.buildingLayer)

        this.physics.add.collider(this.enemies, terrainLayer) // enemy physics 
        this.physics.add.collider(this.enemies, buildingLayer) 

        // projectile collision 
        this.projectiles = this.physics.add.group() // physics group
        this.physics.add.collider(this.monkey, this.projectiles, (monkey, projectile) => {
            projectile.destroy() 
            this.sound.play('hit', {volumn: 0.5, loop:false})
            this.playerDied()
        })

        this.physics.add.overlap(this.monkey.attackHitbox, this.enemies, (hitbox, enemy) => {
            enemy.defeat() 
            this.score += enemy.score
            this.sound.play('enemyHit',  {volumn: 0.5, loop:false})
            this.scoreText.setText(`Score: ${this.score}`) 
        })

        // display score
        this.scoreText = this.add.text(800, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' })
        this.scoreText.setOrigin(1, 0) 
        this.scoreText.setScrollFactor(0)

        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)


        // set up Phaser-provided cursor key input
        this.cursors = this.input.keyboard.createCursorKeys()

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', function() {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)

        // game condition
        this.gameOver = false
        this.gamePause = false
    }

    update(time, delta) {
        // check if the player reaches the right edge of the screen
        if (this.monkey.x >= this.sys.game.config.width - 50) { 
            this.sound.stopByKey('training_room_bgm') 
            this.scene.start('playScene2') 
        }

        // restart
        if (Phaser.Input.Keyboard.JustDown(keyR)) { 
            this.sound.stopByKey('training_room_bgm')
            this.scene.restart()
        } 

        // toggle menu interface (ban toggle menu when game is over)
        if (!this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)) {
            if (this.gamePause) {
                this.hideMenu() 
                this.physics.resume()
                this.sound.play('training_room_bgm', {volumn: 0.5, loop:true})
                this.gamePause = false
            } else {
                this.showMenu()
                this.physics.pause()
                this.sound.stopByKey('training_room_bgm')
                this.gamePause = true
            }
        }

        // check if game is over
        if (!this.gameOver) {
            this.monkey.update(this.cursors)
            this.enemies.children.iterate((enemy) => {
                if (enemy) {
                    enemy.update(time, delta)
                }
            })
        }
    }

    // handle player death
    playerDied() {
        this.physics.pause()
        this.gameOver = true
        this.sound.stopByKey('training_room_bgm')
        this.sound.play('dead', {volumn: 0.5, loop:false})
        this.showMenu()
    }
    
    // menu
    showMenu() {
        const { width, height } = this.sys.game.config
        const textStyle = { fontSize: '32px', fill: '#FFF' }

        // normal and hover colors
        const normalColor = '#FFF'
        const hoverColor = '#F00'
    
        // restart text
        this.restartButton = this.add.text(width / 2, height / 2 - 20, 'Restart', textStyle)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play('menuSelect')
                this.gameOver = false
                this.gamePause = false
                this.scene.restart()
            })

        // menu text
        this.menuButton = this.add.text(width / 2, height / 2 + 30, 'Return to Menu', textStyle)
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.stopByKey('training_room_bgm')
                this.sound.play('menuSelect')
                this.gameOver = false
                this.gamePause = false
                this.scene.start('menuScene') 
            })

        // pause or resume the game
        if (this.restartButton.visible) {
            this.physics.pause()
            this.gamePause = true
        } else {
            this.physics.resume()
            this.gamePause = false
        }
    }
    
    // hide menu
    hideMenu() {
        if (this.restartButton && this.restartButton.visible) {
            this.restartButton.setVisible(false)
            this.menuButton.setVisible(false)
            this.physics.resume()
            this.gamePause = false
        }
    }    
}
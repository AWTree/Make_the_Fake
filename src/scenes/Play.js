class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
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

    preload() {
            // load bgm
            this.load.audio('training_room_bgm', './assets/sfx/mixkit-game-level-music-689.wav')
    }

    create() {
        // set bg image
        let bg = this.add.image(0, 0, 'training_background').setOrigin(0, 0)
        bg.displayWidth = this.sys.game.config.width
        bg.displayHeight = this.sys.game.config.height

        // set bgm
        this.sound.play('training_room_bgm', {volumn: 0.5, loop:true})

        // draw grid lines for jump height reference
        // let graphics = this.add.graphics()
        // graphics.lineStyle(2, 0xFFFFFF, 0.1)
	    // for(let y = game.config.height-70; y >= 35; y -= 35) {
        //     graphics.lineBetween(0, y, game.config.width, y)
        // }


        // show scene name
        const centerX = this.cameras.main.width / 2
        const centerY = this.cameras.main.height / 2

        let trainingRoomText = this.add.text(centerX, centerY, 'Training Room', {
            fontSize: '32px',
            fill: '#FFF'
        }).setOrigin(0.5) // This centers the text
    
        // Set a timed event to remove the text after a few seconds (e.g., 3000 milliseconds = 3 seconds)
        this.time.delayedCall(1500, () => {
            trainingRoomText.destroy() // This removes the text from the scene
        }, [], this)

        // add some physics clouds
        // this.cloud01 = this.physics.add.sprite(600, 100, 'platformer_atlas', 'cloud_1')
        // this.cloud01.body.setAllowGravity(false).setVelocityX(25)
        // this.cloud02 = this.physics.add.sprite(200, 200, 'platformer_atlas', 'cloud_2')
        // this.cloud02.body.setAllowGravity(false).setVelocityX(45)

        // make ground tiles group
        this.ground = this.add.group()
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'training_atlas', 'ground_tile').setScale(2.5).setOrigin(0)
            groundTile.body.immovable = true
            groundTile.body.allowGravity = false
            this.ground.add(groundTile)
        }
        for(let i = tileSize*2; i < game.config.width-tileSize*18; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*9, 'training_atlas', 'ground_tile').setScale(2.5).setOrigin(0)
            groundTile.body.immovable = true
            groundTile.body.allowGravity = false
            this.ground.add(groundTile)
        }

        // add monkey sprite
        this.monkey = new Monkey(this, this.sys.game.config.width / 2 - 260, this.sys.game.config.height / 2 - 200, 'monkey_atlas', 'idle').setScale(1.5)

        // add enemy sprite (x3)
        this.enemy1 = new Enemy(this, 100, 400, 'training_atlas', 'bot').setScale(2)
        this.enemy2 = new Enemy(this, 350, 400, 'training_atlas', 'bot').setScale(2)
        this.enemy3 = new Enemy(this, 600, 400, 'training_atlas', 'bot').setScale(2)

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

        // add physics collider
        this.physics.add.collider(this.monkey, this.ground) // monkey physics
        this.physics.add.collider(this.enemy1, this.ground) // enemy physics (x3)
        this.physics.add.collider(this.enemy2, this.ground) 
        this.physics.add.collider(this.enemy3, this.ground)
  

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
        // restart
        if (Phaser.Input.Keyboard.JustDown(keyR)) { 
            this.scene.restart()
        } 

        // toggle menu interface (ban toggle menu when game is over)
        if (!this.gameOver && Phaser.Input.Keyboard.JustDown(keyESC)) {
            if (this.gamePause) {
                this.hideMenu() 
                this.physics.resume()
                this.gamePause = false
            } else {
                this.showMenu()
                this.physics.pause()
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

        // wrap physics object(s) .wrap(gameObject, padding)
        // this.physics.world.wrap(this.cloud01, this.cloud01.width/2)
        // this.physics.world.wrap(this.cloud02, this.cloud02.width/2)
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
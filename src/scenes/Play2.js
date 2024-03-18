class Play2 extends Phaser.Scene {
    constructor() {
        super('playScene2')
    }

    init() {
        // variables and settings
        this.ACCELERATION = 800
        this.MAX_X_VEL = 500        // pixels/second
        this.MAX_Y_VEL = 500
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
        const gameWidth = this.sys.game.config.width
        const gameHeight = this.sys.game.config.height

        const monkeySpawn = map.findObject('Spawns', (obj) => obj.name === 'monkeySpawn')
        console.log(monkeySpawn)

        this.monkey = new Monkey(this, monkeySpawn.x, monkeySpawn.y, 'monkey_atlas', 'idle').setScale(0.5)

        const enemySpawn1 = map.findObject('Spawns', (obj) => obj.name === 'enemySpawn1')
        console.log(monkeySpawn)

        const enemySpawn2 = map.findObject('Spawns', (obj) => obj.name === 'enemySpawn2')
        console.log(monkeySpawn)

        const enemySpawn3 = map.findObject('Spawns', (obj) => obj.name === 'enemySpawn3')
        console.log(monkeySpawn)

        const enemySpawn4 = map.findObject('Spawns', (obj) => obj.name === 'enemySpawn4')
        console.log(monkeySpawn)

        const enemySpawn5 = map.findObject('Spawns', (obj) => obj.name === 'enemySpawn5')
        console.log(monkeySpawn)

        const enemySpawn6 = map.findObject('Spawns', (obj) => obj.name === 'enemySpawn6')
        console.log(monkeySpawn)

        const enemySpawn7 = map.findObject('Spawns', (obj) => obj.name === 'enemySpawn7')
        console.log(monkeySpawn)

        const enemySpawn8 = map.findObject('Spawns', (obj) => obj.name === 'enemySpawn8')
        console.log(monkeySpawn)

        const enemySpawn9 = map.findObject('Spawns', (obj) => obj.name === 'enemySpawn9')
        console.log(monkeySpawn)

        // add enemy sprite (x3)
        this.enemy1 = new Enemy(this, enemySpawn1.x, enemySpawn1.y, 'enemy_atlas', 'walk0000').setScale(0.5)
        this.enemy2 = new Enemy(this, enemySpawn2.x, enemySpawn2.y, 'enemy_atlas', 'walk0000').setScale(0.5)
        this.enemy3 = new Enemy(this, enemySpawn3.x, enemySpawn3.y, 'enemy_atlas', 'walk0000').setScale(0.5)
        this.enemy4 = new Enemy(this, enemySpawn4.x, enemySpawn4.y, 'enemy_atlas', 'walk0000').setScale(0.5)
        this.enemy5 = new Enemy(this, enemySpawn5.x, enemySpawn5.y, 'enemy_atlas', 'walk0000').setScale(0.5)
        this.enemy6 = new Enemy(this, enemySpawn6.x, enemySpawn6.y, 'enemy_atlas', 'walk0000').setScale(0.5)
        this.enemy7 = new Enemy(this, enemySpawn7.x, enemySpawn7.y, 'enemy_atlas', 'walk0000').setScale(0.5)
        this.enemy8 = new Enemy(this, enemySpawn8.x, enemySpawn8.y, 'enemy_atlas', 'walk0000').setScale(0.5)
        this.enemy9 = new Enemy(this, enemySpawn9.x, enemySpawn9.y, 'enemy_atlas', 'walk0000').setScale(0.5)

        // initialize enemies group
        this.enemies = this.physics.add.group() // physics group 

        this.time.delayedCall(1000, () => {
            this.enemies.add(this.enemy1)
        }, [], this)
        this.time.delayedCall(1400, () => {
            this.enemies.add(this.enemy2)
        }, [], this)
        this.time.delayedCall(1800, () => {
            this.enemies.add(this.enemy3)
        }, [], this)
        this.time.delayedCall(2200, () => {
            this.enemies.add(this.enemy4)
        }, [], this)
        this.time.delayedCall(2600, () => {
            this.enemies.add(this.enemy5)
        }, [], this)
        this.time.delayedCall(3000, () => {
            this.enemies.add(this.enemy6)
        }, [], this)
        this.time.delayedCall(3400, () => {
            this.enemies.add(this.enemy7)
        }, [], this)
        this.time.delayedCall(3800, () => {
            this.enemies.add(this.enemy8)
        }, [], this)
        this.time.delayedCall(4200, () => {
            this.enemies.add(this.enemy9)
        }, [], this)

        // set camera bounds
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.startFollow(this.monkey, true)

        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        // add physics collider
        this.physics.add.collider(this.monkey, terrainLayer) // monkey physics
        this.physics.add.collider(this.monkey, buildingLayer)

        this.physics.add.collider(this.enemy1, terrainLayer) // enemy physics 
        this.physics.add.collider(this.enemy2, terrainLayer) 
        this.physics.add.collider(this.enemy3, terrainLayer) 
        this.physics.add.collider(this.enemy4, terrainLayer) 
        this.physics.add.collider(this.enemy5, terrainLayer) 
        this.physics.add.collider(this.enemy6, terrainLayer) 
        this.physics.add.collider(this.enemy7, terrainLayer) 
        this.physics.add.collider(this.enemy8, terrainLayer) 
        this.physics.add.collider(this.enemy9, terrainLayer) 


        this.physics.add.collider(this.enemy1, buildingLayer) 
        this.physics.add.collider(this.enemy2, buildingLayer) 
        this.physics.add.collider(this.enemy3, buildingLayer) 
        this.physics.add.collider(this.enemy4, buildingLayer) 
        this.physics.add.collider(this.enemy5, buildingLayer) 
        this.physics.add.collider(this.enemy6, buildingLayer) 
        this.physics.add.collider(this.enemy7, buildingLayer) 
        this.physics.add.collider(this.enemy8, buildingLayer) 
        this.physics.add.collider(this.enemy9, buildingLayer) 

        // projectile collision 
        this.projectiles = this.physics.add.group() // physics group
        this.physics.add.collider(this.monkey, this.projectiles, (monkey, projectile) => {
            projectile.destroy() 
            this.sound.play('hit', {volumn: 0.5, loop:false})
            this.playerDied()
        })

        this.physics.add.collider(this.projectiles, buildingLayer, (projectile) => {
            projectile.destroy() // destroy the projectile upon collision with the terrain
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


        // game over if player reaches the box
        const gameOverTrigger = map.findObject('gameOver', (obj) => obj.name === 'gameOver1')
        console.log(gameOverTrigger)

        this.gameOverTrigger = this.physics.add.sprite(gameOverTrigger.x, gameOverTrigger.y, 'invisibleSprite')
        this.gameOverTrigger.setSize(gameOverTrigger.width, gameOverTrigger.height)
        this.gameOverTrigger.setVisible(false)
        this.gameOverTrigger.body.allowGravity = false

        this.physics.add.overlap(this.monkey, this.gameOverTrigger, this.triggerGameOver, null, this)
        this.gameOverTrigger.setActive(true)

        let graphics = this.add.graphics().setVisible(false);
        let rect = graphics.fillRect(gameOverTrigger.x, gameOverTrigger.y, gameOverTrigger.width, gameOverTrigger.height)
        this.physics.world.enable(rect)
        this.gameOverTrigger = rect.body.gameObject

        // game condition
        this.gameOver = false
        this.gamePause = false
    }

    update(time, delta) {
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

        if (this.gameOver) {
            let finalScoreText = this.add.text(width / 2, height / 2 - 60, `Final Score: ${this.score}`, textStyle)
                .setOrigin(0.5)
                .setColor('#FFF')
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

    triggerGameOver(player, gameOverTrigger) {
        console.log("Game Over Triggered")
        this.gameOver = true
        this.showMenu(true) 

        // show text
        this.missionCompleteText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Mission Complete', {
            font: '48px Arial',
            fill: '#FF0000' 
        }).setOrigin(0.5, 3)
    }
}
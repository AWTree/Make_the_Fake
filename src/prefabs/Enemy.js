class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)

        scene.add.existing(this)
        scene.physics.world.enable(this)

        this.setCollideWorldBounds(true)

        // enemy-specific properties
        this.moveDirection = -1 // start moving left (-1 for left, 1 for right)
        this.moveSpeed = 100 // movement speed
        this.toggleMoveDirectionTime = 2000 // time in ms to switch direction
        this.nextToggleTime = 0 // when to next toggle direction

        // shooting mechanics
        this.shootDelay = 2000 // delay between shots
        this.lastShotTime = 0 // when the last shot was fired
        this.shootingRange = 800

        // reference to the player
        this.monkey = scene.monkey

        // enemy points
        this.score = 10
    }


    update(time, delta) {
        // toggle move direction based on time
        if (time > this.nextToggleTime) {
            this.moveDirection *= -1 // change direction
            this.nextToggleTime = time + this.toggleMoveDirectionTime

            // flip 
            this.setFlipX(this.moveDirection > 0)
        }

        // apply velocity based on direction
        this.setVelocityX(this.moveSpeed * this.moveDirection)

        // shooting logic
        if (this.monkey && this.monkey.x !== undefined) {
            const monkeyDistance = Phaser.Math.Distance.Between(this.x, this.y, this.monkey.x, this.monkey.y) // check player distance
            const monkeyInFront = (this.body.velocity.x > 0 && this.monkey.x > this.x) || (this.body.velocity.x < 0 && this.monkey.x < this.x) // check if player is infront of the enemy
            
            if (monkeyInFront && monkeyDistance <= this.shootingRange && time - this.lastShotTime > this.shootDelay) {
                this.shoot()
                this.lastShotTime = time
            }
        }
    }

    shoot() {
        let projectile = this.scene.physics.add.sprite(this.x, this.y, 'training_atlas', 'bullet')
        this.scene.projectiles.add(projectile)
        projectile.setActive(true).setVisible(true)
        projectile.setScale(0.5)
        projectile.setVelocityX(300 * this.moveDirection)
        projectile.body.setAllowGravity(false)
        projectile.body.setCollideWorldBounds(true)

        // Automatically destroy the projectile when it goes out of bounds
        projectile.body.onWorldBounds = true;
        projectile.body.world.on('worldbounds', (body) => {
            if (body.gameObject === projectile) {
                projectile.destroy();
            }
        }, this)
    }

    defeat() {
        // play death animation if exists
        if (this.scene.anims.exists('enemy_death')) { 
            this.anims.play('enemy_death', true)
        
            this.on('animationcomplete', () => {
                this.destroy()
            })
        }
        // else destroy
        else {
            this.destroy()
        }

    }
}

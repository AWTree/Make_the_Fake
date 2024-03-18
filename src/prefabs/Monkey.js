class Monkey extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)

        this.attackHitbox = scene.physics.add.sprite(this.x, this.y)
        this.attackHitbox.setSize(40, 40)
        this.attackHitbox.setVisible(false)
        scene.physics.world.enable(this.attackHitbox)
        this.attackHitbox.body.enable = false
        this.attackHitbox.body.allowGravity = false

        this.scene = scene

        scene.add.existing(this)
        scene.physics.world.enable(this)

        this.setCollideWorldBounds(true).setMaxVelocity(scene.MAX_X_VEL, scene.MAX_Y_VEL)

        this.isGrounded = false
        this.jumps = scene.MAX_JUMPS
        this.jumping = false
        this.ACCELERATION = scene.ACCELERATION
        this.DRAG = scene.DRAG
        this.JUMP_VELOCITY = scene.JUMP_VELOCITY
        this.isAlive = true
    }

    update(cursors) {
        if (cursors.left.isDown) {
            this.setAccelerationX(-this.ACCELERATION)
            this.setFlipX(true)
            this.anims.play('walk', true)
        } 
        else if (cursors.right.isDown) {
            this.setAccelerationX(this.ACCELERATION)
            this.setFlipX(false)
            this.anims.play('walk', true)
        }
        else if (cursors.space.isDown && !this.isAttacking) {
            this.isAttacking = true
            this.anims.play('attack', true)

            this.attackHitbox.body.enable = true;
            this.attackHitbox.setPosition(this.x + (this.flipX ? -20 : 20), this.y)
            this.attackHitbox.setVisible(true)

            // delay attack
            this.scene.time.delayedCall(100, () => { 
                this.attackHitbox.body.enable = false
                this.attackHitbox.setVisible(false)
                this.isAttacking = false
            })
        } 
        else {
            this.setAccelerationX(0)
            this.setDragX(this.DRAG)
            this.anims.play('idle', true)
        }

        this.isGrounded = this.body.blocked.down || this.body.touching.down
        if (this.isGrounded) {
            this.jumps = this.scene.MAX_JUMPS
            this.jumping = false
        }

        if (this.jumps > 0 && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.body.setVelocityY(this.JUMP_VELOCITY)
            this.jumps--
            this.jumping = true
        }
    
        // Ensure jump animation plays only when in the air
        if (!this.isGrounded && this.jumping) {
            this.anims.play('jump', true)
        }
    }
}

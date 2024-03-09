class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        // preload assets for buttons if using images
        this.load.path = 'assets/'
        this.load.image('playButton', 'playButton.png');
        this.load.image('tutorialButton', 'tutorialButton.png')
        this.load.image('creditsButton', 'creditsButton.png')
        this.load.audio('menuSelect', '/sfx/mixkit-unlock-game-notification-253.wav')
    }

    create() {
        const columnWidth = 700 
        const columnStartX = this.cameras.main.centerX - columnWidth / 2
    
        // game title
        this.add.text(columnStartX, 100, 'Hit-Monkey: The Road to Shuro', { fontSize: '40px', fill: '#FFF', fontStyle: 'bold' })
           .setOrigin(0, 0.5)
    
        // calculate vertical spacing
        const baseY = 200
        const spacing = 70
    
        // play Button
        this.add.text(columnStartX, baseY, 'Play', { fontSize: '32px', fill: '#FFF' })
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play('menuSelect')
                this.scene.start('loadScene')
            })
            .setOrigin(0, 0.5)
    
        // tutorial Button
        this.add.text(columnStartX, baseY + spacing, 'Tutorial', { fontSize: '32px', fill: '#FFF' })
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play('menuSelect')
                this.scene.start('tutorialScene')
            })
            .setOrigin(0, 0.5)
    
        // credits Button
        this.add.text(columnStartX, baseY + spacing * 2, 'Credits', { fontSize: '32px', fill: '#FFF' })
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play('menuSelect')
                this.scene.start('creditsScene')
        })
            .setOrigin(0, 0.5)
    }    
}


class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    preload() {
        // preload assets for buttons if using images
        this.load.path = './assets/'
        this.load.image('background', 'background.png');
        // this.load.image('playButton', 'playButton.png');
        // this.load.image('tutorialButton', 'tutorialButton.png')
        // this.load.image('creditsButton', 'creditsButton.png')
        this.load.audio('menuSelect', './sfx/mixkit-unlock-game-notification-253.wav')
    }

    create() {
         // add background image
        let bg = this.add.image(0, 0, 'background').setOrigin(0, 0)

        bg.displayWidth = this.sys.game.config.width
        bg.displayHeight = this.sys.game.config.height

        const columnWidth = 700 
        const columnStartX = this.cameras.main.centerX - columnWidth / 2
    
        // game title
        this.add.text(columnStartX, 100, 'Hit-Monkey: The Road to Shuro', { fontSize: '40px', fill: '#FFF', fontStyle: 'bold' })
           .setOrigin(0, 0.5)
    
        // calculate vertical spacing
        const baseY = 200
        const spacing = 70

        // normal and hover colors
        const normalColor = '#FFF'
        const hoverColor = '#F00'
    
        // play Button
        let playButton = this.add.text(columnStartX, baseY, 'Play', { fontSize: '32px', fill: '#FFF' })
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play('menuSelect')
                this.scene.start('loadScene')
            })
            .on('pointerover', () => playButton.setStyle({ fill: hoverColor }))
            .on('pointerout', () => playButton.setStyle({ fill: normalColor }))
            .setOrigin(0, 0.5)
    
        // tutorial Button
        let tutorialButton = this.add.text(columnStartX, baseY + spacing, 'Tutorial', { fontSize: '32px', fill: '#FFF' })
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play('menuSelect')
                this.scene.start('tutorialScene')
            })
            .on('pointerover', () => tutorialButton.setStyle({ fill: hoverColor }))
            .on('pointerout', () => tutorialButton.setStyle({ fill: normalColor }))
            .setOrigin(0, 0.5)
    
        // credits Button
        let creditsButton = this.add.text(columnStartX, baseY + spacing * 2, 'Credits', { fontSize: '32px', fill: '#FFF' })
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play('menuSelect')
                this.scene.start('creditsScene')
            })
            .on('pointerover', () => creditsButton.setStyle({ fill: hoverColor }))
            .on('pointerout', () => creditsButton.setStyle({ fill: normalColor }))
            .setOrigin(0, 0.5)
    }    
}


class Tutorial extends Phaser.Scene {
    constructor() {
        super('tutorialScene')
    }

    preload() {
        // Preload assets for buttons if using images
    }

    create() {
       // Game Title
       this.add.text(this.cameras.main.centerX, 100, 'Tutorial', { fontSize: '40px', fill: '#FFF', fontStyle: 'bold' })
       .setOrigin(0.5, 0.5)

        // Calculate vertical spacing
        const baseY = 200
        const spacing = 50

        this.add.text(this.cameras.main.centerX, baseY, 'Arrow key for moving', { fontSize: '30px', fill: '#FFF' })
            .setOrigin(0.5, 0.5)

        this.add.text(this.cameras.main.centerX, baseY + spacing, 'Space for melee attack', { fontSize: '30px', fill: '#FFF' })
            .setOrigin(0.5, 0.5)

        this.add.text(this.cameras.main.centerX, baseY + spacing * 2, 'Press Esc for menu', { fontSize: '30px', fill: '#FFF' })
            .setOrigin(0.5, 0.5)

        this.add.text(this.cameras.main.centerX, baseY + spacing * 3, 'Press R for restart', { fontSize: '30px', fill: '#FFF' })
            .setOrigin(0.5, 0.5)

        // Credits Button
        this.add.text(this.cameras.main.centerX, baseY + spacing * 5, 'Back', { fontSize: '32px', fill: '#FFF' })
            .setInteractive()
            .on('pointerdown', () => {
                this.sound.play('menuSelect')
                this.scene.start('menuScene')
            })
            .setOrigin(0.5, 0.5)
    }
}
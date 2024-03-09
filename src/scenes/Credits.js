class Credits extends Phaser.Scene {
    constructor() {
        super('creditsScene')
    }

    preload() {
        // Preload assets for buttons if using images
    }

    create() {
       // Game Title
       this.add.text(this.cameras.main.centerX, 100, 'Credits', { fontSize: '40px', fill: '#FFF', fontStyle: 'bold' })
       .setOrigin(0.5, 0.5)

        // Calculate vertical spacing
        const baseY = 200
        const spacing = 50

        // Programming
        this.add.text(this.cameras.main.centerX, baseY, 'Programming: Arno Wu', { fontSize: '32px', fill: '#FFF' })
            .setOrigin(0.5, 0.5)

        // Art
        this.add.text(this.cameras.main.centerX, baseY + spacing, 'SFX: Arno Wu', { fontSize: '32px', fill: '#FFF' })
            .setOrigin(0.5, 0.5)

        // SFX
        this.add.text(this.cameras.main.centerX, baseY + spacing * 2, 'Art: Arno Wu', { fontSize: '32px', fill: '#FFF' })
            .setOrigin(0.5, 0.5)

        // Credits Button
        this.add.text(this.cameras.main.centerX, baseY + spacing * 5, 'Back', { fontSize: '32px', fill: '#FFF' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('menuScene'))
            .setOrigin(0.5, 0.5)
    }
}
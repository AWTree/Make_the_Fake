class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // set load path
        this.load.path = '../assets/'
        // take care of all of our asset loading now
        this.load.atlas('platformer_atlas', 'kenny_sheet.png', 'kenny_sheet.json') // kenny sheet
        this.load.atlas('monkey_atlas', 'monkey_sprites.png', 'monkey_sprites.json') // monkey sprite
        this.load.atlas('training_atlas', 'training_room.png', 'training_room.json') // training room sheet
    }

    create() {
        this.anims.create({ 
            key: 'walk', 
            frames: this.anims.generateFrameNames('monkey_atlas', {      
                prefix: 'walk',
                start: 0,
                end: 2,
                suffix: '',
                zeroPad: 4 
            }), 
            frameRate: 30,
            repeat: -1 
        })
        this.anims.create({
            key: 'idle',
            defaultTextureKey: 'monkey_atlas',
            frames: [
                { frame: 'idle' }
            ],
            repeat: -1
        })

        this.anims.create({
            key: 'jump',
            defaultTextureKey: 'monkey_atlas',
            frames: [
                { frame: 'jump' }
            ],
        })

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNames('monkey_atlas', {      
                prefix: 'attack',
                start: 0,
                end: 2,
                suffix: '',
                zeroPad: 4 
            }), 
            frameRate: 30,
            repeat: -1 
        })

        // ...and pass to the next Scene
        this.scene.start('playScene')
    }
}
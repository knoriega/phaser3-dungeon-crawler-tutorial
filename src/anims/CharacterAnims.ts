import Phaser from 'phaser'
import { AnimationKeys } from '~/consts/AnimationKeys'
import { TextureKeys } from '~/consts/TextureKeys'

function createCharacterAnims(anims: Phaser.Animations.AnimationManager) {
    anims.create({
        key: AnimationKeys.FauneIdleDown,
        frames: [{key: TextureKeys.Faune, frame: 'walk-down/walk-down-3.png'}]
    })

    anims.create({
        key: AnimationKeys.FauneIdleSide,
        frames:[{key: TextureKeys.Faune, frame: 'walk-side/walk-side-3.png'}]
    })

    anims.create({
        key: AnimationKeys.FauneIdleUp,
        frames: [{key: TextureKeys.Faune, frame: 'walk-up/walk-up-3.png'}]
    })

    anims.create({
        key: AnimationKeys.FauneRunDown,
        frames: anims.generateFrameNames(TextureKeys.Faune,
            {
                start: 1,
                end: 8,
                prefix: 'run-down/run-down-',
                suffix: '.png'
            },
            ),
        repeat: -1,
        frameRate: 15
    })

    anims.create({
        key: AnimationKeys.FauneRunUp,
        frames: anims.generateFrameNames(TextureKeys.Faune, {
            start: 1,
            end: 8,
            prefix: 'run-up/run-up-',
            suffix: '.png'
        }),
        repeat: -1,
        frameRate: 15
    })

    anims.create({
        key: AnimationKeys.FauneRunSide,
        frames: anims.generateFrameNames(TextureKeys.Faune, {
            start: 1,
            end: 8,
            prefix: 'run-side/run-side-',
            suffix: '.png'
        }),
        repeat: -1,
        frameRate: 15
    })

    anims.create({
        key: AnimationKeys.FauneFaint,
        frames: anims.generateFrameNames(TextureKeys.Faune, {
            start: 1,
            end: 4,
            prefix: 'faint/faint-',
            suffix: '.png'
        }),
        frameRate: 5
    })
}

export {
    createCharacterAnims
}
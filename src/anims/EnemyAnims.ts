import Phaser from 'phaser'
import { AnimationKeys } from '~/consts/AnimationKeys'
import { TextureKeys } from '~/consts/TextureKeys'

function createLizardAnims(anims: Phaser.Animations.AnimationManager) {
    anims.create({
        key: AnimationKeys.LiazrdIdle, 
        frames: anims.generateFrameNames(TextureKeys.Lizard, {
            start: 0,
            end: 3,
            prefix: 'lizard_f_idle_anim_f',
            suffix: '.png'
        }),
        repeat: -1,
        frameRate: 10
    })

    anims.create({
        key: AnimationKeys.LiazrdRun, 
        frames: anims.generateFrameNames(TextureKeys.Lizard, {
            start: 0,
            end: 3,
            prefix: 'lizard_f_run_anim_f',
            suffix: '.png'
        }),
        repeat: -1,
        frameRate: 10
    })
}

export {
    createLizardAnims
}
import Phaser from "phaser";
import { AnimationKeys } from "../consts/AnimationKeys";
import { TextureKeys } from "../consts/TextureKeys";

function createChestAnims(anims: Phaser.Animations.AnimationManager) {
    anims.create({
        key: AnimationKeys.ChestOpen,
        frames: anims.generateFrameNames(TextureKeys.Treasure, {
            start: 0,
            end: 2,
            prefix: 'chest_empty_open_anim_f',
            suffix: '.png'
        }),
        frameRate: 5
    })

    anims.create({
        key: AnimationKeys.ChestClosed,
        frames: [{key: TextureKeys.Treasure, frame: 'chest_empty_open_anim_f0.png'}]
    })
}

export {
    createChestAnims
}
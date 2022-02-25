import Phaser from 'phaser'
import { AnimationKeys } from '~/consts/AnimationKeys'

export default class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)
    this.play(AnimationKeys.ChestClosed)
  }

  open() {
    if (this.anims.currentAnim.key !== AnimationKeys.ChestClosed) return 0

    this.anims.play(AnimationKeys.ChestOpen)
    return Phaser.Math.Between(1000, 1200)
  }
}

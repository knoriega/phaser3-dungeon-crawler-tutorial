import Phaser from 'phaser'
import { SceneKeys } from '../consts/SceneKeys'
import { TextureKeys } from '../consts/TextureKeys'
import { EventKeys, sceneEvents } from '../events/EventCenter'

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group

  constructor() {
    super({ key: SceneKeys.GameUI })
  }

  create() {
    this.add.image(6, 26, TextureKeys.Treasure, 'coin_anim_f0.png')
    const coinsLabel = this.add.text(12, 20, '0', {
      fontSize: '14'
    })

    sceneEvents.on(EventKeys.PlayerCoinsChange, (coins: number) => {
      coinsLabel.text = coins.toLocaleString()
    })

    /* Creating hearts as a group */
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image
    })

    /* Swapping textures on hit */
    this.hearts.createMultiple({
      key: TextureKeys.HeartFull,
      setXY: {
        x: 10,
        y: 10,
        stepX: 16
      },
      quantity: 3
    })

    sceneEvents.on(
      EventKeys.PlayerHealthChange,
      this.handlePlayerHealthChanged,
      this
    )

    /* Clean up for when this scene ends -- don't want multiple event listeners hanging around*/
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        EventKeys.PlayerHealthChange,
        this.handlePlayerHealthChanged
      )

      sceneEvents.off(EventKeys.PlayerCoinsChange)
    })
  }

  private handlePlayerHealthChanged(health: number) {
    /* Determine how many full hearts to show */
    this.hearts.children.each((go, idx) => {
      const heart = go as Phaser.GameObjects.Image
      if (idx < health) heart.setTexture(TextureKeys.HeartFull)
      else heart.setTexture(TextureKeys.HeartEmpty)
    })
  }
}

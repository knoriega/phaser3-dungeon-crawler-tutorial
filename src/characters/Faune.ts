import Phaser from 'phaser'
import { AnimationKeys } from '../consts/AnimationKeys'
import { TextureKeys } from '../consts/TextureKeys'
import { EventKeys, sceneEvents } from '../events/EventCenter'
import Chest from '../items/Chest'

enum GameObjectFactoryFunctions {
  faune = 'faune' // Generates faune object
}

/* 
To make sure Phaser knows the factory exists 
when using intellisense -- Declaration merging of namespaces 
*/
declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      [GameObjectFactoryFunctions.faune](
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Faune
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

export default class Faune extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE
  private damageTime = 0
  private _health = 3
  private _coins = 0

  private _knives?: Phaser.Physics.Arcade.Group
  private activeChest?: Chest

  get health() {
    return this._health
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame)
    this.anims.play(AnimationKeys.FauneIdleDown)
  }

  set knives(knives: Phaser.Physics.Arcade.Group) {
    this._knives = knives
  }

  set chest(chest: Chest) {
    this.activeChest = chest
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (
      !cursors ||
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    )
      return

    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      if (this.activeChest) {
        this._coins += this.activeChest.open()
        sceneEvents.emit(EventKeys.PlayerCoinsChange, this._coins)
      } else this.throwKnife()

      return
    }

    const speed = 100
    const leftDown = cursors.left.isDown
    const rightDown = cursors.right.isDown
    const upDown = cursors.up.isDown
    const downDown = cursors.down.isDown

    if (leftDown) {
      this.play(AnimationKeys.FauneRunSide, true)
      this.setVelocity(-speed, 0)

      /* When we flip a sprite, it can be outside of its physics bounding
            box. So we can offset it as a quick solution */
      this.scaleX = -1 // Flip around for left running animation
      this.body.offset.x = 24
    } else if (rightDown) {
      this.play(AnimationKeys.FauneRunSide, true)
      this.setVelocity(speed, 0)

      this.scaleX = 1
      this.body.offset.x = 8
    } else if (upDown) {
      this.play(AnimationKeys.FauneRunUp, true)
      this.setVelocity(0, -speed)
    } else if (downDown) {
      this.play(AnimationKeys.FauneRunDown, true)
      this.setVelocity(0, speed)
    } else {
      const parts = this.anims.currentAnim.key.split('-')
      parts[1] = 'idle'
      this.anims.play(parts.join('-'), true)
      this.setVelocity(0, 0)
    }

    if (leftDown || rightDown || upDown || downDown) {
      this.activeChest = undefined
    }
  }

  private throwKnife() {
    if (!this._knives) return

    const parts = this.anims.currentAnim.key.split('-')
    const direction = parts[2]

    const vec = new Phaser.Math.Vector2(0, 0)
    const knife = this._knives?.get(
      this.x,
      this.y,
      TextureKeys.Knife
    ) as Phaser.Physics.Arcade.Image
    if (!knife) return

    switch (direction) {
      case 'up':
        vec.y = -1
        knife.body.setSize(knife.height, knife.width) // So that hitbox is aligned w/ knife direction
        break

      case 'down':
        vec.y = 1
        knife.body.setSize(knife.height, knife.width)
        break

      case 'side':
        if (this.scaleX < 0)
          // Use Faune's direction to determine knife direction
          vec.x = -1
        else vec.x = 1
        break
    }

    const speed = 150
    const angle = vec.angle()

    knife.setActive(true)
    knife.setVisible(true)

    knife.setRotation(angle)
    knife.x += vec.x * 16
    knife.y += vec.y * 16

    knife.setVelocity(vec.x * speed, vec.y * speed)
  }

  preUpdate(time: number, delta: number): void {
    /* Make sure to call super.preUpdate() so Phaser can take of its usual workflow! */
    super.preUpdate(time, delta)

    /* Basic state machine (basically) */
    switch (this.healthState) {
      case HealthState.IDLE:
        break

      case HealthState.DAMAGE:
        this.damageTime += delta
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE
          this.setTint(0xffffff)
          this.damageTime = 0
        }
        break
    }
  }

  handleDamage(dir: Phaser.Math.Vector2) {
    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    )
      return

    --this._health

    if (this._health <= 0) {
      /* die */
      this.healthState = HealthState.DEAD
      this.play(AnimationKeys.FauneFaint)
      this.setVelocity(0, 0)
    } else {
      this.setVelocity(dir.x, dir.y)
      this.setTint(0xff0000) // Red
      this.healthState = HealthState.DAMAGE
      this.damageTime = 0
    }
  }
}

/* Game Object Factory Pattern */
Phaser.GameObjects.GameObjectFactory.register(
  GameObjectFactoryFunctions.faune,
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    /* Copying general flow from how Physics.add.sprite() works */

    const sprite = new Faune(this.scene, x, y, texture, frame)
    this.displayList.add(sprite)
    this.updateList.add(sprite)
    this.scene.physics.world.enableBody(
      sprite,
      Phaser.Physics.Arcade.DYNAMIC_BODY
    )

    sprite.body.setSize(sprite.width * 0.5, sprite.height * 0.8)

    return sprite
  }
)

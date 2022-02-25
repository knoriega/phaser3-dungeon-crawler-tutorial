import Phaser from 'phaser'
import { createCharacterAnims } from '../anims/CharacterAnims'
import { createLizardAnims } from '../anims/EnemyAnims'
import { SceneKeys } from '../consts/SceneKeys'
import { TextureKeys } from '../consts/TextureKeys'
import { TileKeys } from '../consts/TileKeys'
import Lizard from '../enemies/Lizard'
import { EventKeys, sceneEvents } from '../events/EventCenter'

/* Import the character file so that typescript knows to register the GameObjectFactory function */
import '../characters/Faune'
import Faune from '../characters/Faune'
import { createChestAnims } from '../anims/TreasureAnims'
import { debugDraw } from '../utils'
import Chest from '../items/Chest'

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private faune!: Faune
  private knives!: Phaser.Physics.Arcade.Group
  private lizards!: Phaser.Physics.Arcade.Group

  /* TODO: Move the collision/destruction to Faune class? */
  private playerLizardsCollider?: Phaser.Physics.Arcade.Collider

  constructor() {
    super(SceneKeys.Game)
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create() {
    this.scene.run(SceneKeys.GameUI)

    createLizardAnims(this.anims)
    createCharacterAnims(this.anims)
    createChestAnims(this.anims)

    const map = this.make.tilemap({ key: TextureKeys.Dungeon })
    const tileset = map.addTilesetImage(
      TextureKeys.Dungeon,
      TextureKeys.Tiles,
      16,
      16,
      1,
      2
    )

    map.createLayer(TileKeys.DungeonGround, tileset)
    const chestLayer = map.getObjectLayer(TileKeys.Chests)
    const wallLayer = map.createLayer(TileKeys.DungeonWalls, tileset)
    const chests = this.physics.add.staticGroup({
      classType: Chest
    })

    chestLayer.objects.forEach((chestObj) => {
      chests.get(
        chestObj.x! + chestObj.height! * 0.5,
        chestObj.y! - chestObj.height! * 0.5,
        TextureKeys.Treasure
      )
    })

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3
    })

    this.faune = this.add.faune(
      128,
      128,
      TextureKeys.Faune,
      'walk-down/walk-down-1.png'
    )
    this.faune.knives = this.knives

    wallLayer.setCollisionByProperty({ collides: true })
    // debugDraw(wallLayer, this)

    this.cameras.main.startFollow(this.faune, true)

    this.lizards = this.physics.add.group({
      classType: Lizard,
      /* Enable collision as Lizard objects are created */
      createCallback: (go) => {
        const goLizard = go as Lizard
        goLizard.body.onCollide = true
      }
    })
    this.lizards.get(256, 128, TextureKeys.Lizard)
    const lizardLayer = map.getObjectLayer('Lizards')
    lizardLayer.objects.forEach((lizard) => {
      this.lizards.get(
        lizard.x! + lizard.width! * 0.5,
        lizard.y! - lizard.height! * 0.5
      )
    })

    this.physics.add.collider(this.faune, wallLayer)
    this.physics.add.collider(this.lizards, wallLayer)

    this.physics.add.collider(
      this.faune,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    )

    /* TODO: Remove collider from dead lizard */
    this.physics.add.collider(
      this.knives,
      wallLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    )

    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeLizardCollision,
      undefined,
      this
    )

    this.playerLizardsCollider = this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this
    )
  }

  handlePlayerChestCollision(
    obj1: Phaser.GameObjects.GameObject, // Faune
    obj2: Phaser.GameObjects.GameObject // Chest
  ) {
    const chest = obj2 as Chest
    this.faune.chest = chest

    /* Want to give chest to player to open */
  }

  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject, // Knife
    obj2: Phaser.GameObjects.GameObject // Lizard
  ) {
    this.knives.killAndHide(obj1)
    this.lizards.killAndHide(obj2)
  }

  private handleKnifeWallCollision(
    obj1: Phaser.GameObjects.GameObject, // Knife
    obj2: Phaser.GameObjects.GameObject // Wall
  ) {
    this.knives.killAndHide(obj1)
  }

  private handlePlayerLizardCollision(
    player: Phaser.GameObjects.GameObject,
    lizard: Phaser.GameObjects.GameObject
  ) {
    const _lizard = lizard as Lizard

    const dx = this.faune.x - _lizard.x
    const dy = this.faune.y - _lizard.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
    this.faune.handleDamage(dir)

    /* New health value is whatever we pass in */
    sceneEvents.emit(EventKeys.PlayerHealthChange, this.faune.health)

    if (this.faune.health <= 0) this.playerLizardsCollider?.destroy()
  }

  update(t: number, dt: number) {
    if (!this.faune) return

    this.faune.update(this.cursors)
  }
}

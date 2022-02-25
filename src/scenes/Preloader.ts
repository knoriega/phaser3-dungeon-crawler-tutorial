import Phaser, { Scene } from 'phaser'
import { SceneKeys } from '~/consts/SceneKeys'
import { TextureKeys } from '~/consts/TextureKeys'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image(TextureKeys.Tiles, 'tiles/dungeon_tiles_extruded.png')
        // this.load.image(TextureKeys.Tiles, 'tiles/dungeon_tiles.png')
        this.load.tilemapTiledJSON(TextureKeys.Dungeon, 'tiles/dungeon01.json')

        this.load.atlas(TextureKeys.Faune, 'character/faune.png', 'character/faune.json')
        this.load.atlas(TextureKeys.Lizard, 'enemies/lizard.png', 'enemies/lizard.json')
        this.load.atlas(TextureKeys.Treasure, 'items/treasure.png', 'items/treasure.json')

        this.load.image(TextureKeys.HeartFull, 'ui/ui_heart_full.png')
        this.load.image(TextureKeys.HeartEmpty, 'ui/ui_heart_empty.png')

        this.load.image(TextureKeys.Knife, 'weapons/weapon_knife.png')
    }

    
    create() {
        this.scene.start(SceneKeys.Game)
    }
}
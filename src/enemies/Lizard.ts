import Phaser from "phaser";
import { AnimationKeys } from "../consts/AnimationKeys";

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

const randomDirection = (exclude: Direction) => {
    let newDirection = Phaser.Math.Between(0, 3)
    
    while (newDirection === exclude)
        newDirection = Phaser.Math.Between(0, 3)
    
    return newDirection
}

export default class Lizard extends Phaser.Physics.Arcade.Sprite {
    private speed = 50
    private direction = Direction.RIGHT
    private moveEvent: Phaser.Time.TimerEvent

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)   

        this.anims.play(AnimationKeys.LiazrdIdle, true)
        
        scene.physics.world.on(
            Phaser.Physics.Arcade.Events.TILE_COLLIDE, 
            this.handleTileCollision, 
            this
        )

        this.moveEvent = scene.time.addEvent({
            delay: 2000,
            callback: () => this.direction = randomDirection(this.direction),
            loop: true
        })
    }

    private handleTileCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        /* Lizard wasn't colliding object */
        if (go !== this)
            return
        
        const newDirection = Phaser.Math.Between(0, 3)
        this.direction = newDirection
    }

    destroy(fromScene?: boolean): void {
        this.moveEvent.destroy()
        super.destroy()
    }

    preUpdate(time: number, delta: number): void {
        super.preUpdate(time, delta)    

        switch(this.direction) {
            case Direction.UP:
                this.setVelocity(0, -this.speed)
                break
            
            case Direction.DOWN:
                this.setVelocity(0, this.speed)
                break
            
            case Direction.LEFT:
                this.setVelocity(-this.speed, 0)
                break

            case Direction.RIGHT:
                this.setVelocity(this.speed, 0)
                break
        }
    }

}
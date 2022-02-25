import Phaser from 'phaser'

const sceneEvents = new Phaser.Events.EventEmitter()

enum EventKeys {
  PlayerHealthChange = 'player-health-change',
  PlayerCoinsChange = 'player-coins-change'
}

export { sceneEvents, EventKeys }

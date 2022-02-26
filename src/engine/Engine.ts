import { Zeppelin } from '../airplanes/Zeppelin'
import { JetBlue } from '../skyObjects/JetBlue'
import { JetYellow } from '../skyObjects/JetYellow'
import { Background, BackgroundOptions } from './common/Background'
import { GroudObject, GroudObjectOptions } from './common/GroudObject'
import { Player } from './common/Player'
import { SkyObject, SkyObjectOptions } from './common/SkyObject'
import { Sprite } from './common/Sprite'

export type EngineState = {
  /**
   * Everything ready to start
   */
  ready: boolean
  /**
   * Game is running
   */
  running: boolean
  /**
   * Horizontal speed in km/h
   */
  playerSpeed: number
  /**
   * Fly distance in m
   */
  playerDistance: number
  /**
   * Player collisions counter
   */
  playerCollisions: number
  /**
   * Player verticals speed in m/s, can be negative
   */
  playerVerticalSpeed: number
  /**
   * Is game over
   */
  gameOver: boolean
}

type EngineClass = {
  class: string
}

export type EngineResources = {
  player: EngineClass
  backgrounds: Array<EngineClass & BackgroundOptions>
  groudObjects: Array<EngineClass & GroudObjectOptions>
  skyObjects: Array<EngineClass & SkyObjectOptions>
}

export type EngineOptions = {
  debug?: boolean
  canvas: HTMLCanvasElement
  width: number
  height: number
  onStateChange?: (state: EngineState) => void
  onCollide?: (skyObject: SkyObject) => void
  onGameOver?: () => void
}

export class Engine {
  debug?: boolean
  protected w = 0
  protected h = 0
  protected onStateChange?: EngineOptions['onStateChange']
  protected onGameOver?: EngineOptions['onGameOver']
  protected onCollide?: EngineOptions['onCollide']
  private initialState = {
    ready: false,
    running: false,
    playerDistance: 0,
    playerCollisions: 0,
    playerSpeed: 0,
    playerVerticalSpeed: 0,
    gameOver: false,
  }
  protected state: EngineState = { ...this.initialState }
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D

  sprites: Sprite[] = []
  backgrounds: Background[] = []
  skyObjects: SkyObject[] = []
  groudObjects: GroudObject[] = []
  player!: Player

  classes = Object.assign({},
    Sprite.Sprite,
    Background.Background,
    SkyObject.SkyObject,
    GroudObject.GroudObject,
    Zeppelin.Zeppelin,
    JetBlue.JetBlue,
    JetYellow.JetYellow,
  )

  constructor(options: EngineOptions) {
    this.debug = options.debug
    this.canvas = options.canvas
    this.w = options.width
    this.h = options.height
    this.canvas.width = options.width
    this.canvas.height = options.height
    this.ctx = this.canvas.getContext('2d')!
    this.onStateChange = options.onStateChange
    this.onCollide = options.onCollide
    this.onGameOver = options.onGameOver
    this.attachEvents()
    this.watchState()
    this.update()
    this.log('Engine start, awaiting resources initialization')
  }

  log(message: string) {
    if (this.debug) {
      console.log(`Engine: ${message}`)
    }
  }

  protected control(state: boolean) {
    if (this.state.ready && !this.state.gameOver) {
      this.player.goUp(state)
      this.log(`Control ${state ? 'UP' : 'DOWN'}`)
    }
  }
  
  protected attachEvents() {
    this.canvas.addEventListener('mousedown', () => this.control(true))
    this.canvas.addEventListener('mouseup', () => this.control(false))
    this.canvas.addEventListener("touchstart", () => this.control(true))
    this.canvas.addEventListener("touchend", () => this.control(false))
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.control(true)
      }
    })
    window.addEventListener('keyup', (e) => this.control(false))
  }

  protected watchState() {
    setInterval(() => {
      if (this.state.ready) {
        this.state.playerSpeed = Math.round(this.player.speed * 100)
        this.state.playerDistance += Math.round(this.state.playerSpeed  / 60)
        this.state.playerVerticalSpeed = Math.round(this.player.verticalSpeed * 10)
        if (this.player.speed === 0 && this.player.verticalSpeed === 0) {
          if (this.state.gameOver === false) {
            this.state.gameOver = true
            this.log(`GameOver`)
            this.onGameOver?.()
          }
        }
      }
      this.onStateChange?.(this.state)
    }, 100)
  }

  reset() {
    this.state = { ... this.initialState }
  }

  init(resources: EngineResources) {
    this.log('Loading resources')
    this.reset()
    const { player, backgrounds, skyObjects, groudObjects} = resources
    this.player = this.classes[player.class](this)
    this.backgrounds = backgrounds.map((options) => this.classes[options.class](this, options))
    this.skyObjects = skyObjects.map((options) => this.classes[options.class](this, options))
    this.groudObjects = groudObjects.map((options) => this.classes[options.class](this, options))
    this.resourcesLoad()
  }

  protected resourcesLoad() {
    if (this.sprites.every((sprite) => sprite.ready)) {
      this.state.ready = true
      this.log('Resoruces ready')
    } else {
      setTimeout(() => this.resourcesLoad(), 1)
    }
  }
  
  protected updateBackground() {
    this.backgrounds.forEach((background) => background.update())
  }

  protected updateSkyObjects() {
    this.skyObjects.forEach((skyObject) => {
      !skyObject.delay && skyObject.go()
      skyObject.update()
    })
  }

  protected updateGroudObjects() {
    this.groudObjects.forEach((groudObject) => {
      !groudObject.delay && groudObject.go()
      groudObject.update()
    })
  }

  protected updatePlayer() {
    this.player.update()
  }

  protected checkCollision() {
    const trashhold = 0.8
    for (const skyObject of this.skyObjects) {
      if (skyObject.delay && !skyObject.crashing) {
        const pb = this.player.bounds
        const eb = skyObject.bounds
        if (
          pb.x < eb.x + (eb.w * trashhold) &&
          pb.x + (pb.w * trashhold) > eb.x &&
          pb.y < eb.y + (eb.h * trashhold) &&
          (pb.h * trashhold) + pb.y > eb.y) {
          this.state.playerCollisions++
          this.onCollide?.(skyObject)
          this.log(`Collide with SkyObject[${skyObject.id}]`)
          return skyObject
        }
      }
    }
    return null
  }

  protected clear() {
    this.ctx.clearRect(0, 0, this.w, this.h)
  }

  protected update() {
    this.clear()
    if (this.state.ready) {
      this.updateBackground()
      this.updateGroudObjects()
      this.updateSkyObjects()
      this.updatePlayer()
      const skyObject = this.checkCollision()
      if (skyObject) {
        switch (skyObject.type) {
          case 'SPEED_DECRESE':
            this.player.collide()
            skyObject.crash()
            break
          case 'SPEED_BOOST':
            this.player.boost(2)
            skyObject.crash()
            break
        }
      }
    }
    requestAnimationFrame(this.update.bind(this))
  }
}
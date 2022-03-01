import { Zeppelin } from '../airplanes/Zeppelin'
import { JetBlue } from '../skyObjects/JetBlue'
import { JetYellow } from '../skyObjects/JetYellow'
import { Background, BackgroundOptions } from './common/Background'
import { BackgroundLayer, BackgroundLayerOptions } from './common/BackgroundLayer'
import { GroudObject, GroudObjectOptions } from './common/GroudObject'
import { Player } from './common/Player'
import { SkyObject, SkyObjectOptions } from './common/SkyObject'
import { Sprite, SpriteOptions } from './common/Sprite'
import { utils } from './utils'

export type EngineState = {
  /**
   * Everything ready to start
   */
  ready: boolean
  /**
   * Resources is loading
   */
  loading: number[]
  /**
   * Game is running
   */
  running: boolean
  /**
   * frames per secods
   */
  fps: number
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
   * Player did pass sky objects
   */
  playerPassSkyObject: number
  /**
   * Is game over
   */
  gameOver: boolean
  /**
   * lives
   */
  hearts: number
}

type EngineClass = {
  class: string
}

type EngineClassIdName = {
  id: string
  name: string
}

export type EngineResources = {
  player: EngineClass & EngineClassIdName & SpriteOptions
  map: EngineClassIdName & {
    backgrounds: Array<EngineClass & BackgroundLayerOptions>
    groudObjects: Array<EngineClass & GroudObjectOptions>
    skyObjects: Array<EngineClass & SkyObjectOptions>
  }
}

export type EngineOptions = {
  debug?: boolean
  container: HTMLDivElement
  width: number
  height: number
  onStateChange?: (state: EngineState) => void
  onCollide?: (skyObject: SkyObject) => void
  onGameOver?: () => void
}

export class Engine {
  debug?: boolean

  pause: boolean = false

  private framerateControl = {
    target: 1000 / 60,
    now: 0,
    elapsed: 0,
    then: 0,
  }

  private frames: number[] = []

  protected w = 0

  protected h = 0

  protected onStateChange?: EngineOptions['onStateChange']

  protected onGameOver?: EngineOptions['onGameOver']

  protected onCollide?: EngineOptions['onCollide']

  private initialState = {
    ready: false,
    loading: [0, 0],
    running: false,
    fps: 0,
    playerDistance: 0,
    playerCollisions: 0,
    playerSpeed: 0,
    playerVerticalSpeed: 0,
    gameOver: false,
    hearts: 3,
    playerPassSkyObject: 0,
  }

  state: EngineState = { ...this.initialState }

  container!: HTMLDivElement

  canvas!: HTMLCanvasElement

  ctx!: CanvasRenderingContext2D

  sprites: Sprite[] = []

  backgrounds: BackgroundLayer[] = []

  skyObjects: SkyObject[] = []

  groudObjects: GroudObject[] = []

  player!: Player

  classes = {
    ...Sprite.Sprite,
    ...Background.Background,
    ...BackgroundLayer.BackgroundLayer,
    ...SkyObject.SkyObject,
    ...GroudObject.GroudObject,
    ...Player.Player,
    ...Zeppelin.Zeppelin,
    ...JetBlue.JetBlue,
    ...JetYellow.JetYellow,
  }

  constructor(options: EngineOptions) {
    this.debug = options.debug
    this.container = options.container
    this.w = options.width
    this.h = options.height
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
      if (this.state.hearts <= 0 && state) {
        this.log(`No hearts to control UP`)
        return
      }
      this.player.goUp(state)
      this.log(`Control ${state ? 'UP' : 'DOWN'}`)
    }
  }

  setHearts(hearts: number) {
    if (hearts) {
      this.state.hearts = hearts
    } else {
      this.state.hearts = 0
    }
  }

  protected attachEvents() {
    window.addEventListener('mousedown', () => this.control(true))
    window.addEventListener('mouseup', () => this.control(false))
    window.addEventListener('touchstart', () => this.control(true))
    window.addEventListener('touchend', () => this.control(false))
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
        this.state.playerDistance += Math.round(this.state.playerSpeed / 60)
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
    this.state = { ...this.initialState }
    this.container.innerHTML = ''
  }

  init(resources: EngineResources) {
    this.log('Loading resources')
    this.reset()

    this.canvas = document.createElement('canvas')
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    this.canvas.width = this.w
    this.canvas.height = this.h
    this.ctx = this.canvas.getContext('2d', { alpha: true })!

    this.container.append(this.canvas)

    const { player, map } = resources
    const { backgrounds, skyObjects, groudObjects } = map
    //@ts-expect-error
    this.player = this.classes[player.class](this, player)
    this.backgrounds = backgrounds.map((options) =>
      //@ts-expect-error
      this.classes[options.class](this, options),
    )
    this.skyObjects = skyObjects.map((options) =>
      //@ts-expect-error
      this.classes[options.class](this, options),
    )
    this.groudObjects = groudObjects.map((options) =>
      //@ts-expect-error
      this.classes[options.class](this, options),
    )
    this.resourcesLoad()
  }

  protected resourcesLoad() {
    this.state.loading = [
      this.sprites.filter((sprite) => sprite.ready).length,
      this.sprites.length,
    ]

    if (this.state.loading[0] === this.state.loading[1]) {
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
          pb.x < eb.x + eb.w * trashhold &&
          pb.x + pb.w * trashhold > eb.x &&
          pb.y < eb.y + eb.h * trashhold &&
          pb.h * trashhold + pb.y > eb.y
        ) {
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
    requestAnimationFrame(this.update.bind(this))
    this.framerateControl.now = performance.now()
    if (this.frames.length === 0) {
      this.frames = '.'
        .repeat(60)
        .split('.')
        .map((_, i) => this.framerateControl.now - 1000 / i)
    }
    this.framerateControl.elapsed = this.framerateControl.now - this.framerateControl.then
    if (this.framerateControl.elapsed > this.framerateControl.target) {
      while (
        this.frames.length > 0 &&
        this.frames[0] <= this.framerateControl.now - 990
      ) {
        this.frames.shift()
      }
      this.frames.push(this.framerateControl.now)
      if (this.frames.length) {
        this.state.fps = this.frames.length
      }
      if (this.state.ready) {
        if (this.pause) {
          return
        }
        this.clear()
        this.updateBackground()
        this.updateGroudObjects()
        this.updateSkyObjects()
        this.updatePlayer()
        const skyObject = this.checkCollision()
        if (skyObject) {
          switch (skyObject.type) {
            case 'SPEED_DECRESE':
              this.setHearts(this.state.hearts - 1)
              this.player.collide()
              skyObject.crash()
              break
            case 'SPEED_BOOST':
              this.player.boost(1)
              skyObject.crash()
              break
          }
        }
      }
      this.framerateControl.then =
        this.framerateControl.now -
        (this.framerateControl.elapsed % this.framerateControl.target)
    }
  }
}

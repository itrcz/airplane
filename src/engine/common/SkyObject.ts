import { Engine } from '../Engine'
import { utils } from '../utils'
import { Sprite, SpriteOptions } from './Sprite'

export type SkyObjectType = 'SPEED_DECRESE' | 'SPEED_BOOST'

export type SkyObjectOptions = SpriteOptions & {
  delay?: number
  speed?: number
  type?: SkyObjectType
  bouncing?: boolean
  randomHue?: boolean
}

export class SkyObject extends Sprite {
  id = utils.id

  type: SkyObjectType = 'SPEED_DECRESE'

  bouncing = false

  randomHue = false

  hue = 0

  static SkyObject = {
    SkyObject: (engine: Engine, options: SkyObjectOptions) =>
      new SkyObject(engine, options),
  }

  speed = 8

  verticalSpeed = 0

  initialDelay = 0

  delay = 0

  collected = true

  crashing = 0

  x = -99999

  y = -99999

  constructor(engine: Engine, options: SkyObjectOptions) {
    super(engine, options)
    this.initialDelay = options.delay || 0
    this.delay = this.initialDelay
    this.speed = options.speed || this.speed
    this.type = options.type || this.type
    this.bouncing = options.bouncing || this.bouncing
    this.randomHue = options.randomHue || this.randomHue
  }

  get bounds() {
    return {
      x: this.x,
      y: this.y,
      w: this.img.width,
      h: this.img.height,
    }
  }

  go() {
    const screenEdgePadding = 10
    this.verticalSpeed = (utils.rnd(0, 140) - 70) / 140
    this.y = utils.rnd(
      screenEdgePadding,
      this.engine.canvas.height - this.img.height - screenEdgePadding,
    )
    this.x = this.engine.canvas.width
    this.delay = this.initialDelay
    this.crashing = 0
    this.collected = false
    if (this.randomHue) {
      this.hue = utils.rnd(0, 180)
    }
  }

  crash() {
    this.collected = true
    this.crashing = 100
  }

  collect() {
    if (!this.collected) {
      this.collected = true
      this.engine.state.playerPassSkyObject++
    }
  }

  needRender() {
    return !(this.x < -this.img.width)
  }

  update() {
    let { y } = this
    const { img, x, bouncing } = this
    if (this.crashing) {
      if (this.type === 'SPEED_BOOST') {
        this.y -= 10
      }
      this.y += 4
      this.crashing--
    } else {
      this.y += this.verticalSpeed
    }
    if (this.needRender()) {
      if (bouncing && !this.crashing) {
        y += Math.sin(x / 80) * 20
      }
      this.engine.ctx.save()
      if (this.hue) {
        this.engine.ctx.filter = `hue-rotate(${this.hue}deg)`
      }
      this.engine.ctx.drawImage(img, x, y, img.width, img.height)
      this.engine.ctx.restore()
      this.x += -(this.speed + this.verticalSpeed + this.engine.player.speed * 2)
    } else {
      this.collect()
      this.delay--
    }
  }
}

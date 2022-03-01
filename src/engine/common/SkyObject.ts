import { Engine } from '../Engine'
import { Sprite, SpriteOptions } from './Sprite'
import { utils } from '../utils'

export type SkyObjectType = 'SPEED_DECRESE' | 'SPEED_BOOST'

export type SkyObjectOptions = SpriteOptions & {
  delay?: number
  speed?: number
  type?: SkyObjectType
  bouncing?: boolean
}

export class SkyObject extends Sprite {
  id = utils.id
  type: SkyObjectType = 'SPEED_DECRESE'
  bouncing = false
  
  static SkyObject = ({ 
    SkyObject: (engine: Engine, options: SkyObjectOptions) => new SkyObject(engine, options)
  })
  speed = 8
  verticalSpeed = 0
  initialDelay = 0
  delay = 0
  crashing = 0
  x = -999
  y = -999
  constructor(engine: Engine, options: SkyObjectOptions) {
    super(engine, options)
    this.initialDelay = options.delay || 0
    this.delay = this.initialDelay
    this.speed = options.speed || this.speed
    this.type = options.type || this.type
    this.bouncing = options.bouncing || this.bouncing
  }
  
  get bounds() {
    return {
      x: this.x,
      y: this.y,
      w: this.img.width,
      h: this.img.height
    }
  }

  go() {
    const screenEdgePadding = 20
    this.verticalSpeed = (utils.rnd(0, 100) - 50) / 500
    this.y = utils.rnd(screenEdgePadding, this.engine.canvas.height - this.img.height - screenEdgePadding)
    this.x = this.engine.canvas.width
    this.delay = this.initialDelay
    this.crashing = 0
  }

  crash() {
    this.crashing = 100
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
    if (x > -img.width) {
      if (bouncing && !this.crashing) {
        y = y + Math.sin(x / 80) * 20
      }
      this.engine.ctx.drawImage(img, x, y, img.width, img.height)
      this.x += -(this.speed + this.engine.player.speed)
    } else {
      this.delay--
    }
  }
}
import { Engine } from '../Engine'
import { Sprite, SpriteOptions } from './Sprite'
import { utils } from '../utils'

export type GroudObjectOptions = SpriteOptions & {
  delay?: number
  speedMultiplexor?: number
}

export class GroudObject extends Sprite {
  id = utils.id
  static GroudObject = ({ 
    GroudObject: (engine: Engine, options: GroudObjectOptions) => new GroudObject(engine, options)
  })
  private speedMultiplexor = 1
  delay = 0
  x = -999
  y = -999
  constructor(engine: Engine, options: GroudObjectOptions) {
    super(engine, options)
    this.delay = options.delay || 0
    this.speedMultiplexor = options.speedMultiplexor || 1
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
    const xPos = this.engine.canvas.height - this.img.height
    this.y = utils.rnd(xPos - 10, xPos)
    this.x = this.engine.canvas.width
    this.delay = 100
  }

  update() {
    const { img, x , y } = this
    if (x > -img.width) {
      this.x -= -(2 * this.speedMultiplexor + this.engine.player.speed)
      this.engine.ctx.drawImage(img, Math.round(x), y, img.width, img.height)
      this.x += -10 - this.engine.player.speed
    } else {
      this.delay--
    }
  }
}
import { Engine } from "../Engine"
import { Sprite, SpriteOptions } from "./Sprite"

export type BackgroundOptions = SpriteOptions & {
  speedMultiplexor?: number
  opacity?: number
  static?: boolean
}

export class Background extends Sprite {
  static Background = ({ 
    Background: (engine: Engine, options: BackgroundOptions) => new Background(engine, options)
  })
  private speedMultiplexor = 1
  x1 = 0
  x2 = 0
  y1 = 0
  y2 = 0
  opacity = 1
  static = false
  xOffset = 0

  constructor(engine: Engine, options: BackgroundOptions) {
    super(engine, {
      ...options,
      width: options.width || engine.canvas.width,
      height: options.height || engine.canvas.height,
    })
    this.x2 = this.img.width -1
    this.y1 = this.engine.canvas.height - this.img.height
    this.y2 = this.engine.canvas.height - this.img.height
    this.speedMultiplexor = options.speedMultiplexor || 1
    this.opacity = options.opacity || 1
    this.static = options.static || false
  }

  update() {
    const { img, x1, y1, x2, y2, xOffset, opacity } = this
    if (!this.static) {
      this.xOffset += 2 * this.speedMultiplexor + this.engine.player.speed
      if (this.xOffset >= this.engine.canvas.width - 1) {
        this.xOffset = 0
      }
    }
    this.engine.ctx.save()
    this.engine.ctx.globalAlpha = opacity
    this.engine.ctx.drawImage(this.img, Math.round(x1 - xOffset), y1, img.width, img.height)
    if (!this.static) {
      this.engine.ctx.drawImage(this.img, Math.round(x2 - xOffset), y2, img.width, img.height)
    }
    this.engine.ctx.restore()
  }
}

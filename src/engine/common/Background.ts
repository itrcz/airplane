import { Engine } from "../Engine"
import { Sprite, SpriteOptions } from "./Sprite"

export type BackgroundOptions = SpriteOptions & {
  speedOffset?: number
  opacity?: number
  blur?: number
}

export class Background extends Sprite {
  static Background = ({ 
    Background: (engine: Engine, options: BackgroundOptions) => new Background(engine, options)
  })
  private speedOffset = 1
  x1 = 0
  x2 = 0
  y1 = 0
  y2 = 0
  opacity = 1
  blur = 0
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
    this.speedOffset = options.speedOffset || 1
    this.opacity = options.opacity || 1
    this.blur = options.blur || 0
  }

  update() {
    const { img, x1, y1, x2, y2, xOffset, opacity } = this
    this.xOffset += this.engine.player.speed * this.speedOffset
    if (this.xOffset >= this.engine.canvas.width -1) {
      this.xOffset = 0
    }
    this.engine.ctx.save()
    this.engine.ctx.globalAlpha = opacity
    if (this.blur > 0) {
      this.engine.ctx.filter = `blur(${this.blur}px)`
    }
    this.engine.ctx.drawImage(img, x1 - xOffset, y1, img.width, img.height)
    this.engine.ctx.drawImage(img, x2 - xOffset, y2, img.width, img.height)
    this.engine.ctx.restore()
  }
}

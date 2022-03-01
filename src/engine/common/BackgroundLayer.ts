import { Engine } from "../Engine"
import { utils } from "../utils"
import { Sprite, SpriteOptions } from "./Sprite"

export type BackgroundLayerOptions = SpriteOptions & {
  speed?: number
  opacity?: number
  blur?: number
}

export class BackgroundLayer extends Sprite {
  static BackgroundLayer = ({ 
    BackgroundLayer: (engine: Engine, options: BackgroundLayerOptions) => new BackgroundLayer(engine, options)
  })
  div!: HTMLDivElement
  x = 0
  y = 0
  private speed = 0
  constructor(engine: Engine, options: BackgroundLayerOptions) {
    super(engine, {
      ...options,
      width: options.width || engine.canvas.width,
      height: options.height || engine.canvas.height,
    })

    this.speed = options.speed || 0
    this.div = document.createElement('div')
    this.div.id = utils.id
    this.div.style.position = 'absolute'
    this.div.style.left = '0'
    this.div.style.bottom = '0'
    this.div.style.background = `url(${this.img.src}) repeat-x`
    this.div.style.height = this.img.height + 'px'
    this.div.style.width = this.img.width + 'px'
    if (options.opacity) {
      this.div.style.opacity = options.opacity.toString()
    }
    if (options.blur) {
      this.div.style.filter = `blur(${options.blur}px)`
    }
    this.engine.canvas.parentNode?.insertBefore(this.div, this.engine.canvas);
  }
  update() {
    if (this.speed) {
      let inc = this.engine.player.speed * this.speed * 2
      if (inc) {
        inc += 2
      }
      this.x += inc
      this.div.style.backgroundPosition = `${-this.x}px 0`
    }
  }
}

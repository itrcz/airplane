import { Engine } from "../Engine"

export type SpriteOptions = {
  src?: string
  width?: number
  height?: number
}

export class Sprite {
  static Sprite = ({ 
    Sprite: (engine: Engine, options: SpriteOptions) => new Sprite(engine, options)
  })
  engine!: Engine
  img!: HTMLImageElement
  ready = false

  constructor(engine: Engine, options: SpriteOptions) {
    console.log(options)
    this.engine = engine
    this.img = new Image()
    this.img.onload = () => this.ready = true
    this.img.src = options.src || '/assets/sprite.svg'
    this.img.width = options.width || 100
    this.img.height = options.height || 100
    this.engine.sprites.push(this)
  }
}

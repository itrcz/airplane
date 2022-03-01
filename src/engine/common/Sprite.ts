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
  spriteCanvas!: HTMLCanvasElement
  ready = false

  private createCanvas() {
    this.spriteCanvas = document.createElement('canvas')
    this.spriteCanvas.width = this.img.width
    this.spriteCanvas.height = this.img.height
    this.spriteCanvas.getContext('2d')?.drawImage(this.img, 0, 0, this.img.width, this.img.height)
  }

  constructor(engine: Engine, options: SpriteOptions) {
    this.engine = engine
    this.img = new Image()
    this.img.onload = () => {
      this.createCanvas()
      this.ready = true
    }
    this.img.src = options.src || '/assets/sprite.svg'
    this.img.width = options.width || 100
    this.img.height = options.height || 100
    this.engine.sprites.push(this)
  }
}

import { SkyObject } from "../engine/common/SkyObject";
import { Sprite } from "../engine/common/Sprite";
import { Engine } from "../engine/Engine";

type JetYellowOptions = {
  delay?: number
}

export class JetYellow extends SkyObject {
  static JetYellow = ({ 
    JetYellow: (engine: Engine, options: JetYellowOptions) => new JetYellow(engine, options)
  })
  propeller!: Sprite
  propellerAngle = 0

  constructor(engine: Engine, options: JetYellowOptions) {
    super(engine, {
      src: '/assets/jet_yellow_base.svg',
      width: 100,
      height: 80,
      delay: options.delay || 100
    })
    this.propeller = new Sprite(engine, {
      src: '/assets/jet_yellow_propeller.svg',
      width: 55,
      height: 55,
    })
  }

  update() {
    super.update()
    this.engine.ctx.save()
    const { img } = this.propeller
    this.engine.ctx.translate(this.x + 8, this.y + 40)
    this.engine.ctx.rotate(Math.PI / 180 * (this.propellerAngle += this.speed * 10))
    this.engine.ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)
    this.engine.ctx.restore()
  }
}
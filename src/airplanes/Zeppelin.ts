import { Player } from "../engine/common/Player";
import { Sprite } from "../engine/common/Sprite";
import { Engine } from "../engine/Engine";

type ZeppelinOptions = {

}

export class Zeppelin extends Player {
  static Zeppelin = ({ 
    Zeppelin: (engine: Engine, options: ZeppelinOptions) => new Zeppelin(engine, options)
  })
  propeller!: Sprite
  propellerAngle = 0

  constructor(engine: Engine, options?: {}) {
    super(engine, {
      src: '/assets/zeppelin_base.svg', 
      width: 220, 
      height: 120,
    })
    this.propeller = new Sprite(engine, {
      src: '/assets/zeppelin_propeller.svg', 
      width: 18,
      height: 18,
    })
  }

  update() {
    super.update()
    this.engine.ctx.save()
    const { img } = this.propeller
    this.engine.ctx.translate(this.x - 10, this.y - this.engine.player.verticalSpeed * 4 + 50)
    this.engine.ctx.rotate(Math.PI / 180 * (this.propellerAngle += this.speed * 10 - this.verticalSpeed / 10))
    this.engine.ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)
    this.engine.ctx.restore()
  }
}
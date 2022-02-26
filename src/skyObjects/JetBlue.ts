import { SkyObject } from "../engine/common/SkyObject";
import { Sprite } from "../engine/common/Sprite";
import { Engine } from "../engine/Engine";

type JetBlueOptions = {
  delay?: number
}

export class JetBlue extends SkyObject {
  static JetBlue = ({ 
    JetBlue: (engine: Engine, options: JetBlueOptions) => new JetBlue(engine, options)
  })
  propeller!: Sprite
  speed = 5

  constructor(engine: Engine, options: JetBlueOptions) {
    super(engine, {
      src: '/assets/jet_blue_base.svg',
      width: 150,
      height: 80,
      delay: options.delay || 100
    })
  }
}
import { Engine } from '../Engine'
import { Sprite, SpriteOptions } from './Sprite'


export class Player extends Sprite {
  static Player = {
    Player: (engine: Engine, options: SpriteOptions) => new Player(engine, options),
  }

  crashed = false

  speed = 0.3

  maxSpeed = 3

  acceleration = 0.001

  verticalSpeed = 1

  x = 40

  y = 0

  private up = false

  get bounds() {
    return {
      x: this.x,
      y: this.y,
      w: this.img.width,
      h: this.img.height,
    }
  }

  goUp(up = false) {
    this.up = up
  }

  collide() {
    this.speed -= this.acceleration * 200
  }

  boost(multiply = 1) {
    this.speed += this.acceleration * 1000 * (multiply || 1)

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed
    }
  }

  update() {
    if (this.speed === 0 && this.verticalSpeed === 0) {
      this.crashed = true
      return
    }
    /**
     * Increase vertical speed if we have horizontal speed
     */
    if (this.speed > 0 && this.verticalSpeed < 4) {
      this.verticalSpeed += this.acceleration * 100
    }

    /**
     * Decrease speed if player fall
     */
    if (this.y > this.engine.canvas.height) {
      this.speed -= this.acceleration * 100
      // Reset vertical speed if we stall
      if (this.speed < 2 && this.verticalSpeed > 0) {
        this.verticalSpeed = 0
      }
    }

    /**
     * Player wanna up
     */
    if (this.up && this.speed > 0) {
      // if vertical speed more then 40 m/s
      if (this.verticalSpeed > -4) {
        this.verticalSpeed -= 1 * this.speed
      }
      if (this.y > -this.img.height / 2) {
        this.speed -= this.acceleration * 2
      }
    } else {
      // increase speed if we not crashed yet
      if (this.y < this.engine.canvas.height - this.img.height / 2) {
        this.speed += this.acceleration
      }
    }

    this.speed += this.acceleration

    /**
     * Reset speed to zero if it less then 0
     */
    if (this.speed < 0) {
      this.speed = 0
    }

    // Moving airplane up
    if (this.verticalSpeed < 0 && this.speed > 0) {
      if (this.y > 0) {
        this.y += this.verticalSpeed
      } else {
        this.verticalSpeed += 0.3
      }
    }

    // Moving airplane down
    if (this.y < this.engine.canvas.height && this.verticalSpeed > 0) {
      this.y += this.verticalSpeed
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed
    }

    /**
     * Saving state for correct rotation
     */
    const { width, height } = this.img
    this.engine.ctx.save()
    this.engine.ctx.translate(this.x + 100, this.y + 60)
    this.engine.ctx.rotate((Math.PI / 180) * this.verticalSpeed * 2)
    this.engine.ctx.drawImage(this.img, -width / 2, -height / 2, width, height)
    this.engine.ctx.restore()
  }
}

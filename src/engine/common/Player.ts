import { Sprite } from './Sprite'

export class Player extends Sprite {
  crashed = false
  speed = 1
  verticalSpeed = 1
  x = 40
  y = 0
  private up = false

  get bounds() {
    return {
      x: this.x,
      y: this.y,
      w: this.img.width,
      h: this.img.height
    }
  }

  goUp(up = false) {
    this.up = up
  }

  collide() {
    this.speed = this.speed / 1.5
  }

  boost(speed = 1) {
    this.speed += speed
  }

  update() {    
    if (this.speed === 0 && this.verticalSpeed === 0) {
      this.crashed = true
      return
    }
    /**
     * Increase vertical speed if we have horizontal speed
     */
    if (this.speed > 0 && this.verticalSpeed < 2) {
      this.verticalSpeed += 0.05
    }

    /**
     * Decrease speed if player fall
     */
    if (this.y > this.engine.canvas.height) {
      this.speed -= 0.05
      // Reset vertical speed if we stall
      if (this.speed < 1 && this.verticalSpeed > 0) {
        this.verticalSpeed = 0
      }
    }

    /**
     * Player wanna up
     */
    if (this.up) {
      // if vertical speed more then 20 m/s
      if (this.verticalSpeed > -2) {
        this.verticalSpeed -= 0.2 * this.speed / 2
      }
      if (this.y > -this.img.height / 2) {
        this.speed -= 0.001
      }
    } else {
      // increase speed if we not crashed yet
      if (this.y < this.engine.canvas.height - this.img.height / 2) {
        this.speed += 0.002
      }
    }

    /**
     * Reset speed to zero if it less then 0
     */
    if (this.speed < 0) {
      this.speed = 0
    }

    // Moving airplane up
    if (this.verticalSpeed < 0) {
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

    /**
     * Saving state for correct rotation
     */
     const { width, height } = this.img
     this.engine.ctx.save()
     this.engine.ctx.translate(this.x + 100 , this.y + 60)    
     this.engine.ctx.rotate(Math.PI / 180 * this.verticalSpeed * 2)
     this.engine.ctx.drawImage(this.img, -width / 2, -height / 2, width, height)
     this.engine.ctx.restore()
  }
}
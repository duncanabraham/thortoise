const PiCamera = require('pi-camera')

class Camera {
  constructor(options) {
    Object.assign(this, options)
    device = new PiCamera(options.cameraSettings)
  }

  async getImage() {
    await this.device.snap().then(()=>{
      
    })
  }
}

module.exports = Camera

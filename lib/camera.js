class Camera {
  constructor (options = {}) {
    // this.device = new PiCamera(options)
    Object.assign(this, options)
  }

  async snap () {
    console.log('need to implement snap')
  }

  /**
   * take an image, which gets stored to disk
   */
  getImage () {
    return new Promise((resolve, reject) => {
      this.snap() // TODO: I don't know what this provides in terms of attaributes etc, can probably just return the function rather than add .then and .catch
        .then(() => {
          resolve()
        })
        .catch((e) => {
          reject(e)
        })
    })
  }
}

module.exports = Camera

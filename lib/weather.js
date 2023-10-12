const HttpClient = require('./webtalk')
const log = require('./log')

class Weather {
  constructor () {
    this.weatherData = {}
    this.hasData = false
    this.isActive = false
    this.url = 'https://api.open-meteo.com/v1/forecast?latitude=51&longitude=-3.3&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,uv_index,is_day,direct_radiation&windspeed_unit=ms'
    this.httpClient = new HttpClient()
  }

  init () {
    this.start()
    this._getData()
  }

  stop () {
    if (this.schedule) {
      clearInterval(this.schedule)
    }
  }

  start () {
    this.schedule = setInterval(this._getData.bind(this), 1000 * 60 * 60 * 24) // one per day
  }

  _parseData (data) {
    const { hourly, hourly_units: hourlyUnits } = data || {}
    if (!hourly || !hourly.time) {
      return {}
    }
    const { time, ...weatherParams } = hourly
    return time.reduce((acc, timestamp, i) => {
      acc[timestamp] = Object.entries(weatherParams).reduce((entryAcc, [key, values]) => {
        const camelCasedKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
        entryAcc[camelCasedKey] = {
          value: values[i],
          unit: hourlyUnits[key]
        }
        return entryAcc
      }, {})
      return acc
    }, {})
  }

  async _getData () {
    try {
      const response = await this.httpClient.get(this.url)
      const data = JSON.parse(response.data)
      if (data && data.elevation) {
        this.hasData = true
        this.isActive = true
        this.weatherData = this._parseData(data)
      } else {
        this.isActive = false
        this.hasData = false
        log.info('Received empty data')
      }
    } catch (e) {
      this.isActive = false
      this.hasData = false
      log.error('Failed to get weather data:', e)
    }
  }
}

module.exports = Weather

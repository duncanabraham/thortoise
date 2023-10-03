const gpsd = require('node-gpsd')

let listener = new gpsd.Listener({
  port: 2947,
  hostname: 'localhost',
  parse: true
})

listener.connect(() => {
  console.log('Connected to GPSD')
})

listener.on('TPV', data => {
  console.log('Received TPV data:', data)
  if (data.track !== undefined) {
    console.log(`Heading: ${data.track} degrees`)
  } else {
    console.log('Heading information is not available.')
  }
})

listener.watch({
  class: 'WATCH',
  json: true,
  nmea: false
})

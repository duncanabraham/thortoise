const i2c = require('i2c-bus');

// LPS22HB I2C address (0x5C)
const lps22hbAddress = 0x5C;

// Register addresses for control and data
const ctrlReg1 = 0x10;       // Control Register 1
const statusReg = 0x27;      // Status Register
const pressureDataReg = 0x28; // Pressure Data Register (24-bit)
const temperatureDataReg = 0x2B; // Temperature Data Register (16-bit)

// Open the I2C bus
const i2cBus = i2c.openSync(1); // Replace with your I2C bus number

// Configure the LPS22HB sensor for continuous mode (enable pressure and temperature measurements)
i2cBus.writeByteSync(lps22hbAddress, ctrlReg1, 0x3); // Set bits 0 and 1 to 1

// Main loop for continuous data reading
setInterval(() => {
  // Check if new data is available
  const status = i2cBus.readByteSync(lps22hbAddress, statusReg);
  if ((status & 0x02) !== 0) {
    // Read pressure data (24 bits)
    const pressureBytes = i2cBus.readI2cBlockSync(lps22hbAddress, pressureDataReg, 3, Buffer.alloc(3));
    const pressureRaw = (pressureBytes[2] << 16) | (pressureBytes[1] << 8) | pressureBytes[0];
    const pressure_hPa = pressureRaw / 4096.0;

    // Read temperature data (16 bits)
    const temperatureBytes = i2cBus.readI2cBlockSync(lps22hbAddress, temperatureDataReg, 2, Buffer.alloc(2));
    const temperatureRaw = (temperatureBytes[1] << 8) | temperatureBytes[0];
    const temperature_C = (42.5 + (temperatureRaw / 480.0));

    // Output the pressure and temperature
    console.log(`Pressure (hPa): ${pressure_hPa.toFixed(2)}, Temperature (°C): ${temperature_C.toFixed(2)}`);
  }
}, 1000); // Read data every 1 second

// Leave this running until you want to stop reading data

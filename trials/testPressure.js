const i2c = require('i2c-bus');

// LPS22HB I2C address (0x5C)
const lps22hbAddress = 0x5C;

// Register address for WHO_AM_I (0x0F)
const whoAmIRegister = 0x0F;

// Open the I2C bus
const i2cBus = i2c.openSync(1); // Replace with your I2C bus number

// Read the WHO_AM_I register
const whoAmIValue = i2cBus.readByteSync(lps22hbAddress, whoAmIRegister);

// Expected WHO_AM_I value from the datasheet (e.g., 0xB1)
const expectedValue = 0xB1;

// Check if the response matches the expected value
if (whoAmIValue === expectedValue) {
  console.log('LPS22HB sensor is responding correctly.');
} else {
  console.error('LPS22HB sensor did not respond as expected.');
}

// Close the I2C bus
i2cBus.closeSync();

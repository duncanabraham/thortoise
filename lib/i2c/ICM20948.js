const registers = require('./ICM20948_registers')
const i2cBase = require('./i2cBase') // Import your existing i2cBase class

const { atan2, sqrt, PI } = Math

class ICM20948 extends i2cBase {
  constructor(options = { i2cAddress: 0x68 }) {
    super(options, registers) // Calling the constructor of the parent class
    this._initialize()
  }

  _initialize() {
    // Reset device
    this._writeByte(this.REG_ADD_PWR_MGMT_1, this.REG_VAL_ALL_RGE_RESET);
  
    // Wait for the device to reset
    this._delay(100);
  
    // Set clock source (Assuming a register and value exists for this)
    this._writeByte(this.REG_ADD_PWR_MGMT_1, this.REG_VAL_CLOCK_SOURCE);
  
    // Configure accelerometer (Assuming a register and value exists for this)
    this._writeByte(this.REG_ADD_ACCEL_CONFIG, this.REG_VAL_ACCEL_CONFIG);
  
    // Configure gyro (Assuming a register and value exists for this)
    this._writeByte(this.REG_ADD_GYRO_CONFIG, this.REG_VAL_GYRO_CONFIG);
  
    // Enable and configure magnetometer (Assuming a register and value exists for this)
    this._writeByte(this.REG_ADD_MAG_CONTROL, this.REG_VAL_MAG_ENABLE);
  
    // Optionally set the data output rate here
  }
  

  _readSensorData() {
    // Read the accelerometer
    const accelX = this._readWord(this.REG_ADD_ACCEL_XOUT_H)
    const accelY = this._readWord(this.REG_ADD_ACCEL_YOUT_H)
    const accelZ = this._readWord(this.REG_ADD_ACCEL_ZOUT_H)
    // Read the magnetometer
    const magX = this._readWord(this.REG_ADD_MAG_XOUT_H)
    const magY = this._readWord(this.REG_ADD_MAG_YOUT_H)
    const magZ = this._readWord(this.REG_ADD_MAG_ZOUT_H)

    return { accelX, accelY, accelZ, magX, magY, magZ }
  }

  _calculateOrientation(sensorData) {
    const { accelX, accelY, accelZ, magX, magY, magZ } = sensorData

    // Calculate Roll, Pitch, and Yaw
    const roll = atan2(accelY, accelZ) * (180 / PI)
    const pitch = atan2(-accelX, sqrt(accelY * accelY + accelZ * accelZ)) * (180 / PI)

    // Calculate Yaw using magnetometer and roll, pitch values
    const magXComp = magX * cos(pitch) + magZ * sin(pitch)
    const magYComp = magX * sin(roll) * sin(pitch) + magY * cos(roll) - magZ * sin(roll) * cos(pitch)
    const yaw = atan2(magYComp, magXComp) * (180 / PI)

    // Calculate compass heading
    let heading = yaw
    if (heading < 0) heading += 360

    return { pitch, roll, yaw, heading }
  }

  async getData() {
    const sensorData = await this._readSensorData()
    const orientation = this._calculateOrientation(sensorData)
    return orientation
  }
}

module.exports = ICM20948

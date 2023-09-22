const i2c = require('i2c-bus');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

const DFLT_BUS = 1;
const DFLT_ADDRESS = 0x0d;
const REG_XOUT_LSB = 0x00;
const REG_YOUT_LSB = 0x02;
const REG_CONTROL_1 = 0x09;
const REG_CONTROL_2 = 0x0a;
const REG_RST_PERIOD = 0x0b;
const REG_STATUS_1 = 0x06;

const MODE_STBY = 0b00000000;
const MODE_CONT = 0b00000001;
const ODR_10HZ = 0b00000000;
const RNG_2G = 0b00000000;
const OSR_512 = 0b00000000;

class QMC5883L {
  constructor(options = {}) {
    this.busNumber = options.busNumber || DFLT_BUS;
    this.address = options.address || DFLT_ADDRESS;
    this.i2c1 = i2c.openSync(this.busNumber);
    this.mode_cont = MODE_CONT | ODR_10HZ | RNG_2G | OSR_512;
    this.mode_standby();
    this.mode_continuous();
  }

  mode_continuous() {
    this._writeByte(REG_CONTROL_2, 0b10000000); // Soft reset
    this._writeByte(REG_CONTROL_2, 0b00000001); // Disable interrupt
    this._writeByte(REG_RST_PERIOD, 0x01); // Define SET/RESET period
    this._writeByte(REG_CONTROL_1, this.mode_cont); // Set operation mode
  }

  mode_standby() {
    this._writeByte(REG_CONTROL_2, 0b10000000);
    this._writeByte(REG_CONTROL_2, 0b00000001);
    this._writeByte(REG_RST_PERIOD, 0x01);
    this._writeByte(REG_CONTROL_1, MODE_STBY);
  }

  _writeByte(registry, value) {
    this.i2c1.writeByteSync(this.address, registry, value);
    sleep(10);
  }

  async _getData() {
    const status = await this._readByte(REG_STATUS);
    let x, y, z;
    
    if (status & 1) {
      // Data is ready
      const buffer = await this._readBytes(REG_X_LSB, 6);
      x = this._readWord(buffer, 0);
      y = this._readWord(buffer, 2);
      z = this._readWord(buffer, 4);
    } else {
      throw new Error("Data not ready");
    }
  
    return { x, y, z };
  }

  async getBearing() {
    try {
      const { x, y, z } = await this._getData();
      const bearing = Math.atan2(y, x);
      if (bearing < 0) {
        return bearing + 2 * Math.PI;
      }
      return bearing;
    } catch (e) {
      console.error(e.message);
      return null;
    }
  }
  
  

  async getMagnet() {
    let status = this.i2c1.readByteSync(this.address, REG_STATUS_1);
    if (status & 0x01) {
      let x = this.i2c1.readWordSync(this.address, REG_XOUT_LSB);
      let y = this.i2c1.readWordSync(this.address, REG_YOUT_LSB);
      return this.calculateBearing(x, y);
    }
    return null;
  }

  calculateBearing(x, y) {
    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    if (bearing < 0) bearing += 360;
    return bearing;
  }
}

(async () => {
  const sensor = new QMC5883L();
  
  // Repeatedly read sensor data every second (1000 milliseconds)
  setInterval(async () => {
    const bearing = await sensor.getBearing();
    if (bearing !== null) {
      console.log(`Bearing: ${bearing}`);
    } else {
      console.log('Data not ready');
    }
  }, 1000);

})();


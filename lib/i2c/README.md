# I2C devices

I2C is a serial communication bus used to string one or more devices together. There are plenty of articles online so I won't bore you with the details.

## Modules

A base class exists to provide all the low level calls and a number of higher level drivers have been created on top of this base.

|  Module   | Type      | Description                                                          |
|-----------|-----------|----------------------------------------------------------------------|
| BH1750FVI | LIGHT     | Light intensity sensor                                               |
| i2cBase   |           | The base class providing low level calls to the other modules        |
| ICM20948  | IMU       | 9-axis motion sensor                                                 |
| INA3221   | Current   | 3 Channel current and voltage sensor                                 |
| LPS22HB   | Pressure  | Barometer and Temperature sensor                                     |
| MPU6050   | IMU       | 9 axis accelerometer and gyro                                        |
| PCA9685   | PWM       | A PWM controller for servos, motors and LEDs                         |
| QMC5883L  | Direction | A magnetometer giving high precission compass readings               |
| SC16IS752 | GPIO      | 2 channel UART with programmable io                                  |
| TCA9548A  | MUX       | A multiplexor allowing up to 8 devices to share a single I2C address |

None of these are complete or tested yet.  Most are translated from Python scripts or worked out from datasheets.

My purpose for these drivers is to develop my sensor code which will eliminate the need for 3rd party frameworks.

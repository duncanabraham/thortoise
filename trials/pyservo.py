# Servo demo
import smbus
import time
import math

BOARD_I2C_ADDR = 0x40
CHANNEL_0_START = 0x06
CHANNEL_0_END = 0x08
CHANNEL_1_START = 0x0A
CHANNEL_1_END = 0x0C
CHANNEL_2_START = 0x0E
CHANNEL_2_END = 0x10
MODE1_REG_ADDR = 0
PRE_SCALE_REG_ADDR = 0xFE

bus = smbus.SMBus(3)

# Enable prescaler change
bus.write_byte_data(BOARD_I2C_ADDR, MODE1_REG_ADDR, 0x10)

# Set prescaler to 50Hz from datasheet calculation
bus.write_byte_data(BOARD_I2C_ADDR, PRE_SCALE_REG_ADDR, 0x80)
time.sleep(.25)

# Enable word writes
bus.write_byte_data(BOARD_I2C_ADDR, MODE1_REG_ADDR, 0x20)

angle=80
testServo=5


SERVO_CONSTANT = 2.295
pos = math.floor((angle * SERVO_CONSTANT) + 71)

def sleep():
  # Front Left
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 0), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 0), math.floor((20 * SERVO_CONSTANT) + 71))

  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 1), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 1), math.floor((110 * SERVO_CONSTANT) + 71))

  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 2), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 2), math.floor((120 * SERVO_CONSTANT) + 71))



  # Front Right
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 3), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 3), math.floor((180 * SERVO_CONSTANT) + 71))

  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 4), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 4), math.floor((80 * SERVO_CONSTANT) + 71))

  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 5), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 5), math.floor((110 * SERVO_CONSTANT) + 71))



def stand():
  # Front Left
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 0), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 0), math.floor((10 * SERVO_CONSTANT) + 71))

  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 1), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 1), math.floor((170 * SERVO_CONSTANT) + 71))

  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 2), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 2), math.floor((170 * SERVO_CONSTANT) + 71))



  # Front Right
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 3), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 3), math.floor((190 * SERVO_CONSTANT) + 71))

  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 4), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 4), math.floor((30 * SERVO_CONSTANT) + 71))

  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * 5), 0)
  bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * 5), math.floor((30 * SERVO_CONSTANT) + 71))


stand()

time.sleep(3)


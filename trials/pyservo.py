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

angle=190
testServo=3


SERVO_CONSTANT = 2.295
pos = math.floor((angle * SERVO_CONSTANT) + 71)
bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START+(4 * testServo), 0)
bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END+(4 * testServo), pos)

time.sleep(1)

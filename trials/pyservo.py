# Servo demo
import smbus
import time

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

# Set channel start times
bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_START, 0)

angle=10
direction=1

while True:
    # Set Standard servos to 0 degrees - 0.5ms pulse
    bus.write_word_data(BOARD_I2C_ADDR, CHANNEL_0_END, angle)
    time.sleep(0.1)
    if angle + direction > 170 or angle + direction < 10:
        direction *= -1
    angle=angle + direction


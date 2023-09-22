import smbus
import time

bus = smbus.SMBus(1)
address = 0x0D  # default I2C address for QMC5883L

# Initialize QMC5883L
bus.write_byte_data(address, 0x09, 0x1D)  # Set continuous measurement mode

def read_data(reg_address):
    low = bus.read_byte_data(address, reg_address)
    high = bus.read_byte_data(address, reg_address + 1)

    value = (high << 8) + low

    if value >= 0x8000:
        return -((65535 - value) + 1)
    else:
        return value

while True:
    mag_x = read_data(0x01)
    mag_y = read_data(0x03)
    mag_z = read_data(0x05)

    print(f"Magnetometer: X = {mag_x}, Y = {mag_y}, Z = {mag_z}")

    time.sleep(1)

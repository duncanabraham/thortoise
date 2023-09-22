import smbus
import time
import math

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

    heading = math.atan2(mag_y, mag_x)
    
    # Convert heading to degrees
    heading = heading * (180 / math.pi)
    
    # Normalize heading to range [0, 360]
    if heading < 0:
        heading += 360

    print(f"Magnetometer: X = {mag_x}, Y = {mag_y}, Heading = {heading:.2f}°")

    time.sleep(1)

import smbus
import time
import math

bus = smbus.SMBus(1)
address = 0x68  # default I2C address for MPU6050

# Initialize MPU-6050
bus.write_byte_data(address, 0x6B, 0x00)  # Wake up MPU-6050

def read_data(reg_address):
    high = bus.read_byte_data(address, reg_address)
    low = bus.read_byte_data(address, reg_address + 1)
    value = (high << 8) + low

    if value >= 0x8000:
        return -((65535 - value) + 1)
    else:
        return value

while True:
    accel_x = read_data(0x3B) / 16384.0
    accel_y = read_data(0x3D) / 16384.0
    accel_z = read_data(0x3F) / 16384.0

    # Calculate pitch and roll based on accelerometer data
    pitch = math.atan2(accel_y, math.sqrt(accel_x**2 + accel_z**2)) * (180 / math.pi)
    roll = math.atan2(-accel_x, accel_z) * (180 / math.pi)

    print(f"Pitch: {pitch:.2f}°, Roll: {roll:.2f}°")

    time.sleep(0.1)

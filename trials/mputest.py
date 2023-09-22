import smbus
import time

bus = smbus.SMBus(1)
address = 0x68  # default I2C address for MPU6050

# Initialize MPU6050
bus.write_byte_data(address, 0x6B, 0)

def read_data(reg_address):
    high = bus.read_byte_data(address, reg_address)
    low = bus.read_byte_data(address, reg_address + 1)

    value = (high << 8) + low

    if value >= 0x8000:
        return -((65535 - value) + 1)
    else:
        return value

while True:
    accel_x = read_data(0x3B)
    accel_y = read_data(0x3D)
    accel_z = read_data(0x3F)
    gyro_x = read_data(0x43)
    gyro_y = read_data(0x45)
    gyro_z = read_data(0x47)

    print(f"Accelerometer: X = {accel_x}, Y = {accel_y}, Z = {accel_z}")
    print(f"Gyroscope: X = {gyro_x}, Y = {gyro_y}, Z = {gyro_z}")

    time.sleep(1)

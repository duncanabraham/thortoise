from sense_hat import SenseHat

sense = SenseHat()

while True:
    pressure = sense.get_pressure()
    temperature = sense.get_temperature()
    
    # Output pressure and temperature
    print(f"Pressure: {pressure:.2f} hPa")
    print(f"Temperature: {temperature:.2f} °C")

# Optionally, you can add a delay to control the reading frequency.

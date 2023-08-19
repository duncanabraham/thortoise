from flask import Flask, request
# No code needs to be inserted here

from ODrive import ODrive

app = Flask(__name__)
odrive = ODrive(uart_id=1, baudrate=115200)

@app.route('/options', methods=['POST'])
def set_options():
    data = request.get_json()
    motor = data.get('motor')
    mode = data.get('mode')
    speed = data.get('speed')
    direction = data.get('direction')
    resistance = data.get('resistance')

    if motor is not None:
        odrive.setMode(motor, mode)
    if speed is not None:
        odrive.setMotorSpeed(motor, speed)
    if direction is not None:
        odrive.setMotorDirection(motor, direction)
    if resistance is not None:
        odrive.setBrakeResistance(resistance)

    return {'status': 'success'}, 200

@app.route('/status', methods=['GET'])
def get_status():
    status = odrive.getStatus()
    voltage = odrive.getVoltage()
    return {'status': status, 'voltage': voltage}, 200

@app.route('/motor/error', methods=['GET'])
def get_motor_error():
    motor = request.args.get('motor')
    if motor is not None:
        error = odrive.getMotorError(motor)
        return {'error': error}, 200
    else:
        return {'error': 'No motor specified'}, 400

@app.route('/motor/position', methods=['GET'])
def get_motor_position():
    motor = request.args.get('motor')
    if motor is not None:
        position = odrive.getMotorPosition(motor)
        return {'position': position}, 200
    else:
        return {'error': 'No motor specified'}, 400

@app.route('/motor/velocity', methods=['GET'])
def get_motor_velocity():
    motor = request.args.get('motor')
    if motor is not None:
        velocity = odrive.getMotorVelocity(motor)
        return {'velocity': velocity}, 200
    else:
        return {'error': 'No motor specified'}, 400

@app.route('/motor/current', methods=['GET'])
def get_motor_current():
    motor = request.args.get('motor')
    if motor is not None:
        current = odrive.getMotorCurrent(motor)
        return {'current': current}, 200
    else:
        return {'error': 'No motor specified'}, 400

@app.route('/motor/mode', methods=['GET'])
def get_current_mode():
    motor = request.args.get('motor')
    if motor is not None:
        mode = odrive.getCurrentMode(motor)
        return {'mode': mode}, 200
    else:
        return {'error': 'No motor specified'}, 400


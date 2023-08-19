from machine import UART
import ujson
  
class ODrive:
  def __init__(self, uart_id, baudrate=115200):
    self.uart = UART(uart_id, baudrate)

  def handleData(self):
    if self.uart.any():
      data = self.uart.readline()
      print('ODrive response: ', data)

  def getMotorError(self, motor):
    self.uart.write('get_error {} {}\n'.format(motor, 0))
    return self.uart.readline()

  def getMotorPosition(self, motor):
    self.uart.write('get_position {} {}\n'.format(motor, 0))
    return self.uart.readline()

  def getMotorVelocity(self, motor):
    self.uart.write('get_velocity {} {}\n'.format(motor, 0))
    return self.uart.readline()

  def getMotorCurrent(self, motor):
    self.uart.write('get_current {} {}\n'.format(motor, 0))
    return self.uart.readline()

  def getCurrentMode(self, motor):
    self.uart.write('get_mode {} {}\n'.format(motor, 0))
    return self.uart.readline()

  def getVoltage(self):
    self.uart.write('get_voltage {} {}\n'.format(0, 0))
    return self.uart.readline()

  def getSettings(self):
    self.uart.write('get_settings {} {}\n'.format(0, 0))
    return self.uart.readline()
  
  def setMotorSpeed(self, motor, speed):
    self.uart.write('v {} {}\n'.format(motor, speed))

  def setMotorDirection(self, motor, direction):
    self.uart.write('d {} {}\n'.format(motor, direction))
    
  def setupODrive(self, config):
    for key, value in config.items():
      self.uart.write('c {} {}\n'.format(key, value))

  def setMode(self, motor, mode):
    self.uart.write('m {} {}\n'.format(motor, mode))
  def setBrakeResistance(self, resistance):
    self.uart.write('b {} {}\n'.format(0, resistance))

  def setVelocityLimit(self, limit):
    self.uart.write('vl {} {}\n'.format(0, limit))

  def setCurrentLimit(self, limit):
    self.uart.write('cl {} {}\n'.format(0, limit))

  def setAccelerationLimit(self, limit):
    self.uart.write('al {} {}\n'.format(0, limit))

  def setDecelerationLimit(self, limit):
    self.uart.write('dl {} {}\n'.format(0, limit))

  def setVelocityGain(self, gain):
    self.uart.write('vg {} {}\n'.format(0, gain))

  def setPositionGain(self, gain):
    self.uart.write('pg {} {}\n'.format(0, gain))

  def setVelocityIntegratorGain(self, gain):
    self.uart.write('vig {} {}\n'.format(0, gain))

  def setPositionIntegratorGain(self, gain):
    self.uart.write('pig {} {}\n'.format(0, gain))

  def setMotorType(self, type):
    self.uart.write('mt {} {}\n'.format(0, type))

  def setEncoderType(self, type):
    self.uart.write('et {} {}\n'.format(0, type))

  def setEncoderCPR(self, cpr):
    self.uart.write('ec {} {}\n'.format(0, cpr))

  def setEncoderOffset(self, offset):
    self.uart.write('eo {} {}\n'.format(0, offset))

  def setEncoderDirection(self, direction):
    self.uart.write('ed {} {}\n'.format(0, direction))

  def setMotorPolePairs(self, pairs):
    self.uart.write('pp {} {}\n'.format(0, pairs))

  def setAxisState(self, state):
    self.uart.write('as {} {}\n'.format(0, state))

  def setControlMode(self, mode):
    self.uart.write('cm {} {}\n'.format(0, mode))

  def setInputMode(self, mode):
    self.uart.write('im {} {}\n'.format(0, mode))

  def setInputFilterBandwidth(self, bandwidth):
    self.uart.write('ifb {} {}\n'.format(0, bandwidth))

  def setHomingSpeed(self, speed):
    self.uart.write('hs {} {}\n'.format(0, speed))

  def setHomingDirection(self, direction):
    self.uart.write('hd {} {}\n'.format(0, direction))

  def setHomingSwitchPin(self, pin):
    self.uart.write('hsp {} {}\n'.format(0, pin))

  def setHomingSwitchPolarity(self, polarity):
    self.uart.write('hspol {} {}\n'.format(0, polarity))


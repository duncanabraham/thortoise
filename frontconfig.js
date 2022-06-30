const servosFrontLeft = { // calibrated
  hipServoSettings: { range: [60, 70], startAt: 65, sleepAt: 65, standAt: 65, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 30, standAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, standAt: 60, controller: 'PCA9685' }
}

const servosFrontRight = { // calibrated
  hipServoSettings: { range: [90, 100], startAt: 95, sleepAt: 95, standAt: 95, controller: 'PCA9685' },
  femurServoSettings: { range: [70, 130], startAt: 130, sleepAt: 70, standAt: 130, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 130], startAt: 130, sleepAt: 130, standAt: 130, controller: 'PCA9685' }
}

const servosBackLeft = {
  hipServoSettings: { range: [90, 100], startAt: 95, sleepAt: 95, standAt: 95, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, standAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, standAt: 60, controller: 'PCA9685' }
}

const servosBackRight = {
  hipServoSettings: { range: [60, 70], startAt: 65, sleepAt: 65, standAt: 65, controller: 'PCA9685' },
  femurServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, standAt: 60, controller: 'PCA9685' },
  kneeServoSettings: { range: [30, 90], startAt: 60, sleepAt: 60, standAt: 60, controller: 'PCA9685' }
}
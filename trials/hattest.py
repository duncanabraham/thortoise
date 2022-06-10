from gsmHat import GSMHat, SMS, GPS
gsm = GSMHat('/dev/serial0', 115200)

Number = 'xxxxxxxxxx'
Message = 'just work now, please'
gsm.SMS_write(Number, Message)

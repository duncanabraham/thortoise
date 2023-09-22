import py_qmc5883l
sensor = py_qmc5883l.QMC5883L()
m = sensor.get_bearing()
print(m)



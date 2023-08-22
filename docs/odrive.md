In [153]: odrv0.clear_errors()

In [154]: odrv0.axis1.requested_state = AXIS_STATE_FULL_CALIBRATION_SEQUENCE

In [155]: odrv0.axis1.requested_state = AXIS_STATE_CLOSED_LOOP_CONTROL

In [156]: odrv0.axis1.controller.input_pos = 10

In [157]: odrv0.axis1.controller.input_pos = 2

In [158]: odrv0.axis1.controller.input_pos = 200

In [159]: odrv0.axis1.controller.input_pos = 180

In [160]: odrv0.axis1.controller.input_pos = 150

In [161]: odrv0.axis1.controller.input_pos = 130

In [162]: odrv0.axis1.controller.input_pos = 110

In [163]: odrv0.axis1.controller.input_pos = 0



Working after these below:

Connected to ODrive v3.6 207A39994D4D (firmware v0.5.6) as odrv0
In [1]: drv0.axis1.controller.config.control_mode
---------------------------------------------------------------------------
NameError                                 Traceback (most recent call last)
Cell In[1], line 1
----> 1 drv0.axis1.controller.config.control_mode

NameError: name 'drv0' is not defined

In [2]: odrv0.axis1.controller.config.control_mode
Out[2]: 3

In [3]: odrv0.axis1.controller.input_pos
Out[3]: 0.0

In [4]: odrv0.axis1.controller.config.control_mode
Out[4]: 3

In [5]: odrv0.axis1.controller.config.control_mode 2
  Cell In[5], line 1
    odrv0.axis1.controller.config.control_mode 2
                                               ^
SyntaxError: invalid syntax


In [6]: odrv0.axis1.controller.config.control_mode=2

In [7]: odrv0.axis1.requested_state = AXIS_STATE_FULL_CALIBRATION_SEQUENCE

In [8]: odrv0.axis1.requested_state = 8

In [9]: odrv0.axis1.controller.input_vel=32

In [10]: odrv0.axis1.controller.input_vel=0

In [11]: odrv0.axis1.controller.input_vel=8

In [12]: odrv0.axis1.controller.input_vel=16

In [13]: odrv0.axis1.controller.input_vel=0

In [14]: 
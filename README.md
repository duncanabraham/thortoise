# Thortoise
## the thinking tortoise

## What?
Simply put, this is a robotics project to animate a 4 legged garden crawler robot.  The goal
is to have a machine that can identify and remove weeds using some AI and also plant grass seed
in the bare patches using the mulched weeds as nutrients.

## Installation
Just clone the repo and npm install .. the usual stuff.

You may have some trouble installing this on a non-Raspberry Pi device, that's just because the raspi-io, i2c-bus and johnny-five libraries may not be supported.
Just remove them from the package.json file before running:

```
npm i
```

After this you need to create your .env file:
```
cp .env-default .env
```
By default the code will use the mock driver which can be used without the physical hardware being connected.


## Hardware
Servo driven quadruped with solar charger.
  * Raspberry Pi Zero 2W with
      - servo driver hat
      - GPS hat
  * 3d printed limbs
  * Lead acid battery
  * Solar cells etc for changing


## Software
Lets buck the trend and not use ROS! How about some custom robot code with a pub/sub (redis) channel
to allow communication between component parts which could be written in different languages
depending on the task at hand ... or maybe just write it all in good ol' JS!


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

If you want to see lots of numbers relating to the servo angles you need to add this to your .env file:

```
VERBOSE=true
```

## Tests
Hard to believe, I know, but there are tests available here:

```
npm test
```

You'll need mocha and chai installed globally:

```
npm i -g mocha chai
```

## Hardware
Servo driven quadruped with solar charger.
  * Raspberry Pi Zero 2W with hats:
      - servo driver
      - GPS/GNSS
      - Sound
      - Canbus
      - Motor driver (not connected yet)

  * 3d printed limbs
  * Lead acid battery
  * Solar cells etc for changing


## Sensors
A number of sensors have been tested and drivers written to allow them to be added into the system, however not all will be used. Given
all the sensors are i2c based there's a common i2c base library which all the sensors extend.

To reuse the sensors outside of this project, you'll need to remove the inheritance from the Feature class:
```
class I2cBase extends Feature { <-- Remove "extends Feature"
  constructor (options = {}, additional = {}) {
    super({ ...featureOptions, ...options }) <-- Remove this line
    
```
A full list of sensors can be found in the readme file in the [lib/i2c folder](lib/i2c/README.md)


## Software
Lets buck the trend and not use ROS! How about some custom robot code with a redis channel
to allow communication between component parts which could be written in different languages
depending on the task at hand ... or maybe just write it all in good ol' JS!

## The basic components
<img width="1163" alt="image" src="https://user-images.githubusercontent.com/5994927/172945143-e23b07fa-e9b9-4fef-9b6f-2a7bd01ad18b.png">

## A still from a video of the leg moving in a circular gait:
<img width="515" alt="image" src="https://user-images.githubusercontent.com/5994927/172945714-073bf0ee-97fe-405b-b94b-da21fb257d87.png">


# Thortoise
## the thinking tortoise

## What?
Simply put, this is a robotics project to animate a ~~4 legged~~ tracked garden crawler robot.  The goal
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

A year later and the legs have gone.  Long story short, the servo's for a walking robot need to be heavy duty which come with a heavy duty price tag.  I decided to switch to a tracked design!

Having tracks means the machine can be heavier and bigger and work is ongoing to 3d print all the structural parts.

As soon as the mechanics of it are constructed I'll get some photos on here and start talking about expectations and features.  Also from an electronics perspective there are some design ideas that will impact the way the code operates.

Watch this space ....

Soooo here we go, I've 3d printed two 64:1 gearboxes using the design from this video: https://www.youtube.com/watch?v=G0DcM60lWSw&t=14s and modified the design to house my motors.  The motors are GARTT ML 5010 300KV with a rated power output of 800W.  The motors were taller than those in the video requiring the black shim you see in the following image, the mounting holes had different spacing and I needed a bigger hole for the cables I'd already soldered 3-way xt60 sockets on and I didn't want to take them off!!


![image](https://github.com/duncanabraham/thortoise/assets/5994927/992981a8-e5ef-4ea4-b507-a534ab9434ef)

The motors are to be connected to an ODrive motor controller which needs feedback from an encoder. After a couple of minutes with a vernier caliper and OPENScad I'd knocked up an encoder mount that would use the motor mount bolts to secure it in place.  I was happy with this approach and even happier when it was all installed and looking awesome.  The encoder is an AS5047P which has a rated CPR of 4096 but requires the Odrive to be configured as 4000. A magnet is glued to the back of the motor shaft.

<img width="453" alt="image" src="https://github.com/duncanabraham/thortoise/assets/5994927/f3414905-def1-4d4e-9745-8a3090ddb5a3">

<img width="463" alt="image" src="https://github.com/duncanabraham/thortoise/assets/5994927/9e342a85-90bd-4868-ba22-eefbd4c4213e">


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

After completion of the main chassis it was time start working on the eletrics.  The motors are high power, as in >30A, so I need to be careful that any switching can handle that sort of current.  To this end I'd bought a 24v 200A relay for the last robot and again was able to reuse this. A low current switch is mounted in the "carry handle" and the wiring routed through the handle to the relay. At present it's a simple case of when the switch is on the Odrive is on but this may change later to allow the "brain" to turn the ODrive off when in power save mode.

<img width="488" alt="image" src="https://github.com/duncanabraham/thortoise/assets/5994927/0437dc84-802f-4529-b27e-56e7f398ec3a">

It looks messy at the moment but there's a lot of baking soda to shake out of the frame when the gluing process has been completed.  The problem with baking soda is it falls through the cracks and I'm considering using hot glue to seal one side of the joints and baking soda and superglue the other.  I've also see a video showing graphite and superglue as an alternative and I may have a look into this to see if the results are better/stronger.

So with the power cables in place, and the ODrive connected to my PC for direct control, I was finally able to get both motors working at the same time.  Here's a still from the video:

<img width="474" alt="image" src="https://github.com/duncanabraham/thortoise/assets/5994927/0d35d6c8-5317-4f6c-968c-5672fca7fc26">

There is a design flaw, which is not entirely of my making, but maybe I should have addressed it.  The gearbox housings are round and I'm going to apply torque to the end, what is going to happen to the gearbox!! My chassis design is a clamshell, so the upper section is a mirror of the lower section and when bolted in place, with some pads on the motors, I can apply a clamping force to the gearbox.  Only time will tell if this is going to be strong enough but in hindsight, when I was modifying the gearbox design I should have added lugs to allow it to be bolted in place ... I may still revisit this.

So here we are, chassis complete, main power control in place, the next step will be to add an enclosure to fit inside the chassis to hold the odrive, pi zero (radxa not raspberry) and power supply. This will provide another level of protection to the important parts should I have water (I have dogs, it could be yellow water) ingress.

I'm also going to reprint the drive cogs as I went with a hexagonal, work like a wrench, approach but again 20:20 hindsight shows that wheels should be round - who knew?

Not round:
<img width="627" alt="image" src="https://github.com/duncanabraham/thortoise/assets/5994927/06bad9c9-41b8-4a39-969d-f14911bf1a5c">

Round:
<img width="637" alt="image" src="https://github.com/duncanabraham/thortoise/assets/5994927/c9952655-4e2f-417e-b483-a84a64de3564">






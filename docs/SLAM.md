# SLAM
## Simultaneous localisation and mapping

So how do we map the world around us into a 2d array that will allow us to:
* discover boundaries
* mark objects of interest
* navigate back to a known position

I think the discovery of boundaries will be a happy accident rather than an established goal.  Thortoise shouldn't set 
off to find the bounds it should just mark them when it finds them.

Our world will be 2d, however, we need to be aware of ground slope and level as this will play a part in navigation
as it will hinder movement in certain directions. Mapping altitude and slope will allow a contour map to be generated 
allowing easiest path planning to be perfomed.

Each element in the world array can contain an map element object.  This can store:
* Slope (from IMU)
* altitude (from GPS)
* actual coordinates (from GPS)
* distance to known features ?
* a photo of the ground at this point (a reference to a photo stored elsewhere)
* an AI analysis of the photo with object recognition
* a list of moveable objects seen at this location
* a list of fixed objects seen at this location


Eventually a complete map of the environment will be formed showing fixed objects, like walls, buildings, trees and 
moveable objects like garden furniture, dog toys and wildlife. The map will also contain a detailed view of the ground 
including plant life, lack of plant life and animal activity. The latter could include worm holes, ant colonies and the
dreaded dog poop.

## The primary objective(s)
1) To erradiate weeds from the lawn
2) To repair the lawn by planting seeds in barren patches
3) To use waste products to enrich the soil, including mulched weed and grass
4) To landscape by filling in divots and dents

## How will it work
We will have data from a number of sources which can all feed into an algorithm to give us an estimated position with 
a high degree of accuracy or reliability.

Sources:
* GPS
* IMU
* Camera(s)



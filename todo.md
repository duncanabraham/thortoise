# TODO

Still lots to do. How is this going to work?

* DONE - get bearing from IMU
* DONE - get location from GPS ??
* DONE - get direction from compass
* DONE - read light levels from sensors
* map location to internal map
* DONE - provide a way to save and load the map to disk
* DONE - provide a way to save and load the map from external server
* add commands to the api controller for:
  - Navigate to North, South, East, West
  - Walk: giving the current bearing and direction command, what coords should I move to
  - Goto: given destination coordinates, work out the next location to walk to. On the next turn, work it out again as the map could have been updated by then

* DONE - provide a list of commands, allow "goto" to enter a set of commands into the list
* let the system determine if a command is complete and we're ready to move on to the next command
* at each location take a picture of the ground (pi cam) and update the map
* Use the AI camera to provide object detection and use this to update the map
* Use the AI camera to determine distance to objects and use this to update the map
* Use a directive engine to determine what to do in the absense of API commands
* Use the sound card to announce what's going on
* Use the UART Hat GPIO to control the LEDs on the head
* DONE - Connect the solar cells to the charge controller
* DONE - needs work - Make a framework to support the solar cells
* DONE - needs more work around charging times - Use the charge monitor to determine charge, charging rate etc


** NOTE: I'm not sure this list is worth maintaining as it was written pre-legs!!

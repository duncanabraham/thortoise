// If the box between the shoulder mounts only holds the battery and the boards are somehow
// fixed on top of the shoulders ... this can be quite minimalist (keep the weight down) but needs to also be 
// structural as it forms the chassis and bears the load of the battery.
//
// Having an open floor allows tool access to bolt the shoulders on as well as reducing weight. No top/lid
// is required as this is all inside the outer dome.
//
// This could be the final design

batteryLength=150;
batteryWidth=50;
batteryHeight=100;

servoPlateLength=110;
servoPlateWidth=65;
servoPlateTopHoles=10;
servoPlateBotHoles=40;

wallThickness=5;

margin = (2 * wallThickness);

boxWidth = batteryWidth + margin;
boxLength = batteryLength + margin+2;
boxHeight = batteryHeight + margin;

midPoint = boxLength / 2;


module batteryBox() {
    difference(){
        union(){
            // base
            translate([0,0,0]) cube([boxLength, boxWidth, wallThickness]);
            
            //walls
            translate([0,0,0]) cube([boxLength, wallThickness, boxHeight]);
            translate([0,boxWidth,0]) cube([boxLength, wallThickness, boxHeight]);
            translate([0,0,0]) cube([wallThickness, boxWidth, boxHeight]);
            translate([boxLength-wallThickness,0,0]) cube([wallThickness, boxWidth, boxHeight]);
            
            
        }
        union(){
            // bottom cut-out
            translate([wallThickness+10,wallThickness+10,-1]) cube([boxLength-20-wallThickness-wallThickness, boxWidth-20-wallThickness, wallThickness+2]);
            
            // bolt holes
            translate([(boxLength/2) - (servoPlateTopHoles/2), -2, 10+56])
                rotate([90,0,180]) cylinder(d=4, h=boxWidth+(wallThickness*2), $fn=180);
            translate([(boxLength/2) + (servoPlateTopHoles/2), -2, 10+56])
                rotate([90,0,180]) cylinder(d=4, h=boxWidth+(wallThickness*2), $fn=180);
            
            translate([(boxLength/2) - (servoPlateBotHoles/2), -2, 10])
                rotate([90,0,180]) cylinder(d=4, h=boxWidth+(wallThickness*2), $fn=180);
            translate([(boxLength/2) + (servoPlateBotHoles/2), -2, 10])
                rotate([90,0,180]) cylinder(d=4, h=boxWidth+(wallThickness*2), $fn=180);
            
            // counter sunk recess for bolt heads
            translate([(boxLength/2) - (servoPlateTopHoles/2), 3, 10+56])
                rotate([90,0,180]) cylinder(d=10, h=boxWidth - 1, $fn=180);
            translate([(boxLength/2) + (servoPlateTopHoles/2), 3, 10+56])
                rotate([90,0,180]) cylinder(d=10, h=boxWidth - 1, $fn=180);
            
            translate([(boxLength/2) - (servoPlateBotHoles/2), 3, 10])
                rotate([90,0,180]) cylinder(d=10, h=boxWidth - 1, $fn=180);
            translate([(boxLength/2) + (servoPlateBotHoles/2), 3, 10])
                rotate([90,0,180]) cylinder(d=10, h=boxWidth - 1, $fn=180);
                
            translate([-5, boxWidth/2+2.5, 30]) rotate([0,90,0]) cylinder(d=40, h=boxLength+10, $fn=180);
            translate([-5, boxWidth/2+2.5, 80]) rotate([0,90,0]) cylinder(d=40, h=boxLength+10, $fn=180);
            translate([-5, boxWidth/2-17.5, 30]) cube([boxLength+10, 40, 50]);
            
            translate([boxLength*0.25, -2, 30]) rotate([90,0,180]) cylinder(d=40, h=boxWidth+10, $fn=180);
            translate([boxLength*0.25, -2, 80]) rotate([90,0,180]) cylinder(d=40, h=boxWidth+10, $fn=180);
            translate([boxLength*0.25-20, -2, 30]) cube([40, boxWidth+10, 50]);
            
            translate([boxLength*0.75, -2, 30]) rotate([90,0,180]) cylinder(d=40, h=boxWidth+10, $fn=180);
            translate([boxLength*0.75, -2, 80]) rotate([90,0,180]) cylinder(d=40, h=boxWidth+10, $fn=180);
            translate([boxLength*0.75-20, -2, 30]) cube([40, boxWidth+10, 50]);
        }
    }
}

module battery(){
    translate([wallThickness+1, wallThickness+3, wallThickness]) 
        color("#d00000")
        cube([batteryLength, batteryWidth, batteryHeight]);
}

module mountPlate() {
    bottom=boxHeight - 10;
    plateWidth=boxWidth-(2*wallThickness);
    plateLength=60+60+boxWidth;
   
    difference() {
        union(){
            translate([boxLength/2, boxWidth/2, bottom]) 
                cylinder(d=boxLength+30, h=wallThickness, $fn=180);
            
            translate([boxLength/2, boxWidth/2, bottom+25]) 
                cylinder(d=boxLength+20, h=wallThickness, $fn=180);
            
            translate([-5, -5, bottom]) 
                cube([boxLength+10, boxWidth+10, wallThickness*2]);
            translate([0, 0, bottom]) cylinder(d=10, h=25, $fn=180); 
            translate([0, boxWidth, bottom]) cylinder(d=10, h=25, $fn=180);
            translate([boxLength, 0, bottom]) cylinder(d=10, h=25, $fn=180); 
            translate([boxLength, boxWidth, bottom]) cylinder(d=10, h=25, $fn=180);
            
        }
        union(){
            translate([0, 0, bottom-1]) 
                cube([boxLength, boxWidth, wallThickness+15]);
            translate([0, 0, bottom+15]) cylinder(d=5, h=25, $fn=180);
            translate([0, boxWidth, bottom+15]) cylinder(d=5, h=25, $fn=180); 
            translate([boxLength, 0, bottom+15]) cylinder(d=5, h=25, $fn=180); 
            translate([boxLength, boxWidth, bottom+15]) cylinder(d=5, h=25, $fn=180);
        }
    }
}

batteryBox();
//battery();
mountPlate();

length = 190;
width = 120;

level2Diameter = 210;

wallThickness = 5;
height = 22.5;
motorWidth = 15;
halfHeight = height /2;

axelBore = 10;
holeDistance = 20;
boreOffset = 12;
fixingOffset = 2.25;
fixingBore = 3;
fixingTop = height-fixingOffset;
reverseFixings = holeDistance + boreOffset;
wireHoleOffset = 40;
wireHoleBoreLength = 25;
wireHoleBoreHeight = 17;
wireHoleBoreHeightStart = (height - wireHoleBoreHeight) / 2;

batteryLength = 151;
batteryWidth = 51;
batteryHeight = 93;

boxHeight = wallThickness + (height * 2);

wheelDiameter = 70;
wheelWidth = 35;

midX=length / 2;
midY=width / 2;

startX = (length - batteryLength) / 2;
startY = (width - batteryWidth) / 2;


module level5() {
    layerHeight =18;
    offsetUp = 25+layerHeight+wallThickness;
    i2cMuxWidth=45;
    i2cMuxLength=81;
    
    lightSensorSpacing=8.5;
    
    powerMonitorWidth=18;
    powerMonitorLength=31.5;
    
    batteryChargerWidth=31.5;
    batteryChargerLength=61.3;
    
    
    difference(){
        union(){
            translate([0,0,boxHeight + wallThickness + offsetUp]) cube([length, width, wallThickness/2]);
            
            translate([(length/2)-80, 5, boxHeight + wallThickness + offsetUp-layerHeight]) 
                cylinder(d=10, h=layerHeight, $fn=90);
            translate([(length/2)-80, width-5, boxHeight + wallThickness + offsetUp-layerHeight]) 
                cylinder(d=10, h=layerHeight, $fn=90);
            translate([(length/2)+80, 5, boxHeight + wallThickness + offsetUp-layerHeight]) 
                cylinder(d=10, h=layerHeight, $fn=90);
            translate([(length/2)+80, width-5, boxHeight + wallThickness + offsetUp-layerHeight]) 
                cylinder(d=10, h=layerHeight, $fn=90);
            translate([(length/2)+30, width-5, boxHeight + wallThickness + offsetUp-layerHeight]) 
                cylinder(d=10, h=layerHeight, $fn=90);
            
            translate([length-80,width-wallThickness,boxHeight + wallThickness + offsetUp - layerHeight]) cube([80, wallThickness, layerHeight]);
            translate([length-wallThickness,width-wallThickness-20,boxHeight + wallThickness + offsetUp - layerHeight]) cube([wallThickness, 20, layerHeight]);
            translate([length-80,width-wallThickness-10,boxHeight + wallThickness + offsetUp - layerHeight]) cube([wallThickness, 10, layerHeight]);
            
        }
        union(){
            fixingHoles();
            
            // i2cMux Mounting
            translate([10, midY-(i2cMuxLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            translate([10, midY+(i2cMuxLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            translate([10+(i2cMuxWidth), midY-(i2cMuxLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            translate([10+(i2cMuxWidth), midY+(i2cMuxLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            
            // lightSensor S
            translate([5, midY-(lightSensorSpacing/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=5, h=50, $fn=90);
            translate([5, midY+(lightSensorSpacing/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=5, h=50, $fn=90);
            
            // lightSensor N
            translate([length-5, midY-(lightSensorSpacing/2), boxHeight + wallThickness + offsetUp-layerHeight]) 
                cylinder(d=5, h=50, $fn=90);
            translate([length-5, midY+(lightSensorSpacing/2), boxHeight + wallThickness + offsetUp-layerHeight])
                cylinder(d=5, h=50, $fn=90);
            
            // lightSensor E
            translate([midX-(lightSensorSpacing/2), 5, boxHeight + wallThickness + offsetUp-layerHeight]) 
                cylinder(d=5, h=50, $fn=90);
            translate([midX+(lightSensorSpacing/2), 5, boxHeight + wallThickness + offsetUp-layerHeight]) 
                cylinder(d=5, h=50, $fn=90);
            
            // lightSensor W
            translate([midX-(lightSensorSpacing/2), width-5, boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=5, h=50, $fn=90);
            translate([midX+(lightSensorSpacing/2), width-5, boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=5, h=50, $fn=90);
            
            // powerMonitor
            translate([length-20, midY-(powerMonitorLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            translate([length-20, midY+(powerMonitorLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            translate([length-20-(powerMonitorWidth), midY-(powerMonitorLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            translate([length-20-(powerMonitorWidth), midY+(powerMonitorLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            
            // batteryCharger
            translate([midX-(batteryChargerWidth/2), midY-(batteryChargerLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            translate([midX+(batteryChargerWidth/2), midY-(batteryChargerLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=2.5, h=50, $fn=90);
            
            translate([midX-(batteryChargerWidth/2), midY+(batteryChargerLength/2), boxHeight + wallThickness + offsetUp-layerHeight]) cube([batteryChargerWidth, 10, 50]);
            
            // Cable Slot 1
            slotWidth = batteryChargerWidth * 2.2;
            translate([59, midY-(slotWidth/2), boxHeight + wallThickness + offsetUp-layerHeight]) cube([12, slotWidth, 100]);
            
            // Cable Slot 2
            translate([length-60, midY-(batteryChargerWidth/2), boxHeight + wallThickness + offsetUp-layerHeight]) cube([10, batteryChargerWidth, 100]);
            
            // GPS Mount
            translate([length-10,20, boxHeight + wallThickness + offsetUp-layerHeight]) cylinder(d=6.4, h=25, $fn=90);
            
            // Switch 
            translate([length-40,width-wallThickness-1,boxHeight + wallThickness + offsetUp - layerHeight + 9]) rotate([0,90,90]) cylinder(d=12, h=10, $fn=90);
        }
    }
}

module level4() {   
    offsetUp = 25;
    difference(){
        union(){
            translate([0,0,boxHeight + wallThickness + offsetUp]) cube([length, width, wallThickness]);
            translate([midX,midY, boxHeight+wallThickness + offsetUp]) cylinder(d=level2Diameter*0.7, h=wallThickness, $fn=90);
            translate([startX - 5, startY - 5, boxHeight + wallThickness+wallThickness+wallThickness]) cube([batteryLength+10, batteryWidth+10, offsetUp-wallThickness]);
        }
        union(){
            translate([5, motorWidth + wallThickness, boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=90);
            translate([5, width - (motorWidth + wallThickness), boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=90);
            translate([length-5, motorWidth + wallThickness, boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=90);
            translate([length-5, width - (motorWidth + wallThickness), boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=90);
            battery();
            fixingHoles();
        }
    }
    cameraBracket();
}

module level3() {   
    offsetUp = 0;
    difference(){
        union(){
            translate([0,0,boxHeight + wallThickness + offsetUp]) cube([length, width, wallThickness]);
            translate([midX,midY, boxHeight+wallThickness + offsetUp]) cylinder(d=level2Diameter*0.9, h=wallThickness, $fn=90);
            translate([startX - 5, startY - 5, boxHeight + wallThickness + offsetUp]) cube([batteryLength+10, batteryWidth+10, 20]);
        }
        union(){
            translate([5, motorWidth + wallThickness, boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=90);
            translate([5, width - (motorWidth + wallThickness), boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=90);
            translate([length-5, motorWidth + wallThickness, boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=90);
            translate([length-5, width - (motorWidth + wallThickness), boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=90);
            battery();
            fixingHoles();
        }
    }
}

module battery() {
    translate([startX, startY, wallThickness]) color([0,0,0]) cube([batteryLength, batteryWidth, batteryHeight]);
}


module level2() {

    difference(){
        union(){
            translate([midX,midY, height+wallThickness]) cylinder(d=level2Diameter, h=wallThickness, $fn=90);
            translate([0,0,wallThickness+height]) cube([length, width, wallThickness]);
        }
        union(){
            fixingHoles();
            battery();
        }
    }
}

module base(){
    difference(){
        union(){    
            translate([midX,midY, 0]) cylinder(d=level2Diameter, h=wallThickness, $fn=90);        
            translate([0,0,0]) cube([length, width, wallThickness]);
            translate([startX - 5, startY - 5, wallThickness]) cube([batteryLength+10, batteryWidth+10, 10]);
            translate([0, motorWidth, 0]) cube([length, wallThickness, height+wallThickness]);
            translate([0, width-motorWidth-wallThickness, 0]) cube([length, wallThickness, height+wallThickness]);
            
            
            translate([5, motorWidth + wallThickness, wallThickness]) cylinder(d=10, h=height, $fn=90);
            translate([5, width - (motorWidth + wallThickness), wallThickness]) cylinder(d=10, h=height, $fn=90);
            translate([length-5, motorWidth + wallThickness, wallThickness]) cylinder(d=10, h=height, $fn=90);
            translate([length-5, width - (motorWidth + wallThickness), wallThickness]) cylinder(d=10, h=height, $fn=90);
            
        }
        union(){
            translate([boreOffset, 0, 0 + wallThickness + halfHeight]) rotate([0,90,90]) cylinder(d=axelBore, h=width, $fn=90);
            translate([boreOffset + holeDistance, 0, 0 + wallThickness + fixingOffset ]) rotate([0,90,90]) cylinder(d=fixingBore, h=width, $fn=90);
            translate([boreOffset + holeDistance, 0, 0 + wallThickness + fixingTop ]) rotate([0,90,90]) cylinder(d=fixingBore, h=width, $fn=90);
            translate([wireHoleOffset, 0, wallThickness + wireHoleBoreHeightStart]) cube([wireHoleBoreLength, width, wireHoleBoreHeight+5]);
            
            translate([length-boreOffset, 0, 0 + wallThickness + halfHeight]) rotate([0,90,90]) cylinder(d=axelBore, h=width, $fn=90);
            translate([length-reverseFixings, 0, 0 + wallThickness + fixingOffset ]) rotate([0,90,90]) cylinder(d=fixingBore, h=width, $fn=90);
            translate([length-reverseFixings, 0, 0 + wallThickness + fixingTop ]) rotate([0,90,90]) cylinder(d=fixingBore, h=width, $fn=90);
            translate([length-wireHoleOffset-wireHoleBoreLength, 0, wallThickness + wireHoleBoreHeightStart]) cube([wireHoleBoreLength, width, wireHoleBoreHeight+5]);
            battery();
            

            
            fixingHoles();
        }
    }
}

module fixingHoles() {
    layerHeight = 120;
    translate([5, (width/2) - 20, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([5, (width/2) + 20, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    
    translate([length-5, (width/2) - 20, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([length-5, (width/2) + 20, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    
    // Side holes
    translate([(length/2)-80, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([(length/2)-80, width-5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([(length/2)+80, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([(length/2)+80, width-5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    
    translate([(length/2)+30, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([(length/2)+30, width-5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([(length/2)-30, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([(length/2)-30, width-5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    
    translate([(length/2)+30, -25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([(length/2)+30, width+25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([(length/2)-30, -25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    translate([(length/2)-30, width+25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
    
    translate([(length/2)+30, 25, -1]) cylinder(d=12, h=layerHeight, $fn=90);
    translate([(length/2)+30, width-25, -1]) cylinder(d=12, h=layerHeight, $fn=90);
    translate([(length/2)-30, 25, -1]) cylinder(d=12, h=layerHeight, $fn=90);
    translate([(length/2)-30, width-25, -1]) cylinder(d=12, h=layerHeight, $fn=90);
    
    translate([5, motorWidth + wallThickness, height-10]) cylinder(d=5, h=boxHeight, $fn=90);
    translate([5, width - (motorWidth + wallThickness), height-10]) cylinder(d=5, h=boxHeight, $fn=90);
    translate([length-5, motorWidth + wallThickness, height-10]) cylinder(d=5, h=boxHeight, $fn=90);
    translate([length-5, width - (motorWidth + wallThickness), height-10]) cylinder(d=5, h=boxHeight, $fn=90);
    
    wheels();

}

module wheels() {
    translate([boreOffset, 0, wallThickness + halfHeight]) rotate([0,90,270]) cylinder(d=wheelDiameter, h=wheelWidth, $fn=90);
    translate([length - boreOffset, 0, wallThickness + halfHeight]) rotate([0,90,270]) cylinder(d=wheelDiameter, h=wheelWidth, $fn=90);
    
    translate([boreOffset, width+wheelWidth, wallThickness + halfHeight]) rotate([0,90,270]) cylinder(d=wheelDiameter, h=wheelWidth, $fn=90);
    translate([length - boreOffset, width+wheelWidth, wallThickness + halfHeight]) rotate([0,90,270]) cylinder(d=wheelDiameter, h=wheelWidth, $fn=90);
}

module temp(){
    difference(){
        union(){
        }
        union(){
        }
    }
}


tolerance=0.4;

camLength=91 + tolerance;
camHeight=28 + tolerance;
camWidth=18.5 + tolerance;
camUsbHoleLength = 30; // 25 to 45
camUsbHoleWidth = 12; // 3 to 15

camBoxWallThickness = 3;
twoWalls = camBoxWallThickness * 2;

camBoxLength = camLength + twoWalls;
camBoxWidth = camWidth + camBoxWallThickness;
camBoxHeight = camHeight + twoWalls;

module camera() {
    difference() {
        union(){
            translate([0,0,0]) cube([camLength, camWidth, camHeight]);
        }
        union(){
        }
    }
}

module cameraHolder() {
    difference() {
        union(){
            translate([0,0,0]) cube([camBoxLength, camBoxWidth, camBoxHeight]);
            translate([-10,camBoxWidth - camBoxWallThickness, 0]) cube([10, camBoxWallThickness, camBoxHeight]);
            translate([-10,camBoxWidth - camBoxWallThickness, camBoxHeight / 2]) rotate([90,0,180]) cylinder(d=camBoxHeight, h=camBoxWallThickness, $fn=90);            
            
            translate([camBoxLength,camBoxWidth - camBoxWallThickness, 0]) cube([10, camBoxWallThickness, camBoxHeight]);
            translate([camBoxLength+10,camBoxWidth - camBoxWallThickness, camBoxHeight / 2]) rotate([90,0,180]) cylinder(d=camBoxHeight, h=camBoxWallThickness, $fn=90);
         
        }
        union(){
            translate([camBoxWallThickness, camBoxWallThickness+0.1, camBoxWallThickness]) camera();
            
//            translate([twoWalls*2, twoWalls, -1]) cube([camLength - (twoWalls * 3), camWidth, 5]);
            
            translate([20, 3, -1]) cube([camUsbHoleLength, camUsbHoleWidth, 5]);
            
            translate([twoWalls, -1,twoWalls]) cube([camLength - twoWalls, camWidth*2, camHeight - twoWalls]);
            translate([-10,camBoxWidth - camBoxWallThickness-1, camBoxHeight / 2]) rotate([90,0,180]) cylinder(d=5, h=camBoxWallThickness+2, $fn=90); 
            translate([camBoxLength+10,camBoxWidth - camBoxWallThickness-1, camBoxHeight / 2]) rotate([90,0,180]) cylinder(d=5, h=wallThickness+2, $fn=90);
            
            
        }
    }
}

module cameraBracket() {
    offsetUp=25;
    difference(){
        union(){
            translate([length, -17, boxHeight + wallThickness + offsetUp - (camBoxHeight-5) + wallThickness]) cube([wallThickness, width+31, camBoxHeight-5]);
            translate([length, 0, boxHeight + wallThickness + offsetUp])
              rotate([0,90,90])
              cylinder(r=wallThickness, h=wallThickness, $fn=90);
            translate([length, width-wallThickness, boxHeight + wallThickness + offsetUp])
              rotate([0,90,90])
              cylinder(r=wallThickness, h=wallThickness, $fn=90);
            translate([length, (width/2)-(wallThickness/2), boxHeight + wallThickness + offsetUp])
              rotate([0,90,90])
              cylinder(r=wallThickness, h=wallThickness, $fn=90);
            
        }
        union(){
            translate([length-1, 0, height+wallThickness +17.4+height]) rotate([0,90,0]) cylinder(d=6, h=wallThickness+2, $fn=90);
            translate([length-1, width-2.5, height+wallThickness +17.4+height]) rotate([0,90,0]) cylinder(d=6, h=wallThickness+2, $fn=90);
            fixingHoles();
            battery();
        }
    }
}


//base();
//level2();
//level3();
//level4();
//level5();
//battery();
wheels();

//translate([length+30,10,height+wallThickness + 23]) rotate([0,0,90]) color([0,1,0]) cameraHolder();

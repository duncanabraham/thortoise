height = 14;
radius = 95 / 2;
notchDiameter = 18;

bearingBore=7;
bearingSeat=4;
bearingFlange=1;
bearingOd=16;
bearingFlangeHeight=18;

steps=8;

motorSteps=4;
motorRadius=6;
motorMountBore=3.2;

innerRadius=71 / 2;
weightHoleDiameter = innerRadius * 0.4;
shoulderWidth=9;


module driveCog() {
    difference() {
        union(){
            translate([0,0,shoulderWidth]) cylinder(r=radius, h=height, $fn=90);
            translate([0,0,0]) cylinder(r=innerRadius, h=height+(shoulderWidth*2), $fn=90);
        }
        union(){
            translate([0,0,-1]) cylinder(d=bearingOd, h=2+bearingSeat, $fn=90);
            translate([0,0,-1]) cylinder(d=bearingBore, h=2+height+20, $fn=90);
            translate([0,0,-1]) cylinder(d=bearingFlangeHeight, h=1+bearingFlange, $fn=90);
            
            // Teeth
            for(i=[0:steps-1]){
                x=(radius) * sin((360/steps) * i);
                y=(radius) * cos((360/steps) * i);
                translate([x, y, shoulderWidth-1]) cylinder(d=notchDiameter, h=height+2, $fn=90);
            }
            
            // Motor mount holes
            for(j=[0:motorSteps-1]){
                x=(motorRadius) * sin((360/motorSteps) * j);
                y=(motorRadius) * cos((360/motorSteps) * j);
                translate([x, y, -1]) cylinder(d=motorMountBore, h=height+22, $fn=90);
                translate([x, y, 8-height]) cylinder(d=motorMountBore+2.5, h=height+12, $fn=90);
            }
            
            // weight reducing holes
            weightHoles=8;
            for(j=[0:weightHoles-1]){
                x=(innerRadius * 0.6) * sin((360/weightHoles) * j);
                y=(innerRadius * 0.6) * cos((360/weightHoles) * j);
                translate([x, y, -1]) cylinder(d=weightHoleDiameter, h=height+22, $fn=90);
            }
        }
    }
}


module cog() {
    difference() {
        union(){
            translate([0,0,shoulderWidth]) cylinder(r=radius, h=height, $fn=90);
            translate([0,0,0]) cylinder(r=innerRadius, h=height+(shoulderWidth*2), $fn=90);
        }
        union(){
            translate([0,0,-1]) cylinder(d=bearingBore, h=2+height+20, $fn=90);
            
            translate([0,0,-1]) cylinder(d=bearingOd, h=2+bearingSeat, $fn=90);
            translate([0,0,-1]) cylinder(d=bearingFlangeHeight, h=1+bearingFlange, $fn=90);
            
            translate([0,0,height+(shoulderWidth*2)-bearingSeat-1]) cylinder(d=bearingOd, h=2+bearingSeat, $fn=90);
            translate([0,0,height+(shoulderWidth*2)-1]) cylinder(d=bearingFlangeHeight, h=2+bearingFlange, $fn=90);
            
            // Teeth
            for(i=[0:steps-1]){
                x=(radius) * sin((360/steps) * i);
                y=(radius) * cos((360/steps) * i);
                translate([x, y, shoulderWidth-1]) cylinder(d=notchDiameter, h=height+2, $fn=90);
            }
           
            
            // weight reducing holes
            weightHoles=8;
            for(j=[0:weightHoles-1]){
                x=(innerRadius * 0.6) * sin((360/weightHoles) * j);
                y=(innerRadius * 0.6) * cos((360/weightHoles) * j);
                translate([x, y, -1]) cylinder(d=weightHoleDiameter, h=height+22, $fn=90);
            }
        }
    }
}


module bearing(p) {
    difference(){
        union(){
            translate([0,0,p]) color([1,0,0]) cylinder(d=bearingOd, h=bearingSeat+bearingFlange, $fn=90);
            translate([0,0,p]) color([1,0,0]) cylinder(d=bearingFlangeHeight, h=bearingFlange, $fn=90);
        }
        union(){
            translate([0,0,p-1]) cylinder(d=bearingBore, h=100, $fn=90);
        }
    }
}

plateLength=220;

module wheelPlate() {
    offset=-6;
    width=40;
    difference(){
        union(){
            translate([0,0,offset]) cylinder(d=width, h=5, $fn=90);
            translate([0,-width/2,offset]) cube([plateLength, width, 5]);
            translate([0,0,offset]) cylinder(d=width,h=5, $fn=90);
            
            translate([plateLength,0,offset]) cylinder(d=width,h=5, $fn=90);
            
            translate([radius+10,-(width/2), offset]) cube([12, width, 40]);
            translate([plateLength-radius-10-12,-(width/2), offset]) cube([12, width, 40]);
        }
        union(){
            translate([0,0,offset-1]) cylinder(d=5,h=7, $fn=90);
            translate([plateLength,0,offset-1]) cylinder(d=5,h=7, $fn=90);
            
            translate([radius+10+6,-10, offset-1]) cylinder(d=5, h=50, $fn=90); 
            translate([radius+10+6,10, offset-1]) cylinder(d=5, h=50, $fn=90);
            
            translate([plateLength-radius-10+6-12,-10, offset-1]) cylinder(d=5, h=50, $fn=90); 
            translate([plateLength-radius-10+6-12,10, offset-1]) cylinder(d=5, h=50, $fn=90);
        }
    }
}

module mockPlate(){
    offset=35;
    width=75;
    actualWidth=60;
    motorRadius=25/2;
    difference(){
        union(){
            translate([plateLength,0,offset]) cylinder(d=width, h=5, $fn=90);
            translate([0,-width/2,offset]) cube([plateLength, actualWidth, 5]);
            translate([0,-width/2,offset]) cube([plateLength, 5, width]);
            
            translate([0,0,offset]) cylinder(d=width,h=5, $fn=90);
            translate([0,0,offset]) cylinder(d=72, h=27.3, $fn=90);
            translate([0,0,offset+27.3]) cylinder(d=72, h=3, $fn=90);
            
            // Motor mount holes
            for(j=[0:motorSteps-1]){
                x=(motorRadius) * sin((360/motorSteps) * j);
                y=(motorRadius) * cos((360/motorSteps) * j);
                translate([x, y, offset]) cylinder(d=motorMountBore+3, h=height, $fn=90);
            }
        }
        union(){
            translate([0,0,offset-1]) cylinder(d=5,h=7, $fn=90);
            translate([plateLength,0,offset-1]) cylinder(d=5, h=7, $fn=90);
            
            translate([radius+10+6,-10, offset-1]) cylinder(d=5, h=50, $fn=90); 
            translate([radius+10+6,10, offset-1]) cylinder(d=5, h=50, $fn=90);
            
            translate([plateLength-radius-10+6-12,-10, offset-1]) cylinder(d=5, h=50, $fn=90); 
            translate([plateLength-radius-10+6-12,10, offset-1]) cylinder(d=5, h=50, $fn=90);
            motor();
            
            translate([0,0,offset-1]) cylinder(d=8,h=70, $fn=90);
            
            translate([15,15,offset-1]) cylinder(d=12,h=70, $fn=90);
            
            
            // Motor mount holes
            for(j=[0:motorSteps-1]){
                x=(motorRadius) * sin((360/motorSteps) * j);
                y=(motorRadius) * cos((360/motorSteps) * j);
                translate([x, y, offset-1]) cylinder(d=motorMountBore, h=height+22, $fn=90);
            }
            
            translate([-80,-30,offset-1]) cube([60,60,60]);
            
            fixingHoles();
        }
    }
}

module motor(){
    offset=34;
    translate([0,0,offset]) cylinder(d=63, h=27.3, $fn=90);
    translate([0,0,offset+20]) cylinder(d=27, h=7.3, $fn=90);
}

module fixingHoles() {
    length = 190;
    width = 120;
    layerHeight = 120;
    translate([15,0,73]) rotate([90, 0, 0]) union(){
        // Side holes
        translate([(length/2)-80, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        translate([(length/2)+80, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        
        translate([(length/2)+30, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        translate([(length/2)-30, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        
        translate([(length/2)+30, -25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        translate([(length/2)-30, -25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        
        translate([(length/2)+30, 25, -1]) cylinder(d=12, h=layerHeight, $fn=90);
        translate([(length/2)-30, 25, -1]) cylinder(d=12, h=layerHeight, $fn=90);
    }
}


//driveCog();
//translate([plateLength,0,0]) cog();
//bearing(0);

//wheelPlate();

mockPlate();

//motor();



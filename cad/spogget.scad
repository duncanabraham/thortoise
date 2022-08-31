height = 12;
radius = 95 / 2;
notchDiameter = 18;

bearingBore=6;
bearingSeat=7;
bearingFlange=1;
bearingOd=16;
bearingFlangeHeight=20;

steps=8;

motorSteps=4;
motorRadius=6;
motorMountBore=3.2;

innerRadius=71 / 2;
weightHoleDiameter = innerRadius * 0.3;
shoulderWidth=10;

module cogDrivePart1() {
    difference() {
        union(){
            translate([0,0,shoulderWidth]) cylinder(r=radius, h=height, $fn=90);
            translate([0,0,height]) cylinder(r=innerRadius+2, h=height+shoulderWidth, $fn=8);
        }
        union(){
            translate([0,0,height-3]) cylinder(r=innerRadius-5, h=10, $fn=8);
            
            translate([0,0,-1]) cylinder(d=bearingBore, h=height*3, $fn=90);
            
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
                translate([x, y, -1]) cylinder(d=motorMountBore, h=height*3, $fn=90);
                translate([x, y, -1]) cylinder(d=motorMountBore+3, h=height+12, $fn=90);
            }
            
            // weight reducing holes
            weightHoles=8;
            for(j=[0:weightHoles-1]){
                x=(innerRadius * 0.65) * sin((360/weightHoles) * j);
                y=(innerRadius * 0.65) * cos((360/weightHoles) * j);
                translate([x, y, -1]) cylinder(d=weightHoleDiameter, h=height*3, $fn=90);
            }
            
        }
    }
}

module cogDrivePart2() {
    translate([0,0,-30])
    difference() {
        union(){
            translate([0,0,18-shoulderWidth]) cylinder(r=innerRadius-5, h=10, $fn=8);
            translate([0,0,0]) cylinder(r=innerRadius+2, h=shoulderWidth, $fn=8);
        }
        union(){
            translate([0,0,-1]) cylinder(d=bearingOd, h=2+bearingSeat, $fn=90);
            translate([0,0,-1]) cylinder(d=bearingBore, h=2+height+20, $fn=90);
            translate([0,0,-1]) cylinder(d=bearingFlangeHeight, h=1+bearingFlange, $fn=90);
            
            translate([0,0,14])  cylinder(d=25, h=5, $fn=90);
            
            // weight reducing holes
            weightHoles=8;
            for(j=[0:weightHoles-1]){
                x=(innerRadius * 0.65) * sin((360/weightHoles) * j);
                y=(innerRadius * 0.65) * cos((360/weightHoles) * j);
                translate([x, y, -1]) cylinder(d=weightHoleDiameter, h=height*3, $fn=90);
            }
        }
    }
}

module driveCog() {
    cogDrivePart1();
    cogDrivePart2();
}

module oldDriveCog() {
    difference() {
        union(){
            translate([0,0,shoulderWidth]) cylinder(r=radius, h=height, $fn=90);
//            translate([0,0,0]) cylinder(r=innerRadius, h=height+(shoulderWidth*2), $fn=90);
            translate([0,0,0]) cylinder(r=innerRadius+2, h=height+(shoulderWidth*2), $fn=8);
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
                translate([x, y, 12-height]) cylinder(d=motorMountBore+2.5, h=height+12, $fn=90);
            }
            
            // weight reducing holes
            weightHoles=8;
            for(j=[0:weightHoles-1]){
                x=(innerRadius * 0.7) * sin((360/weightHoles) * j);
                y=(innerRadius * 0.7) * cos((360/weightHoles) * j);
                translate([x, y, -1]) cylinder(d=weightHoleDiameter, h=height+22, $fn=90);
            }
        }
    }
}



module cogPart1() {
    difference(){
        union(){
            translate([0,0,shoulderWidth]) cylinder(r=radius, h=height, $fn=90);
            translate([0,0,shoulderWidth]) rotate([0,0,0]) cylinder(r=innerRadius, h=height+shoulderWidth, $fn=90);
            
        }
        union(){
            translate([0,0,-1]) cylinder(d=bearingBore, h=2+height+20, $fn=90);
            translate([0,0,height-3]) cylinder(r=innerRadius-5, h=10, $fn=8);
            
            translate([0,0,shoulderWidth+height+2]) cylinder(d=bearingBore, h=2+height+20, $fn=90);
            translate([0,0,shoulderWidth+height+2]) cylinder(d=bearingOd, h=2+bearingSeat, $fn=90);
            translate([0,0,shoulderWidth+height+8.1]) cylinder(d=bearingFlangeHeight, h=1+bearingFlange, $fn=90);
            
            // Teeth
            for(i=[0:steps-1]){
                x=(radius) * sin((360/steps) * i);
                y=(radius) * cos((360/steps) * i);
                translate([x, y, shoulderWidth-1]) cylinder(d=notchDiameter, h=height+2, $fn=90);
            }
            
            // weight reducing holes
            weightHoles=8;
            for(j=[0:weightHoles-1]){
                x=(innerRadius * 0.65) * sin((360/weightHoles) * j);
                y=(innerRadius * 0.65) * cos((360/weightHoles) * j);
                translate([x, y, -1]) cylinder(d=weightHoleDiameter, h=height+22, $fn=90);
            }
        }
    }
}

module cogPart2() {
    translate([0,0,-30])
    difference(){
        union(){
            translate([0,0,18-shoulderWidth]) cylinder(r=innerRadius-5, h=10, $fn=8);
            translate([0,0,0]) rotate([0,0,0]) cylinder(r=innerRadius, h=shoulderWidth, $fn=90);
        }
        union(){
            translate([0,0,-1]) cylinder(d=bearingBore, h=2+height+20, $fn=90);
            // weight reducing holes
            weightHoles=8;
            for(j=[0:weightHoles-1]){
                x=(innerRadius * 0.65) * sin((360/weightHoles) * j);
                y=(innerRadius * 0.65) * cos((360/weightHoles) * j);
                translate([x, y, -1]) cylinder(d=weightHoleDiameter, h=height+22, $fn=90);
            }
            translate([0,0,-1]) cylinder(d=bearingOd, h=2+bearingSeat, $fn=90);
            translate([0,0,-1]) cylinder(d=bearingFlangeHeight, h=2+bearingFlange, $fn=90);
        }
    }
}

module cog() {
    cogPart1();
    cogPart2();
}

module oldCog() {
    difference() {
        union(){
            translate([0,0,shoulderWidth]) cylinder(r=radius, h=height, $fn=90);
            translate([0,0,0]) rotate([0,0,0]) cylinder(r=innerRadius, h=height+(shoulderWidth*2), $fn=90);
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
                x=(innerRadius * 0.7) * sin((360/weightHoles) * j);
                y=(innerRadius * 0.7) * cos((360/weightHoles) * j);
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
    plateWidth=50;
    difference(){
        union(){
            translate([0,0,offset]) cylinder(d=plateWidth, h=5, $fn=90);
            translate([0,-plateWidth/2,offset]) cube([plateLength, plateWidth, 5]);
            translate([0,0,offset]) cylinder(d=width,h=5, $fn=90);
            
            translate([plateLength,0,offset]) cylinder(d=plateWidth,h=5, $fn=90);
            
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
            
            fixingHoles();
            
            translate([plateLength-20,-width/2-30,offset-1]) cube([width*2,180,width+20]);
            translate([0,0,offset+2]) cylinder(d=9, h=4.1, $fn=6);
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
            translate([plateLength,-7.5,offset]) cylinder(d=actualWidth, h=5, $fn=90);
            translate([0,-width/2,offset]) cube([plateLength, actualWidth, 5]);
            translate([0,-width/2,offset]) cube([plateLength, 5, width]);
            
//            translate([0,0,offset]) cylinder(d=width,h=5, $fn=90);
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
            
            // chop the end off to make it fit on the printer plate
            translate([plateLength-20,-width/2-3,offset-1]) cube([width,180,width+2]);
            
            fixingHoles();
        }
    }
}

module motor(){
    offset=34;
    motorDiameter=59;    
    translate([0,0,offset]) cylinder(d=motorDiameter+4, h=27.3, $fn=90);
    translate([0,0,offset+20]) cylinder(d=27, h=7.3, $fn=90);
}

module fixingHoles() {
    length = 190;
    width = 120;
    layerHeight = 120;
    offset=35;
    translate([15,0,73]) rotate([90, 0, 0]) union(){
        // Side holes
        translate([(length/2)-80, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        
        translate([(length/2)+80, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);        
        translate([(length/2)+80, 25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        translate([(length/2)+80, -15, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        translate([(length/2)+60, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);        
        translate([(length/2)+60, 25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        translate([(length/2)+60, -15, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        
        
        translate([155.5, 2.5, offset-10]) cube([20,5,20]);
        translate([155.5, 22.5, offset-10]) cube([20,5,20]);
        translate([155.5, -17.5, offset-10]) cube([20,5,20]);
        
        translate([(length/2)+60, 15, offset-17.5]) rotate([90,0,0]) cylinder(d=5, h=200, $fn=90);
        translate([155.5, -17.5, offset-20]) rotate([90,0,0]) cube([20,5,300]);
        translate([(length/2)+80, 15, offset-17.5]) rotate([90,0,0]) cylinder(d=5, h=200, $fn=90);
        
        translate([(length/2)+60, 15, offset-37.5]) rotate([90,0,0]) cylinder(d=5, h=200, $fn=90);
        translate([155.5, -17.5, offset-40]) rotate([90,0,0]) cube([20,5,300]);
        translate([(length/2)+80, 15, offset-37.5]) rotate([90,0,0]) cylinder(d=5, h=200, $fn=90);

        
        translate([(length/2)+30, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        translate([(length/2)-30, 5, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        
        translate([(length/2)+30, -25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        translate([(length/2)-30, -25, -1]) cylinder(d=5, h=layerHeight, $fn=90);
        
        translate([(length/2)+30, 25, -1]) cylinder(d=12, h=layerHeight, $fn=90);
        translate([(length/2)-30, 25, -1]) cylinder(d=12, h=layerHeight, $fn=90);
        
        
    }
}

module nose() {
    width=50;
    length=70;
    difference() {
        union(){
            translate([160,-(width/2)-2,-10]) cube([length,width,5]);
            translate([195+(length/2),-2,-10]) cylinder(d=width, h=5, $fn=90);
        }
        union(){
            fixingHoles();
            translate([195+(length/2),-2,-11]) cylinder(d=5, h=7, $fn=90);
        }
    }
}

module nase() {
    width=50;
    length=70;
    difference() {
        union(){
            translate([160,-(width/2)-2,40]) cube([length,width,5]);
            translate([160,-(width/2)-7,40]) cube([width,width,5]);
            
            translate([160,-(width/2)-2,40]) rotate([90,0,0]) cube([width,length,5]);
            translate([160,-(width/2)-2,40]) rotate([90,0,90]) cube([5,length,5]);
            translate([160,-(width/2)-2,40]) rotate([90,0,90]) cube([width,10,5]);
            
            translate([195+(length/2),-2,40]) cylinder(d=width, h=5, $fn=90);
            translate([195+(length/2),-2,35]) cylinder(d=30, h=7, $fn=90);
        }
        union(){
            fixingHoles();
            translate([195+(length/2),-2,34]) cylinder(d=9, h=4.1, $fn=6);
            translate([195+(length/2),-2,-59]) cylinder(d=5, h=120, $fn=90);
        }
    }
}


//driveCog();
translate([plateLength,0,0]) oldCog();
oldDriveCog();
nose();
nase();



//translate([plateLength*0.75,-90,0]) cog();

wheelPlate();
mockPlate();

translate([0,0,250]) mirror([0,0, 1]) wheelPlate();
translate([0,0,250]) mirror([0,0,1]) mockPlate();
translate([0,0,250]) mirror([0,0,1]) oldDriveCog();
translate([0,0,250]) mirror([0,0,1]) translate([plateLength,0,0]) oldCog();
translate([0,0,250]) mirror([0,0,1]) nose();
translate([0,0,250]) mirror([0,0,1]) nase();


//motor();
//bearing(0);



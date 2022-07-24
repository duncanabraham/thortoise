boardWidth = 50;
boardLength = 86;
boardThickness = 2;
rpiWidth = 30;
rpiLength = 67;
boxWidth = 80;
boxHeight = 70;
wallThickness = 3;
servoBracketHeight = 50;

servoPlateLength=110;
servoPlateWidth=65;
servoPlateTopHoles=10;
servoPlateBotHoles=40;

// How many steps in a circle
circSteps = 30;
walls=(wallThickness * 2);
// Hole sizes
boltHole=4;
insertHole=5.2;
sinkWidth=8;
sinkDepth = wallThickness*0.25;
ledBezel=7.8;

boxLength = boardLength + (wallThickness * 2) + 4;

// Centre point
midx = boxLength / 2;
midy = boxWidth / 2;



module boxBase() {
    difference() {
        union(){
            translate([0,0,0]) cube([boxLength, boxWidth, wallThickness]);
            translate([wallThickness, wallThickness+25,0]) cube([boxLength-(wallThickness*2), 15,5]);
            
            // pi mounts
            translate([12 + wallThickness, (boxWidth / 2)-12,wallThickness]) cube([6, 13, 6]);
            translate([12 + wallThickness+rpiLength-6, (boxWidth / 2)-12,wallThickness]) cube([6, 13, 6]);
            
            // pcb mounts
            translate([wallThickness, wallThickness+25,wallThickness]) cube([6,27,6]);
            translate([wallThickness, wallThickness+37,wallThickness]) cube([3.5,8,boardWidth-1]);
            translate([wallThickness, wallThickness+25,wallThickness]) cube([12,13,6]);
           
            
            translate([wallThickness+boardLength-2, wallThickness+25,wallThickness]) cube([6,27,6]);
            
            translate([wallThickness+boardLength+0.5, wallThickness+37,wallThickness]) cube([3.5,8,boardWidth-1]);
            
            translate([wallThickness+boardLength-2-10, wallThickness+25,wallThickness]) cube([12,13,6]);
            
        }
        union(){
            translate([2 + wallThickness, (boxWidth / 2) + 5,wallThickness]) rotate([90,0,0]) pcb();
            translate([12 + wallThickness, (boxWidth / 2) - 5,wallThickness]) rotate([90,0,0]) rpi();
            translate([12 + wallThickness+6, (boxWidth / 2) - 15.1,wallThickness/2]) cube([rpiLength-12, 10.1, 4]);
            
            
            translate([wallThickness+3.25, wallThickness+25-1,wallThickness+2.25]) rotate([0,90,90]) cylinder(d=2, h=30, $fn=180);
            translate([wallThickness+boardLength-2+2.75, wallThickness+25-1,wallThickness+2.25]) rotate([0,90,90]) cylinder(d=2, h=30, $fn=180);
            
            translate([12 + wallThickness+3.5, (boxWidth / 2)-12-1,wallThickness+3.5+1]) rotate([0,90,90]) cylinder(d=2, h=20, $fn=180);
            translate([12 + wallThickness+rpiLength-3.5, (boxWidth / 2)-12-1,wallThickness+3.5+1]) rotate([0,90,90]) cylinder(d=2, h=20, $fn=180);
            
            
            for(i = [0:9]){
                translate([12 + wallThickness+6+(i*5.9), (boxWidth / 2) - 25,-1]) cube([2, 20, wallThickness+2]);
                translate([12 + wallThickness+6+(i*5.9), (boxWidth / 2)+6,-1]) cube([2, 20, wallThickness+2]);
            }
        }
    }
}

module outerBox() {
    difference() {
        union(){
            translate([0,0,0]) cube([boxLength, wallThickness, boxHeight]);
            translate([0,0,0]) cube([wallThickness, boxWidth, boxHeight]);
            translate([boxLength-wallThickness, 0, 0])  cube([wallThickness, boxWidth, boxHeight]);
            translate([0,boxWidth-wallThickness,0]) cube([boxLength, wallThickness, boxHeight]);
            
            // Corner pillars
            translate([4,4,0]) cylinder(d=8, h=boxHeight, $fn=180);
            translate([4,boxWidth-4,0]) cylinder(d=8, h=boxHeight, $fn=180);          
            translate([boxLength-4,4,0]) cylinder(d=8, h=boxHeight, $fn=180);
            translate([boxLength-4,boxWidth-4,0]) cylinder(d=8, h=boxHeight, $fn=180);
            
        }
        union(){
            // Corner boltholes
            translate([4,4,boxHeight-16]) cylinder(d=4.5, h=17, $fn=180);
            translate([4,boxWidth-4,boxHeight-16]) cylinder(d=4.5, h=17, $fn=180);          
            translate([boxLength-4,4,boxHeight-16]) cylinder(d=4.5, h=17, $fn=180);
            translate([boxLength-4,boxWidth-4,boxHeight-16]) cylinder(d=4.5, h=17, $fn=180);
            
            // Holes for servo wires
            for(i = [0:3]){
                translate([14 + wallThickness + (14*i), -1, rpiWidth+wallThickness-10]) cube([12, wallThickness+2, 8]);
            }
            translate([14 + wallThickness + 65, -1, rpiWidth+wallThickness-7]) rotate([0,90,90]) cylinder(d=6, h=wallThickness+2, $fn=180);
            
            
            // Holes for sensors
            for(i = [1:8]){
                translate([boxLength - 10 + wallThickness - (8*i), boxWidth-1-wallThickness, boardWidth+wallThickness-12]) cube([6, wallThickness+2, 12]);
            }
            
            // holes for shoulder mounts
            translate([-1,(boxWidth/2)+(servoPlateTopHoles/2), boxHeight-5]) rotate([90,0,90]) cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([-1,(boxWidth/2)-(servoPlateTopHoles/2), boxHeight-5]) rotate([90,0,90]) cylinder(d=3,h=wallThickness+2, $fn=180);
            
            translate([-1,(boxWidth/2)+(servoPlateBotHoles/2), boxHeight-60]) rotate([90,0,90]) cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([-1,(boxWidth/2)-(servoPlateBotHoles/2), boxHeight-60]) rotate([90,0,90]) cylinder(d=3,h=wallThickness+2, $fn=180);
            
            translate([boxLength-1-wallThickness,(boxWidth/2)+(servoPlateTopHoles/2), boxHeight-5]) rotate([90,0,90]) cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([boxLength-1-wallThickness,(boxWidth/2)-(servoPlateTopHoles/2), boxHeight-5]) rotate([90,0,90]) cylinder(d=3,h=wallThickness+2, $fn=180);
            
            translate([boxLength-1-wallThickness,(boxWidth/2)+(servoPlateBotHoles/2), boxHeight-60]) rotate([90,0,90]) cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([boxLength-1-wallThickness,(boxWidth/2)-(servoPlateBotHoles/2), boxHeight-60]) rotate([90,0,90]) cylinder(d=3,h=wallThickness+2, $fn=180);
            
        }
    }
}


module topLid() {
    posZ=boxHeight+5;
    difference() {
        union(){
            translate([0,0,posZ]) cube([boxLength, boxWidth, wallThickness]);
        }
        union(){
            // Corner boltholes
            translate([4,4,posZ-1]) cylinder(d=4, h=17, $fn=180);
            translate([4,boxWidth-4,posZ-1]) cylinder(d=4, h=17, $fn=180);          
            translate([boxLength-4,4,posZ-1]) cylinder(d=4, h=17, $fn=180);
            translate([boxLength-4,boxWidth-4,posZ-1]) cylinder(d=4, h=17, $fn=180);
            // LEDs
            for(led=[0:5]){
                translate([19+wallThickness+((ledBezel+2.8)*led), boxWidth/2, posZ-1]) cylinder(d=ledBezel, h=wallThickness+2, $fn=180);
            }
            
            // vents
            for(i = [0:9]){
                translate([12 + wallThickness+6+(i*5.9), (boxWidth / 2) - 25,posZ-1]) cube([2, 20, wallThickness+2]);
                translate([12 + wallThickness+6+(i*5.9), (boxWidth / 2)+6,posZ-1]) cube([2, 20, wallThickness+2]);
            }
        }
    }
}

module basePlate() {
    difference()
    {
        length=155;
        width=110;
        height=5;
        union()
        {
            translate([0,0,0]) cube([length, width, height]);
        }
        union()
        {
            translate([23,3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);        
            translate([23+19,3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
            
            translate([23,width-3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
            translate([23+19,width-3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
            
            
            translate([length-23,3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);        
            translate([length-(23+19),3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
            
            translate([length-23,width-3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
            translate([length-(23+19),width-3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
            startx = (155-boxLength) / 2;
            starty = (110-boxWidth) / 2;
            translate([startx, starty,-1]) cube([boxLength, boxWidth, height + 2]);
        }
    }
}

module pcb() {
    difference() {
        union(){
            color("#8080dd") cube([boardLength, boardWidth, boardThickness]);
        }
        union(){
            translate([1.27,1.27,-1]) cylinder(d=2, h=boardThickness+2, $fn=180); 
            translate([boardLength-1.27,1.27,-1]) cylinder(d=2, h=boardThickness+2, $fn=180);
            
            translate([1.27,boardWidth-1.27,-1]) cylinder(d=2, h=boardThickness+2, $fn=180); 
            translate([boardLength-1.27,boardWidth-1.27,-1]) cylinder(d=2, h=boardThickness+2, $fn=180);
        }
    }
    
}

module rpi() {
    difference(){
        union(){
            color("#dd8080") cube([rpiLength, rpiWidth, boardThickness]);
        }
        union(){
            translate([3.5, 3.5, -1]) cylinder(d=2, h=boardThickness+2, $fn=180);
            translate([rpiLength - 3.5, 3.5, -1]) cylinder(d=2, h=boardThickness+2, $fn=180);
        }
    }
    
}

boxBase();
outerBox();
//topLid();

//translate([2 + wallThickness, (boxWidth / 2) + 5,4]) rotate([90,0,0]) pcb();
//translate([12 + wallThickness, (boxWidth / 2) - 5,4]) rotate([90,0,0]) rpi();
//translate([12 + wallThickness, (boxWidth / 2) - 18,4]) rotate([90,0,0]) rpi();

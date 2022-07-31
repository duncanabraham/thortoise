

boardWidth = 50;
boardLength = 86;
boardThickness = 2;
rpiWidth = 30;
rpiLength = 67;
wallThickness = 3;
servoBracketHeight = 50;

boxWidth = 104 + (2 * wallThickness);
boxHeight = 70+30;
boxLength = 50 + (2 * wallThickness) + 2;

servoPlateLength=110;
servoPlateWidth=65;
servoPlateTopHoles=10;
servoPlateBotHoles=40;

bottom = -0;


module boxBase() {
    
    difference(){
        union(){
            translate([wallThickness,0,bottom]) cube([boxLength-(2 * wallThickness), boxWidth, wallThickness]);
        }
        union(){
        }
    }
}

module fShoulder() {
    import_stl("F_shoulder.stl", convexity = 5);
}

module rShoulder() {
    import_stl("R_shoulder.stl", convexity = 5);
}

module boxLid() {
    lidBottom=boxHeight+3;
    difference(){
        union(){
            translate([0,0,lidBottom]) cube([boxLength, boxWidth, wallThickness]);
        }
        union(){
            for(i=[0:3]){
                translate([10+(10*i), 10, lidBottom-1]) cube([8, 15, 10]);
                translate([10+(10*i), boxWidth-10-15, lidBottom-1]) cube([8, 15, 10]);
            }
            // Corner holes
            translate([0+5,0+5,lidBottom-1]) cylinder(d=4, h=boxHeight, $fn=180);
            translate([boxLength-5,0+5,lidBottom-1]) cylinder(d=4, h=boxHeight, $fn=180);
            translate([0+5,boxWidth-5,lidBottom-1]) cylinder(d=4, h=boxHeight, $fn=180);
            translate([boxLength-5,boxWidth-5,lidBottom-1]) cylinder(d=4, h=boxHeight, $fn=180);
        }
    }
}

module boxWalls() {
    difference(){
        union(){
            translate([0,0,bottom]) cube([boxLength, wallThickness, boxHeight]);
            translate([0,0,bottom]) cube([wallThickness, boxWidth, boxHeight]);
            
            translate([0,boxWidth-wallThickness,bottom]) cube([boxLength, wallThickness, boxHeight]);
            translate([boxLength-wallThickness,0,bottom]) cube([wallThickness,boxWidth, boxHeight]);
            
            translate([wallThickness,boxWidth/2-14,wallThickness+2]) cube([2,6,boardLength-5]);
            translate([wallThickness+boxLength-8,boxWidth/2-14,wallThickness+2]) cube([2,6,boardLength-5]);
            
            translate([wallThickness,boxWidth/2+26,wallThickness+2]) cube([2,6,rpiLength-3]);
            translate([wallThickness,boxWidth/2+7.5,wallThickness+2]) cube([2,6,rpiLength-3]);
            
            translate([wallThickness,boxWidth/2+26,wallThickness]) cube([boxLength-wallThickness, 6, 4]);
            translate([wallThickness,boxWidth/2+7.5,wallThickness]) cube([boxLength-wallThickness, 6, 4]);
            
            translate([0+5,0+5,bottom]) cylinder(d=10, h=boxHeight, $fn=180);
            translate([boxLength-5,0+5,bottom]) cylinder(d=10, h=boxHeight, $fn=180);
            translate([0+5,boxWidth-5,bottom]) cylinder(d=10, h=boxHeight, $fn=180);
            translate([boxLength-5,boxWidth-5,bottom]) cylinder(d=10, h=boxHeight, $fn=180);
            
        }
        union(){
            
            // Corner holes
            translate([0+5,0+5,boxHeight-20]) cylinder(d=5, h=boxHeight, $fn=180);
            translate([boxLength-5,0+5,boxHeight-20]) cylinder(d=5, h=boxHeight, $fn=180);
            translate([0+5,boxWidth-5,boxHeight-20]) cylinder(d=5, h=boxHeight, $fn=180);
            translate([boxLength-5,boxWidth-5,boxHeight-20]) cylinder(d=5, h=boxHeight, $fn=180);
            
            translate([wallThickness+1,boxWidth/2-10,wallThickness+boardLength]) rotate([180,90,90]) pcb();
            
            translate([wallThickness+1,boxWidth/2+30,wallThickness+rpiLength]) rotate([90,90,0]) rpiPlus();

            // holes for shoulder mounts
            translate([-1,(boxWidth/2)+(servoPlateTopHoles/2), 7+56+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([-1,(boxWidth/2)-(servoPlateTopHoles/2), 7+56+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([-1,(boxWidth/2)+(servoPlateBotHoles/2), 7+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([-1,(boxWidth/2)-(servoPlateBotHoles/2), 7+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            
            translate([boxLength-1-wallThickness,(boxWidth/2)+(servoPlateTopHoles/2), 7+56+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([boxLength-1-wallThickness,(boxWidth/2)-(servoPlateTopHoles/2), 7+56+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([boxLength-1-wallThickness,(boxWidth/2)+(servoPlateBotHoles/2), 7+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([boxLength-1-wallThickness,(boxWidth/2)-(servoPlateBotHoles/2), 7+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
                
//            for(i=[0:8]) {
//                translate([(boxLength/2)-10, -1, 10+(10*i)]) cube([20,boxWidth+2,2]);                
//            }
            
            for(i=[0:3]) {
                for(j=[0:5]){
                    translate([(boxLength/2)-10+(4 * j), -1, 10+(20*i)]) cube([2,boxWidth+2,15]);
                }
            }
            
        }
    }
}

module shoulder() {
    translate([-100,0,0]) rotate([0,0,90]) fShoulder(); 
    translate([-50,0,0]) rotate([0,0,90]) rShoulder();
}

module template() {
    difference(){
        union(){
        }
        union(){
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

module rpiPlus() {
    rpi();
    translate([0,0,18.4]) rpi();
}



boxBase();
boxWalls();
//boxLid();

translate([-105,110,0]) color([0.6,0.6,0.6,0.2]) rotate([0,0,180]) shoulder();
translate([50+boxWidth+wallThickness,0,0]) color([0.6,0.6,0.6,0.2]) rotate([0,0,0]) shoulder();

translate([wallThickness+1,boxWidth/2-10,wallThickness+2+boardLength]) rotate([180,90,90]) pcb();

translate([wallThickness+2,boxWidth/2+30,wallThickness+2+rpiLength]) rotate([90,90,0]) rpiPlus();


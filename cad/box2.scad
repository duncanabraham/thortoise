

boardWidth = 50;
boardLength = 86;
boardThickness = 2;
rpiWidth = 30;
rpiLength = 67;
wallThickness = 3;
servoBracketHeight = 50;

boxWidth = 104 + (2 * wallThickness);
boxHeight = 70+40;
boxLength = 50 + (2 * wallThickness);

servoPlateLength=110;
servoPlateWidth=65;
servoPlateTopHoles=10;
servoPlateBotHoles=40;

bottom = -40;


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

module boxWalls() {
    difference(){
        union(){
            translate([0,0,bottom]) cube([boxLength, wallThickness, boxHeight]);
            translate([0,0,bottom]) cube([wallThickness, boxWidth, boxHeight]);
            
            translate([0,boxWidth-wallThickness,bottom]) cube([boxLength, wallThickness, boxHeight]);
            translate([boxLength-wallThickness,0,bottom]) cube([wallThickness,boxWidth, boxHeight]);
        }
        union(){
            // holes for shoulder mounts
            translate([-1,(boxWidth/2)+(servoPlateTopHoles/2), boxHeight-5+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([-1,(boxWidth/2)-(servoPlateTopHoles/2), boxHeight-5+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([-1,(boxWidth/2)+(servoPlateBotHoles/2), boxHeight-60+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([-1,(boxWidth/2)-(servoPlateBotHoles/2), boxHeight-60+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            
            translate([boxLength-1-wallThickness,(boxWidth/2)+(servoPlateTopHoles/2), boxHeight-5+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([boxLength-1-wallThickness,(boxWidth/2)-(servoPlateTopHoles/2), boxHeight-5+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([boxLength-1-wallThickness,(boxWidth/2)+(servoPlateBotHoles/2), boxHeight-60+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            translate([boxLength-1-wallThickness,(boxWidth/2)-(servoPlateBotHoles/2), boxHeight-60+bottom]) 
                rotate([90,0,90]) 
                cylinder(d=3,h=wallThickness+2, $fn=180);
            
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



boxBase();
boxWalls();
translate([-105,110,2]) rotate([0,0,180]) shoulder();
translate([50+boxWidth,0,2]) rotate([0,0,0]) shoulder();


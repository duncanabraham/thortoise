servoLength=42;
servoWidth=20;
servoHeight=36;
servoFlangeHeight=28;
fullLength=54;
flangeOffset = (fullLength - servoLength) / 2;
flangeMountHolesLength=50;
flangeHeight=2.5;
driveMountHeight=3;
driveMountWidth=10;

hipLength=60;
hipHeight=37;
hipWidth=60;


module servo(x,y,z) {
    difference(){
        union(){
            translate([x+flangeOffset,y,z]) cube([servoLength, servoWidth, servoHeight]);
            translate([x,y,z+servoFlangeHeight]) cube([fullLength, servoWidth, flangeHeight]);
            translate([x+fullLength-flangeOffset-16, y+10, z+servoHeight+3]) cylinder(d=5, h=7, $fn=36);
            translate([x+fullLength-flangeOffset-16, y+10, z+servoHeight]) cylinder(r=driveMountWidth, h=4, $fn=36);
            translate([x+fullLength-flangeOffset,y+4,z+4]) cube([flangeOffset, servoWidth-8, flangeHeight*2]);
        }
        union(){
            translate([x+2, y+5, z+servoFlangeHeight-1]) cylinder(d=4, h=4, $fn=36);
            translate([x+2, y+15, z+servoFlangeHeight-1]) cylinder(d=4, h=4, $fn=36);
            translate([x+fullLength-2, y+5, z+servoFlangeHeight-1]) cylinder(d=4, h=4, $fn=36);
            translate([x+fullLength-2, y+15, z+servoFlangeHeight-1]) cylinder(d=4, h=4, $fn=36);
        }
    }
}

module bracket(x,y,z) {
    difference(){
        union(){
            translate([x,y-3,z-1]) rotate([0,-90,-90]) color([0,1,0]) cube([hipHeight, fullLength+10, 2]);
            translate([x,y+servoWidth+1,z-1]) rotate([0,-90,-90]) color([0,1,0]) cube([hipHeight, fullLength+10, 2]);
            
            translate([x,y-3,z+servoFlangeHeight-6]) color([0,1,0]) cube([flangeOffset-1, servoWidth+4, 6]);
            translate([x,y-3,z+servoFlangeHeight-15]) color([0,1,0]) cube([flangeOffset-1, servoWidth+4, 4]);
            
            translate([x+fullLength,y-3,z+servoFlangeHeight-6]) color([0,1,0]) cube([flangeOffset-1+5, servoWidth+4, 8.5]);
            translate([x+fullLength-5,y-3,z+servoFlangeHeight-6]) color([0,1,0]) cube([flangeOffset-1+10, servoWidth+4, 6]);
            translate([x+fullLength-5,y-3,z+servoFlangeHeight-15]) color([0,1,0]) cube([flangeOffset-1+10, servoWidth+4, 4]);
            
            translate([x,y-3,z-3]) rotate([0,-90,-90]) color([0,1,0]) cube([2, fullLength+10, 26]);
            translate([x+fullLength-flangeOffset-16, y+10, z-8]) color([0,1,0]) cylinder(d=6, h=6, $fn=36);
        }
        union(){
            translate([x+2, y+5, z+servoFlangeHeight-20]) cylinder(d=4, h=24, $fn=36);
            translate([x+2, y+15, z+servoFlangeHeight-20]) cylinder(d=4, h=24, $fn=36);
            translate([x+fullLength-2, y+5, z+servoFlangeHeight-20]) cylinder(d=4, h=24, $fn=36);
            translate([x+fullLength-2, y+15, z+servoFlangeHeight-20]) cylinder(d=4, h=24, $fn=36);
        }
    }
}

module hip(x,y,z) {

}

module femur(x,y,z) {
    servo(x,y,z);
    bracket(x,y,z);
    
    rotate([0,0,225])
    difference(){
        x=x+0.5;
        y=y-20.5;
        union(){
            bracket(x,y,z);
            servo(x,y,z);
            rotate([0,0,66]) translate([x-22,y+10,z-3]) color([0,1,0]) cube([2,18.7,39]);
            rotate([0,-90,0]) translate([x-3.5,y-2,z-2]) color([0,1,0]) cube([2,25,18]);
        }
        union(){
            
            rotate([0,-90,0]) translate([x,y-25.8,z-2]) rotate([0,24,90]) color([0,1,0]) cube([20,10,30]);
            translate([x+fullLength+2,y-4,z+servoFlangeHeight-33]) cube([20,30,43]);
        }
    }
}

module knee(x,y,z) {
    difference(){
        rotate([0,0,0]) union(){
            translate([x,y-0.5,z-6]) color([0,0,1]) cube([90,30,hipHeight+17]);
            translate([x+fullLength-flangeOffset+42, y+14.5, z+servoHeight+7]) color([0,0,1]) cylinder(d=30, h=5, $fn=120);
            translate([x+fullLength-flangeOffset+42, y+14.5, z+servoHeight-42]) color([0,0,1]) cylinder(d=30, h=5, $fn=120);
        }
        union(){
            translate([x+55,y-1,z-1]) color([0,0,1]) cube([40,32,hipHeight+7]);
            translate([x+fullLength-flangeOffset+42, y+14.5, z+servoHeight+6]) color([0,0,1]) cylinder(d=5, h=10, $fn=120);
            translate([x+fullLength-flangeOffset+42, y+14.5, z+servoHeight-43]) color([0,0,1]) cylinder(d=16, h=7.5, $fn=120);
        }
    }
}


hip(0,0,0);
femur(0,0,0);
knee(-120,-30,-3);

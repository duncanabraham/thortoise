holeSpacing=8.5;
plateWidth=holeSpacing+6;
plateHeight=2;
plateLength=plateWidth*0.6;

midY=plateWidth/2;
midHole=holeSpacing/2;

pinSize=4.8;

module platform() {
    difference() {
        union(){
            translate([10,0,0]) rotate([0,-45,0]) cube([plateLength, plateWidth, plateHeight]);
            translate([0,0,0]) cube([10, plateWidth, plateHeight]);
            translate([pinSize/2, midY-midHole, 1])  cylinder(d=pinSize, h=7, $fn=180);
            translate([pinSize/2, midY+midHole, 1])  cylinder(d=pinSize, h=7, $fn=180);
        }
        union(){
            translate([17, midY-midHole, -1]) rotate([0,-45,0]) cylinder(d=4, h=8, $fn=180);
            translate([17, midY+midHole, -1]) rotate([0,-45,0]) cylinder(d=4, h=8, $fn=180);
            
            translate([pinSize/2, midY-midHole, 2])  cylinder(d=3, h=7, $fn=180);
            translate([pinSize/2, midY+midHole, 2])  cylinder(d=3, h=7, $fn=180);
        }
    }
}

platform();

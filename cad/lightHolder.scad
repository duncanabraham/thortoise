holeSpacing=8.5;
plateWidth=holeSpacing+6;
plateHeight=2;
plateLength=9;

midY=plateWidth/2;
midHole=holeSpacing/2;

pinSize=4.8;

angle=-50;

module platform(y) {
    difference() {
        union(){
            translate([10,y,0]) rotate([0,angle,0]) cube([plateLength, plateWidth, plateHeight]);
            translate([0,y,0]) cube([10, plateWidth, plateHeight]);
            translate([pinSize/2, y+midY-midHole, 1])  cylinder(d=pinSize, h=3, $fn=180);
            translate([pinSize/2, y+midY+midHole, 1])  cylinder(d=pinSize, h=3, $fn=180);
            
            translate([15, y+midY+midHole, 2.3]) rotate([0,angle,0]) cylinder(d=2.9, h=4, $fn=180);
        }
        union(){
            translate([19, y+midY-midHole, -1]) rotate([0,angle,0]) cylinder(d=3, h=100, $fn=180);
            translate([19, y+midY+midHole, -1]) rotate([0,angle,0]) cylinder(d=1.5, h=100, $fn=180);
            
            translate([pinSize/2, y+midY-midHole, -1])  cylinder(d=3, h=9, $fn=180);
            translate([pinSize/2, y+midY+midHole, -1])  cylinder(d=3, h=9, $fn=180);
        }
    }
}

for(i=[0:4]){
    platform(i * 14.7);
}

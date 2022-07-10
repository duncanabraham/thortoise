femur = 120;
knee = 120;
width = 20;
pitch = 100;

hwidth = width/2;
hpitch = pitch/2;


module topLimb(x,y,z,a) {
    difference() {
        union(){
            translate([x,y,z]) rotate([0,a,0]) cube([femur, width, width]);
            translate([x,y+hwidth,z]) rotate([0,a,0]) cylinder(d=width*1.5, h=10, $fn=36);
            
            translate([x+femur,y+hwidth,z+hwidth]) rotate([90,90,0]) cylinder(d=width*1.5, h=10, $fn=36);
        }
        union(){
//            translate([x+(femur/3)-1,y-1,z-(pitch/1.8)-1]) rotate([0,90,90]) cylinder(d=femur, h=width+2, $fn=360);
//            translate([x+(femur/3)-1,y-1,z+width+(pitch/1.8)-1]) rotate([0,90,90]) cylinder(d=femur, h=width+2, $fn=360);   
             translate([x+(femur/8)-1,y+width+1,z+width+(pitch/0.9)-1]) rotate([90,0,0]) cylinder(d=femur*2.01, h=width+2, $fn=360); 
        }
    }
}

module lowerLimb(x,y,z,a) {
}

module leftLeg() {
    topLimb(0,0,0,0);
}

module rightLeg() {
    topLimb(0,pitch,0,0);
}

leftLeg();
rightLeg();

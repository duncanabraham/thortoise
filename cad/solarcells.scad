width=55;
height=110;
thick=3.5;
outerRadius=200;
innerRadius=158.366;

leanAngle=52.1;


module topClip() {
    shortEdge = 40 / 2;
    longEdge = 50 / 2;
    difference() {
        union(){
            
            rotate([0,10,-350]) translate([0,0,0]) cube([shortEdge, 8, 8]);
            rotate([0,-10,-10]) translate([-shortEdge,0,0]) cube([shortEdge, 8, 8]);
            
            rotate([0,10,-350]) translate([-20,0,107]) cube([longEdge, 8, 8]);
            rotate([0,-10,-10]) translate([-longEdge+20,0,107]) cube([longEdge, 8, 8]);
            
            rotate([0,0,-350]) translate([0,0,0]) cube([5, 2.5, 112]);
            rotate([0,0,-10]) translate([-5,0,0]) cube([5, 2.5, 112]);
            
           rotate([0,7.53,-350]) translate([1,2,2]) color([0.6,0.6,1,0.5]) cube([width, thick, height]);
           rotate([0,-7.53,-10]) translate([-width,2,2]) color([0.6,0.6,1,0.5]) cube([width, thick, height]);
            
        }
       union() {
//           rotate([0,0,-350]) translate([1,2,2]) cube([width, 4, height]);
//           rotate([0,0,-10]) translate([-width,2,2]) cube([width, 4, height]);
//           
           rotate([0,7.53,-350]) translate([1,2.5,2]) color([0.6,0.6,1,0.5]) cube([width, 3.5, height]);
           rotate([0,-7.53,-10]) translate([-width,2.5,2]) color([0.6,0.6,1,0.5]) cube([width, 3.5, height]);
           
//           rotate([0,0,-350]) translate([7,2,113.9]) cube([longEdge, 4, 6.1]);
//           rotate([0,0,-10]) translate([-longEdge-7,2,113.9]) cube([longEdge, 4, 6.1]);
       }
   } 
}

topClip();
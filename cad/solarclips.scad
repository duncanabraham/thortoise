width=55;
bottomWidth=69.459;
height=110;
thick=4;
outerRadius=200;
cellRadius=200-thick-3;
innerRadius=158.366;

Height_ha = 114.17831;
Height_hb = 185.53975;
Height_hc = 114.17831;

leanAngle=90-72.08;
topAngle = 7.53 / 2;

module topClip(y) {
    difference() {
        union(){
            rotate([0,0,10]) translate([20,-5,0]) cube([8,20,8]);
            rotate([0,0,170]) translate([-28,-5,0]) cube([8,20,8]);
        }
        union(){
            rotate([0,0,10]) translate([20-0.1,-4.9,2]) cube([6,20,3.5]);
            rotate([0,0,170]) translate([-28+2.1,-4.9,2]) cube([6,20,3.5]);
        }
    }
}

module bottomClip(y) {
    difference() {
        union(){
            rotate([0,0,10]) translate([y,-1.5,0]) cube([8,25,8]);
            rotate([0,0,170]) translate([y-8,-1.5,0]) cube([8,25,8]);
        }
        union(){
            rotate([0,0,10]) translate([y-0.1,-1.4+7.22,2]) cube([6,25,3.5]);
            rotate([0,0,170]) translate([y-8+2.1,-1.5+7.22,2]) cube([6,25,3.5]);
        }
    }
}



module clips() {
    topClip();
    rotate([0,180,0]) bottomClip(0);
}

clips();

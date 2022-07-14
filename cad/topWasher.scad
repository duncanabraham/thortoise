hole=37;
innerHole=12.5;
outer=75;
thick = 3;

module disk() {
    difference(){
        union(){
            translate([0,0,0]) cylinder(d=outer, h=thick, $fn=360);
            translate([0,0,thick]) cylinder(d=hole, h=thick, $fn=360);
        }
        union(){
            translate([0,0,-1]) cylinder(d=innerHole, h=thick*2+2, $fn=360);
        }
    }
}


disk();

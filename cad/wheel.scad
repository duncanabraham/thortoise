outer=146;
bore=13;
outerBore=25.4;
hubDiameter=100;
width=25.4;

module tyre() {
    difference() {
        union(){
            translate([0,0,0]) color([0.1,0.1,0.1]) cylinder(d=outer, h=width, $fn=180);
        }
        union(){
            translate([0,0,-0.1]) color([0.1,0.1,0.1]) cylinder(d=hubDiameter, h=width+0.2, $fn=180);
        }
    }
}

module outerHub(){
    difference() {
        union(){
            translate([0,0,0]) color([0.8,0.8,0]) cylinder(d=hubDiameter, h=width, $fn=180);
        }
        union(){
            translate([0,0,-0.1]) color([0.1,0.1,0.1]) cylinder(d=hubDiameter-(width*0.75), h=width+0.2, $fn=180);
        }
    }
    
}

module wheel() {
    difference(){
        union(){
            tyre();
            outerHub();
            translate([0,0,(width/2)-2]) color([0.8,0.8,0]) cylinder(d=hubDiameter-(width/2), h=4, $fn=180);
            translate([0,0,-0.1]) color([0.8,0.8,0]) cylinder(d=outerBore, h=width+0.2, $fn=180);
        }
       union(){
           translate([0,0,-1]) cylinder(d=bore, h=width+2, $fn=180);
       }
   } 
}


wheel();


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

module panels() {
    difference(){
        union(){
//            translate([0,0,0]) color("#DDDDDD20") sphere(r=outerRadius, $fn=180);
            
//            translate([0,0,0]) cylinder(r=outerRadius, h=2, $fn=360);
//            translate([0,0,Height_hc]) cylinder(r=innerRadius, h=2, $fn=360);            
//            translate([cellRadius, -width/2,5]) rotate([-leanAngle,0,90]) color("#40408020") cube([width, thick, height]);
            for(i = [0:17]){                
                rotate([0,0,i *20]) translate([cellRadius, -(width/2),5]) rotate([0,-leanAngle,0]) color("#40408020") cube([thick, width,  height]);
            }
        }
        union(){            
            // translate([0,0,0]) color("#dddddd20") sphere(r=outerRadius, $fn=180);

        }
    }
}

module bracket() {        
    difference() {
        union(){
            for(i = [0:0]){ 
                rotate([0,0,i*20])
                union(){
                    translate([innerRadius-8,-8, -5]) rotate([0,leanAngle,5]) cube([4, 5, height+8]);
                    translate([innerRadius-8,-8, -5]) rotate([0,leanAngle,-5]) cube([4, 5, height+8]);
                    
                }

            }
        }
        union(){
            for(i = [0:17]){ 
                rotate([0,0,(i*20)])
                rotate([0,0,90]) translate([innerRadius-6, -(width/2),0]) rotate([0,leanAngle,0]) color("#40408020") cube([thick, width,  height]);
            }
        }
    }
}

//panels();
bracket();

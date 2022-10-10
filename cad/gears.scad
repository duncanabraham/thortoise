// Gears
include <gearsgen.scad>

innerDiameter=64;
radius=innerDiameter/2;
wallThickness=6;
height=40;

module motor(){
    motorDiameter=58.8;
    shaftLength=33.5;
    shaftDiameter=4;
    baseDiameter=28;
    translate([0,0,3]) 
    difference(){
        color([1,0,0]) union(){
            translate([0,0,0]) cylinder(d=shaftDiameter, h=shaftLength, $fn=90);
            translate([0,0,0]) cylinder(d=baseDiameter, h=8, $fn=90);
            translate([0,0,8]) cylinder(d=motorDiameter, h=12, $fn=90);
            translate([0,0,20]) cylinder(d1=motorDiameter, d2=25, h=8, $fn=90);
            translate([0,0,28]) cylinder(d=25, h=2, $fn=90);
//            translate([0,0,-20]) color([1,0,0]) cylinder(d=25, h=10, $fn=90);
        }
        union(){
            for(spot=[0:90:359]){
                translate([sin(spot) * 6,cos(spot) * 6,25])
                    cylinder(d=4, h=40, $fn=90);
            }
        }
    }
}

module encoder() {
    width=22;
    length=28;
    holesIn=2;
    
    color([1,0,1]) union(){
        translate([-7.5,-11,-3.01]) cube([length, width, 1]);
        translate([-2.5,-2,-3]) cube([5,4,2]);
        translate([-5.5,-9,-3]) cylinder(d=2.6, h=7, $fn=20);
        translate([-5.5,9,-3]) cylinder(d=2.6, h=7, $fn=20);
        translate([-5.5+11,-9,-3]) cylinder(d=2.6, h=7, $fn=20);
        translate([-5.5+11,9,-3]) cylinder(d=2.6, h=7, $fn=20);
    }
}

module ring() {
    bottomHeight=10;
    width=22.5;
    length=38.5;
    difference(){
        union(){
//            translate([0,0,bottomHeight-15]) cylinder(d=46.8, h=3, $fn=90);
        }
        union(){
            translate([0,0,bottomHeight-16]) cylinder(d=43, h=4, $fn=90);
            translate([-7.5,-12,-6.01]) cube([length, width+2, 8]);
        }
    }
}

module motorCell() {
    bottomHeight=10;
    height=28;
    bottom=-7;
    fastenerLength=height-7;
    capHoleOffset=42;
    difference(){
        union(){
            translate([0,0,bottomHeight-2]) cylinder(d=innerDiameter+wallThickness, h=height, $fn=180);
            translate([0,0,-2]) cylinder(d1=50, d2=innerDiameter+wallThickness, h=bottomHeight, $fn=180);
 
            for(spot=[0:90:359]){
                translate([sin(spot)*(radius*1.13),cos(spot)*(radius*1.13),15])
                    cylinder(d=8, h=fastenerLength, $fn=90);
            }
            // bolt down plate
            translate([-10,-60,8]) rotate([0,0,45]) cube([100, 4, height]);
            translate([33,-12,8]) rotate([0,0,45]) cube([20,30,height]); 
            translate([-1,-48,8]) rotate([0,0,45]) cube([20,30,height]);
            // end bolt down plate
            
//            encoder();
            ring();
            
            for(spot=[0:120:359]){
                translate([sin(spot+capHoleOffset)*20,cos(spot+capHoleOffset)*20,bottom+6])
                    cylinder(d=6, h=20, $fn=20);
            }
        }
        union(){   
            translate([-7.5+20,-12,-10]) cube([8, 22.5+2, 9]);
            translate([0,0,wallThickness+bottomHeight-4]) cylinder(d=innerDiameter, h=height, $fn=180);
            translate([0,0,3]) cylinder(d1=50, d2=innerDiameter, h=bottomHeight, $fn=180);
            
            offsetSpot=15;
            for(spot=[0:30:359]){
                translate([sin(spot+offsetSpot)*(radius+(wallThickness/3)),cos(spot+offsetSpot)*(radius+(wallThickness/3)),3]) 
                cylinder(d=7, h=20, $fn=90);
            }
            
            translate([0,0,bottom]) cylinder(d=7, h=20, $fn=90);
            for(spot=[0:90:359]){
                translate([sin(spot)*12.5,cos(spot)*12.5,bottom])
                    cylinder(d=3, h=20, $fn=20);
                translate([sin(spot)*12.5,cos(spot)*12.5,bottom])
                    cylinder(d=6, h=8, $fn=90);

            }
            
            for(spot=[0:120:359]){
                translate([sin(spot+capHoleOffset)*20,cos(spot+capHoleOffset)*20,bottom])
                    cylinder(d=3, h=20, $fn=20);
                translate([sin(spot+capHoleOffset)*20,cos(spot+capHoleOffset)*20,bottom+7])
                    cylinder(d=5.7, h=20, $fn=6);
            }
            
            for(spot=[0:90:359]){
                translate([sin(spot)*(radius*1.13),cos(spot)*(radius*1.13),height-fastenerLength])
                    cylinder(d=4.2, h=50, $fn=90);
            }
            translate([10,-10,6]) rotate([45,90,0]) cylinder(d=13, h=50, $fn=90);
            for(spot=[0:90:359]){
                translate([sin(spot)*(radius*1.13),cos(spot)*(radius*1.13),5])
                    cylinder(d=8, h=10, $fn=90);
            }
            encoder();
//            translate([0,0,bottom+8]) cap();
            translate([-10,-60,8]) rotate([90,0,45]) union(){
                translate([4,4,-6]) cylinder(d=4, h=10, $fn=90);
                translate([4,height-4,-6]) cylinder(d=4, h=10, $fn=90);
                translate([96,4,-6]) cylinder(d=4, h=10, $fn=90);
                translate([96,height-4,-6]) cylinder(d=4, h=10, $fn=90);
                
                translate([4,4,-7]) cylinder(d1=4, d2=8, h=4, $fn=90);
                translate([4,height-4,-7]) cylinder(d1=4, d2=8, h=4, $fn=90);
                translate([96,4,-7]) cylinder(d1=4, d2=8, h=4, $fn=90);
                translate([96,height-4,-7]) cylinder(d1=4, d2=8, h=4, $fn=90);
                
            }
        }
    }
}

module cap(){
    bottom= -22;
    difference(){
        union(){
            translate([0,0,bottom]) cylinder(d=51, h=20, $fn=90);
             
        }
        union(){
            translate([0,0,bottom+4]) cylinder(d=47, h=20, $fn=90);
            capHoleOffset=42;
            for(spot=[0:120:359]){
                translate([sin(spot+capHoleOffset)*20,cos(spot+capHoleOffset)*20,bottom-1])
                    cylinder(d=3, h=20, $fn=20);
                translate([sin(spot+capHoleOffset)*20,cos(spot+capHoleOffset)*20,bottom-1])
                    cylinder(d=7, h=3, $fn=20);
                
            }
            translate([0,0,bottom+11]) rotate([0,0,-33]) cube([47, 23, 10]);
//            translate([0,0,bottom-1]) cylinder(d=10, h=20, $fn=90);
//            translate([0,0,bottom+5]) encoder();
        }
    }
}

module outerGear(){
    circ=PI*innerDiameter;
    pitch=3.4;
    teeth=60; // circ/pitch;
    bottom=40;
    radius=(innerDiameter/2)-5;

    translate([0,0,44]) pfeilhohlrad (modul=Module, zahnzahl=teeth, breite=20, randbreite=2, eingriffswinkel=pressure_angle, schraegungswinkel=finalHelixAngle);
}

module outerRing() {
    bottom=40;
    height=24;
    fastenerLength=24;
    difference(){
        union(){
            translate([0,0,bottom]) cylinder(d=innerDiameter+wallThickness, h=height, $fn=180);
            for(spot=[0:90:359]){
                translate([sin(spot)*(radius*1.13),cos(spot)*(radius*1.13),bottom])
                    cylinder(d=8, h=fastenerLength, $fn=90);
            }
           // bolt down plate
            translate([-10,-60,bottom]) rotate([0,0,45]) cube([100, 4, 24]);
            translate([33,-12,bottom]) rotate([0,0,45]) cube([20,30,24]); 
            translate([-1,-48,bottom]) rotate([0,0,45]) cube([20,30,24]);
            // end bolt down plate
        }
        union(){
            translate([0,0,bottom+3]) cylinder(d=innerDiameter, h=height+10, $fn=180);
            translate([0,0,bottom-1]) cylinder(d=55, h=height+10, $fn=180);
            for(spot=[0:90:359]){
                translate([sin(spot)*(radius*1.13),cos(spot)*(radius*1.13),bottom-1])
                    cylinder(d=5, h=fastenerLength+2, $fn=90);
            }
            // Fixing holes
            translate([-10,-60,bottom-1]) rotate([90,0,45]) union(){
                translate([4,6,-6]) cylinder(d=4, h=10, $fn=90);
                translate([4,20,-6]) cylinder(d=4, h=10, $fn=90);
                translate([96,6,-6]) cylinder(d=4, h=10, $fn=90);
                translate([96,20,-6]) cylinder(d=4, h=10, $fn=90);
                
                translate([4,6,-7]) cylinder(d1=4, d2=8, h=4, $fn=90);
                translate([4,20,-7]) cylinder(d1=4, d2=8, h=4, $fn=90);
                translate([96,6,-7]) cylinder(d1=4, d2=8, h=4, $fn=90);
                translate([96,20,-7]) cylinder(d1=4, d2=8, h=4, $fn=90);
            }
        }
        
    }
     outerGear();
}

module planetGear() {
    bottom=44;
    height=20;
    teeth=20;
    final_hub_diameter=0;
    radius=20;
    bearingBore=4;
    bearingHeight=4;
    bearingOd=9;
    difference(){
        union(){
            for(spot=[0:120:359]){
                translate([sin(spot)*radius,cos(spot)*radius,bottom])
                color([0,0.4,0])
                pfeilrad (
                    modul=Module, 
                    zahnzahl=teeth, 
                    breite=height, 
                    bohrung=6, 
                    nabendicke=final_hub_thickness,    
                    nabendurchmesser=final_hub_diameter, 
                    eingriffswinkel=pressure_angle, 
                    schraegungswinkel=finalHelixAngle, 
                    optimiert=optimized
                );
            }
        }
        union(){
            for(spot=[0:120:359]){
                translate([sin(spot)*radius,cos(spot)*radius,bottom+height-bearingHeight])
                    cylinder(d=bearingOd, h=bearingHeight+1, $fn=90);
                translate([sin(spot)*radius,cos(spot)*radius,bottom-1])
                    cylinder(d=bearingOd, h=bearingHeight+1, $fn=90);
            }
        }
    }
}

module sunGear(){
    bottom=44;
    height=20;
    teeth=20;
//    final_hub_diameter=18;
    final_hub_thickness=0;
    bearingBore=4;
    bearingHeight=4;
    bearingOd=9;
    translate([0,0,bottom]) difference(){
        union(){
            pfeilrad (
                modul=Module, 
                zahnzahl=teeth, 
                breite=height, 
                bohrung=4.1, 
                nabendicke=final_hub_thickness, 
                nabendurchmesser=final_hub_diameter, 
                eingriffswinkel=-pressure_angle, 
                schraegungswinkel=-finalHelixAngle, 
                optimiert=optimized
            );
        }
        union(){
            translate([0,0,height-bearingHeight]) cylinder(d=bearingOd, h=bearingHeight+1, $fn=90);
            for(spot=[0:90:359]){
                translate([sin(spot) * 6,cos(spot) * 6, -1])
                    cylinder(d=3.1, h=40, $fn=90);
                translate([sin(spot) * 6,cos(spot) * 6,10])
                    cylinder(d=5, h=40, $fn=90);
            }
        }
    }
}

module planetCarrier() {
    bottom=44+24;
    radius=20;
    thick=8;
    difference() {
        union(){
            translate([0,0,bottom+thick]) cylinder(d=19.9, h=13, $fn=90);
            translate([0,0,bottom+thick]) cylinder(d=24, h=1, $fn=90);
            translate([0,0,bottom]) rotate([0,0,90]) cylinder(d=60, h=thick, $fn=3);
            for(spot=[0:120:359]){
                translate([sin(spot)*radius,cos(spot)*radius,bottom])
                    cylinder(d=20, h=thick, $fn=90);
//                translate([sin(spot)*radius,cos(spot)*radius,bottom-1])
//                    cylinder(d=7.5, h=thick+1, $fn=90);
            }
            
        }
        union(){
            for(spot=[0:120:359]){
                translate([sin(spot)*radius,cos(spot)*radius,bottom-2])
                    cylinder(d=4.1, h=thick+2, $fn=90);
                translate([sin(spot)*radius,cos(spot)*radius,bottom+5]) cylinder(d=7.6, h=thick+2, $fn=6);
            }
//           for(spot=[0:90:359]){
//                translate([sin(spot)*6,cos(spot)*6,bottom-2])
//                    cylinder(d=3.1, h=thick*4, $fn=90);
//                translate([sin(spot)*6,cos(spot)*6,bottom-1])
//                    cylinder(d=6.15, h=4, $fn=6);
//            }
            // Alternative Fixing
            translate([0,0,bottom-2]) cylinder(d=5, h=thick+20, $fn=90);
            translate([0,0,bottom+9]) cylinder(d=9, h=5, $fn=6);
            translate([0,0,bottom+9]) cube([10,9,5]);
        }
    }
}

module outputEnd(){
    height=23;
    bottom=40+26;
    fastenerLength=17;
    difference(){
        union(){
            color("#aaaaff") translate([0,0,bottom]) cylinder(d=innerDiameter+wallThickness, h=height, $fn=180);
            for(spot=[0:90:359]){
                translate([sin(spot)*(radius*1.13),cos(spot)*(radius*1.13),bottom])
                    cylinder(d=8, h=fastenerLength, $fn=90);
            }
        }
       union(){
            translate([0,0,bottom-1]) cylinder(d=innerDiameter, h=height-9, $fn=180);
            translate([0,0,bottom+height-12]) cylinder(d=32.1, h=10, $fn=180);
             translate([0,0,bottom+height-12]) cylinder(d=21, h=20, $fn=180);
             for(spot=[0:90:359]){
                translate([sin(spot)*(radius*1.13),cos(spot)*(radius*1.13),bottom-1])
                    cylinder(d=4.1, h=fastenerLength+2, $fn=90);
                translate([sin(spot)*(radius*1.13),cos(spot)*(radius*1.13),bottom+height-6])
                    cylinder(d=8.1, h=fastenerLength+2, $fn=90);
            }
       }
    }      
}



//motor();
cap();
motorCell();
//outerRing();
//planetGear();
//sunGear();
//planetCarrier();
//outputEnd();



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


module panel(w,l,h) {
    cube([w, l,  h]);
}

module panels() {   
    for(i = [0:17]){                
        rotate([0,0,i *20]) 
            translate([cellRadius, -(width/2),5]) 
            rotate([0,-leanAngle,0])
            color("#10104040") 
            panel(thick, width, height);
    }
}

module bracket() {        
    for(i=[0:17]){
        rotate([0,0,i*20])
        translate([cellRadius, -(width/2)-7.22, 0])
        rotate([0, -leanAngle, 0])
        cube([10,10,10]);
        
//        rotate([0,0,i*20])
//        translate([cellRadius, (width/2)-10, 0])
//        rotate([0, -leanAngle, 0])
//        cube([10,10,10]);
    }
}

panels();
bracket();

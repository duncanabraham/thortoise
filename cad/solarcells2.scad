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

module bottomBracket() {
    translate([cellRadius, -(width/2)-8, 0])
    rotate([0, -leanAngle, 0])
    cube([8,18,8]);
    
    translate([cellRadius, (width/2)-10, 0])
    rotate([0, -leanAngle, 0])
    cube([8,18,8]);
}

module bottomBrackets(n) {
    for(i=[0:n]){
        rotate([0,0,i*20])
            bottomBracket();    
    }
}

module topBracket() {
    translate([innerRadius, -(width/2)-2, height-5])
    rotate([0, -leanAngle, 0])
    cube([8,14,8]);

    translate([innerRadius, (width/2)-12, height-5])
    rotate([0, -leanAngle, 0])
    cube([8,14,8]);
}

module topBrackets(n) {        
    for(i=[0:n]){
        rotate([0,0,i*20])
        topBracket();
    }
}

panels();
bottomBrackets(17);
topBrackets(17);

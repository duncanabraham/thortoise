length = 190;
width = 120;
wallThickness = 5;
height = 22.5;
motorWidth = 15;
halfHeight = height /2;

axelBore = 10;
holeDistance = 20;
boreOffset = 12;
fixingOffset = 2.25;
fixingBore = 3;
fixingTop = height-fixingOffset;
reverseFixings = holeDistance + boreOffset;
wireHoleOffset = 40;
wireHoleBoreLength = 25;
wireHoleBoreHeight = 17;
wireHoleBoreHeightStart = (height - wireHoleBoreHeight) / 2;

batteryLength = 151;
batteryWidth = 51;
batteryHeight = 93;

boxHeight = batteryHeight / 2;

module lid() {   
    offsetUp = 0;
    startX = (length - batteryLength) / 2;
    startY = (width - batteryWidth) / 2;
    difference(){
        union(){
            translate([0,0,boxHeight + wallThickness + offsetUp]) cube([length, width, wallThickness]);
            translate([startX - 5, startY - 5, boxHeight + wallThickness + offsetUp]) cube([batteryLength+10, batteryWidth+10, 10]);
        }
        union(){
            translate([5, motorWidth + wallThickness, boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=180);
            translate([5, width - (motorWidth + wallThickness), boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=180);
            translate([length-5, motorWidth + wallThickness, boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=180);
            translate([length-5, width - (motorWidth + wallThickness), boxHeight-10+offsetUp]) cylinder(d=5, h=boxHeight, $fn=180);
            battery();
            fixingHoles();
        }
    }
}

module battery() {
    startX = (length - batteryLength) / 2;
    startY = (width - batteryWidth) / 2;
    translate([startX, startY, wallThickness]) color([0,0,0]) cube([batteryLength, batteryWidth, batteryHeight]);
}

module base(){
    startX = (length - batteryLength) / 2;
    startY = (width - batteryWidth) / 2;
    difference(){
        union(){            
            translate([0,0,0]) cube([length, width, wallThickness]);
            translate([startX - 5, startY - 5, wallThickness]) cube([batteryLength+10, batteryWidth+10, 10]);
            translate([0, motorWidth, 0]) cube([length, wallThickness, boxHeight+wallThickness]);
            translate([0, width-motorWidth-wallThickness, 0]) cube([length, wallThickness, boxHeight+wallThickness]);
            
            translate([5, motorWidth + wallThickness, wallThickness]) cylinder(d=10, h=boxHeight, $fn=180);
            translate([5, width - (motorWidth + wallThickness), wallThickness]) cylinder(d=10, h=boxHeight, $fn=180);
            translate([length-5, motorWidth + wallThickness, wallThickness]) cylinder(d=10, h=boxHeight, $fn=180);
            translate([length-5, width - (motorWidth + wallThickness), wallThickness]) cylinder(d=10, h=boxHeight, $fn=180);
        }
        union(){
            translate([boreOffset, 0, 0 + wallThickness + halfHeight]) rotate([0,90,90]) cylinder(d=axelBore, h=width, $fn=180);
            translate([boreOffset + holeDistance, 0, 0 + wallThickness + fixingOffset ]) rotate([0,90,90]) cylinder(d=fixingBore, h=width, $fn=180);
            translate([boreOffset + holeDistance, 0, 0 + wallThickness + fixingTop ]) rotate([0,90,90]) cylinder(d=fixingBore, h=width, $fn=180);
            translate([wireHoleOffset, 0, wallThickness + wireHoleBoreHeightStart]) cube([wireHoleBoreLength, width, wireHoleBoreHeight]);
            
            translate([length-boreOffset, 0, 0 + wallThickness + halfHeight]) rotate([0,90,90]) cylinder(d=axelBore, h=width, $fn=180);
            translate([length-reverseFixings, 0, 0 + wallThickness + fixingOffset ]) rotate([0,90,90]) cylinder(d=fixingBore, h=width, $fn=180);
            translate([length-reverseFixings, 0, 0 + wallThickness + fixingTop ]) rotate([0,90,90]) cylinder(d=fixingBore, h=width, $fn=180);
            translate([length-wireHoleOffset-wireHoleBoreLength, 0, wallThickness + wireHoleBoreHeightStart]) cube([wireHoleBoreLength, width, wireHoleBoreHeight]);
            battery();
            
            translate([5, motorWidth + wallThickness, boxHeight-10]) cylinder(d=5, h=boxHeight, $fn=180);
            translate([5, width - (motorWidth + wallThickness), boxHeight-10]) cylinder(d=5, h=boxHeight, $fn=180);
            translate([length-5, motorWidth + wallThickness, boxHeight-10]) cylinder(d=5, h=boxHeight, $fn=180);
            translate([length-5, width - (motorWidth + wallThickness), boxHeight-10]) cylinder(d=5, h=boxHeight, $fn=180);
            
            fixingHoles();
        }
    }
}

module fixingHoles() {
    translate([5, (width/2) - 20, -1]) cylinder(d=5, h=100, $fn=180);
    translate([5, (width/2) + 20, -1]) cylinder(d=5, h=100, $fn=180);
    
    translate([length-5, (width/2) - 20, -1]) cylinder(d=5, h=100, $fn=180);
    translate([length-5, (width/2) + 20, -1]) cylinder(d=5, h=100, $fn=180);
    
    // Side holes
    translate([(length/2)-80, 5, -1]) cylinder(d=5, h=100, $fn=180);
    translate([(length/2)-80, width-5, -1]) cylinder(d=5, h=100, $fn=180);
    translate([(length/2)-30, 5, -1]) cylinder(d=5, h=100, $fn=180);
    translate([(length/2)-30, width-5, -1]) cylinder(d=5, h=100, $fn=180);
    
    translate([(length/2)+80, 5, -1]) cylinder(d=5, h=100, $fn=180);
    translate([(length/2)+80, width-5, -1]) cylinder(d=5, h=100, $fn=180);
    translate([(length/2)+30, 5, -1]) cylinder(d=5, h=100, $fn=180);
    translate([(length/2)+30, width-5, -1]) cylinder(d=5, h=100, $fn=180);
    
    translate([(length/2)+30, 25, -1]) cylinder(d=12, h=100, $fn=180);
    translate([(length/2)+30, width-25, -1]) cylinder(d=12, h=100, $fn=180);
    translate([(length/2)-30, 25, -1]) cylinder(d=12, h=100, $fn=180);
    translate([(length/2)-30, width-25, -1]) cylinder(d=12, h=100, $fn=180);

}

module temp(){
    difference(){
        union(){
        }
        union(){
        }
    }
}


//base();
lid();
//battery();


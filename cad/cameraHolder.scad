
tolerance=0.4;

camLength=91 + tolerance;
camHeight=28 + tolerance;
camWidth=17.5 + tolerance;

camBoxWallThickness = 3;
twoWalls = camBoxWallThickness * 2;

camBoxLength = camLength + twoWalls;
camBoxWidth = camWidth + camBoxWallThickness;
camBoxHeight = camHeight + twoWalls;

module camera() {
    difference() {
        union(){
            translate([0,0,0]) cube([camLength, camWidth, camHeight]);
        }
        union(){
        }
    }
}

module cameraHolder() {
    difference() {
        union(){
            translate([0,0,0]) cube([camBoxLength, camBoxWidth, camBoxHeight]);
            translate([-10,camBoxWidth - camBoxWallThickness, 0]) cube([10, camBoxWallThickness, camBoxHeight]);
            translate([-10,camBoxWidth - camBoxWallThickness, camBoxHeight / 2]) rotate([90,0,180]) cylinder(d=camBoxHeight, h=camBoxWallThickness, $fn=180);            
            
            translate([camBoxLength,camBoxWidth - camBoxWallThickness, 0]) cube([10, camBoxWallThickness, camBoxHeight]);
            translate([camBoxLength+10,camBoxWidth - camBoxWallThickness, camBoxHeight / 2]) rotate([90,0,180]) cylinder(d=camBoxHeight, h=camBoxWallThickness, $fn=180);
        }
        union(){
            translate([camBoxWallThickness, camBoxWallThickness+0.1, camBoxWallThickness]) camera();
            
            translate([twoWalls*2, twoWalls, -1]) cube([camLength - (twoWalls * 3), camWidth, 5]);
            
            translate([twoWalls, -1,twoWalls]) cube([camLength - twoWalls, camWidth*2, camHeight - twoWalls]);
            translate([-10,camBoxWidth - camBoxWallThickness-1, camBoxHeight / 2]) rotate([90,0,180]) cylinder(d=5, h=camBoxWallThickness+2, $fn=180); 
            translate([camBoxLength+10,camBoxWidth - camBoxWallThickness-1, camBoxHeight / 2]) rotate([90,0,180]) cylinder(d=5, h=wallThickness+2, $fn=180);
        }
    }
}

cameraHolder();

tilt=59.2;
cellHeight=110;
cellWidth=55;
cellThick=3.5;
bracketWidth=8;
triangleFCbase=160.838;
triangleFCleft=103.160;
trangleFCright=123.396;
bottomBracketWidth=25;
topBracketWidth=20;
cornerAngle=21.18/2;

/* 
Triangle
	a: Length of side a
	b: Length of side b
	angle: angle at point angleAB
*/
module Triangle(
			a, b, angle, height=1, heights=undef,
			center=undef, centerXYZ=[false,false,false])
{
	// Calculate Heights at each point
	heightAB = ((heights==undef) ? height : heights[0])/2;
	heightBC = ((heights==undef) ? height : heights[1])/2;
	heightCA = ((heights==undef) ? height : heights[2])/2;
	centerZ = (center || (center==undef && centerXYZ[2]))?0:max(heightAB,heightBC,heightCA);

	// Calculate Offsets for centering
	offsetX = (center || (center==undef && centerXYZ[0]))?((cos(angle)*a)+b)/3:0;
	offsetY = (center || (center==undef && centerXYZ[1]))?(sin(angle)*a)/3:0;
	
	pointAB1 = [-offsetX,-offsetY, centerZ-heightAB];
	pointAB2 = [-offsetX,-offsetY, centerZ+heightAB];
	pointBC1 = [b-offsetX,-offsetY, centerZ-heightBC];
	pointBC2 = [b-offsetX,-offsetY, centerZ+heightBC];
	pointCA1 = [(cos(angle)*a)-offsetX,(sin(angle)*a)-offsetY, centerZ-heightCA];
	pointCA2 = [(cos(angle)*a)-offsetX,(sin(angle)*a)-offsetY, centerZ+heightCA];

	polyhedron(
		points=[	pointAB1, pointBC1, pointCA1,
					pointAB2, pointBC2, pointCA2 ],
		triangles=[	
			[0, 1, 2],
			[3, 5, 4],
			[0, 3, 1],
			[1, 3, 4],
			[1, 4, 2],
			[2, 4, 5],
			[2, 5, 0],
			[0, 5, 3] ] );
}

module triangleFromCentre() {
//    Triangle(triangleFCleft, triangleFCbase, 50.104);
    Triangle(120, 160.838, 39.896);
}

//triangleFromCentre();

module topBracket(x,y,z) {
thick=cellThick+4;
    difference() {
        union(){
            rotate([0, 0, cornerAngle]) 
                translate([x,y,z]) 
                cube([thick, topBracketWidth, thick]);
            rotate([0, 0, -cornerAngle]) 
                translate([x,y-topBracketWidth,z]) 
                cube([thick, topBracketWidth, thick]);
            rotate([0, 0, 0]) 
                translate([x-0.6,y-4,z]) 
                cube([thick,thick,thick]);
        }
        union(){
            rotate([0, 0, cornerAngle]) 
                translate([x+2,y-1,z+4]) 
                cube([cellThick, topBracketWidth+2, cellThick+1]);
            rotate([0, 0, -cornerAngle])
                translate([x+2,y-topBracketWidth-1,z+4]) 
                cube([cellThick, topBracketWidth+2, 5]);
        }
    }
}

module bottomBracket(x,y,z) {
    thick=cellThick+4;
    difference() {
        union(){
            rotate([0, 0, cornerAngle]) 
                translate([x,y,z]) 
                cube([thick, bottomBracketWidth, thick]);
            rotate([0, 0, -cornerAngle]) 
                translate([x,y-bottomBracketWidth,z]) 
                cube([thick, bottomBracketWidth, thick]);
            rotate([0, 0, 0]) 
                translate([x-0.6,y-4,z]) 
                cube([thick,thick,thick]);
        }
        union(){
            rotate([0, 0, cornerAngle]) 
                translate([x+2,y-1+8,z+4]) 
                cube([cellThick, bottomBracketWidth+2, cellThick+1]);
            rotate([0, 0, -cornerAngle])
                translate([x+2,y-bottomBracketWidth-1,z+4]) 
                cube([cellThick, bottomBracketWidth+2-8, 5]);
        }
    }
}

topBracket(0,0,cellHeight); 
bottomBracket(0,0,0);


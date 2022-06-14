// Physical dimensions
batteryWidth = 110;
batteryHeight = 55;
batteryLength = 160;

computerWidth=70;
computerHeight=40;
computerLength=100;

computerBoxPadding=20;

servoPlateWidth=65;
servoPlateLength=110;
servoPlateHeight=5;

wall=5;
halfWall = wall / 2;

// Hole sizes
boltHole=4;
insertHole=5.2;
sinkWidth=8;
sinkDepth = wall*0.25;
ledBezel=7.7;

// Calculated dimensions
walls=(wall * 2);
boxOuterLength = batteryLength + walls;
boxOuterWidth = batteryWidth + walls;
boxOuterHeight = batteryHeight + wall;
startZ=boxOuterHeight + 50;

// Centre point
midx = boxOuterLength / 2;
midy = boxOuterWidth / 2;

// How many steps in a circle
circSteps = 30;

// The big box to put the battery in
module batteryHolder() {
    zpos=100;
    
  difference()
  {
    union()
    {
      translate([0+wall,0+wall,zpos]) cube([boxOuterLength-walls, boxOuterWidth-walls, wall]); // base
      
      // translate([wall,0,zpos]) cube([boxOuterLength-walls, wall, boxOuterHeight]);
      // translate([0,wall,zpos]) cube([wall, boxOuterWidth-walls, boxOuterHeight]);
      // translate([wall,boxOuterWidth-wall,zpos]) cube([boxOuterLength-walls, wall, boxOuterHeight]);
      // translate([boxOuterLength-wall,wall,zpos]) cube([wall, boxOuterWidth-walls, boxOuterHeight]);
      
      // translate([wall,wall,zpos]) cylinder(d=walls, h=boxOuterHeight, $fn=circSteps);
      // translate([boxOuterLength - wall,wall,zpos]) cylinder(d=walls, h=boxOuterHeight, $fn=circSteps);
      // translate([wall,boxOuterWidth-wall,zpos]) cylinder(d=walls, h=boxOuterHeight, $fn=circSteps);
      // translate([boxOuterLength - wall,boxOuterWidth-wall,zpos]) cylinder(d=walls, h=boxOuterHeight, $fn=circSteps);
    }
    union()
    {
      // holes to put the brass inserts into
      translate([wall,wall,zpos+boxOuterHeight-walls]) cylinder(d=insertHole, h=boxOuterHeight+0.1, $fn=circSteps);            
      translate([boxOuterLength - wall,wall,zpos+boxOuterHeight-walls]) cylinder(d=insertHole, h=boxOuterHeight+0.1, $fn=circSteps);
      translate([wall,boxOuterWidth-wall,zpos+boxOuterHeight-walls]) cylinder(d=insertHole, h=boxOuterHeight+0.1, $fn=circSteps);            
      translate([boxOuterLength - wall,boxOuterWidth-wall,zpos+boxOuterHeight-walls]) cylinder(d=insertHole, h=boxOuterHeight+0.1, $fn=circSteps);
      
      // Bolt holes in the bottom of the box
      translate([wall+5+5,wall+35,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+5+5,wall+75,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+5,wall+50,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+5,wall+60,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      
      translate([wall+5+90,wall+50,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+5+90,wall+60,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+90,wall+35,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+90,wall+75,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      
      // Bolt holes on the sides - just in case
      translate([wall+5+5,wall+boxOuterWidth+35,zpos+10]) color([0,1,0]) rotate([90,0,0]) cylinder(d=4,h=boxOuterWidth*2, $fn=circSteps);
      translate([wall+5+5,wall+boxOuterWidth+35,zpos+50]) color([0,1,0]) rotate([90,0,0]) cylinder(d=4,h=boxOuterWidth*2, $fn=circSteps);
      
      translate([wall+5+5+55,wall+boxOuterWidth+35,zpos+25]) color([0,1,0]) rotate([90,0,0]) cylinder(d=4,h=boxOuterWidth*2, $fn=circSteps);
      translate([wall+5+5+55,wall+boxOuterWidth+35,zpos+35]) color([0,1,0]) rotate([90,0,0]) cylinder(d=4,h=boxOuterWidth*2, $fn=circSteps);
      
      translate([wall+5+90,wall+boxOuterWidth+35,zpos+25]) color([0,1,0]) rotate([90,0,0]) cylinder(d=4,h=boxOuterWidth*2, $fn=circSteps);
      translate([wall+5+90,wall+boxOuterWidth+35,zpos+35]) color([0,1,0]) rotate([90,0,0]) cylinder(d=4,h=boxOuterWidth*2, $fn=circSteps);
      
      translate([wall+5+145,wall+boxOuterWidth+35,zpos+10]) color([0,1,0]) rotate([90,0,0]) cylinder(d=4,h=boxOuterWidth*2, $fn=circSteps);
      translate([wall+5+145,wall+boxOuterWidth+35,zpos+50]) color([0,1,0]) rotate([90,0,0]) cylinder(d=4,h=boxOuterWidth*2, $fn=circSteps);
      
      // Countersink inside the box
      translate([wall+5+5,wall+35,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+5+5,wall+75,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+5,wall+50,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+5,wall+60,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      
      translate([wall+5+90,wall+50,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+5+90,wall+60,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+90,wall+35,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+90,wall+75,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      
      // camera cable
      translate([wall+(boxOuterLength*0.4), (boxOuterWidth/4), zpos-1]) color([1,0,0]) cube([25, 5, wall+2]);
    }
  } 
}

module batteryHolderRound() {
  zpos=130;
  difference() {
    union() 
    {
      translate([midx,midy, zpos]) cylinder(r=100, h=wall, $fn=circSteps);
      translate([midx,midy, zpos+wall]) cylinder(r=100, h=boxOuterHeight, $fn=circSteps);
    }
    union()
    {
       translate([midx,midy, zpos+wall]) cylinder(r=95, h=boxOuterHeight+1, $fn=circSteps);
      // Bolt holes in the bottom of the box
      translate([wall+5+5,wall+35,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+5+5,wall+75,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+5,wall+50,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+5,wall+60,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      
      translate([wall+5+90,wall+50,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+5+90,wall+60,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+90,wall+35,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+90,wall+75,zpos-1]) color([0,1,0]) cylinder(d=4,h=wall+2, $fn=circSteps);
      
      // Countersink inside the box
      translate([wall+5+5,wall+35,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+5+5,wall+75,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+5,wall+50,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+5,wall+60,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      
      translate([wall+5+90,wall+50,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+5+90,wall+60,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+90,wall+35,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+90,wall+75,zpos+sinkDepth]) color([0,1,0]) cylinder(d=sinkWidth,h=wall+2, $fn=circSteps);
    }
  }
}

// The lid which incorporates the upperbox
module lid() {  
  boxOuterLength = batteryLength + walls;
  boxOuterWidth = batteryWidth + walls;
  up=50;
  
  difference()
  {
    union()
    {
      translate([0,0+wall,startZ+up]) cube([boxOuterLength, boxOuterWidth-walls, wall]);
      translate([0+wall,0,startZ+up]) cube([boxOuterLength-walls, boxOuterWidth, wall]);
      
      translate([wall,wall,startZ+up]) cylinder(d=walls, h=wall, $fn=circSteps);
      translate([boxOuterLength - wall,wall,startZ+up]) cylinder(d=walls, h=wall, $fn=circSteps);
      translate([wall,boxOuterWidth-wall,startZ+up]) cylinder(d=walls, h=wall, $fn=circSteps);
      translate([boxOuterLength - wall,boxOuterWidth-wall,startZ+up]) cylinder(d=walls, h=wall, $fn=circSteps);
        
    }
    union()
    {
      // bolt holes
      translate([wall,wall,startZ-1+up]) cylinder(d=boltHole, h=wall+2, $fn=circSteps);  
      translate([boxOuterLength - wall,wall,startZ-1+up]) cylinder(d=boltHole, h=wall+2, $fn=circSteps);
      translate([wall,boxOuterWidth-wall,startZ-1+up]) cylinder(d=boltHole, h=wall+2, $fn=circSteps);            
      translate([boxOuterLength - wall,boxOuterWidth-wall,startZ-1+up]) cylinder(d=boltHole, h=wall+2, $fn=circSteps);
      
      // Counter sink
      translate([wall,wall,startZ+sinkDepth+up]) cylinder(d=sinkWidth, h=wall+2, $fn=circSteps);  
      translate([boxOuterLength - wall,wall,startZ+sinkDepth+up]) cylinder(d=sinkWidth, h=wall+2, $fn=circSteps);
      translate([wall,boxOuterWidth-wall,startZ+sinkDepth+up]) cylinder(d=sinkWidth, h=wall+2, $fn=circSteps);            
      translate([boxOuterLength - wall,boxOuterWidth-wall,startZ+sinkDepth+up]) cylinder(d=sinkWidth, h=wall+2, $fn=circSteps);
      
      // power cable holes
      translate([wall+(boxOuterLength*0.25), (boxOuterWidth/2), startZ+sinkDepth+up-1]) cylinder(d=walls, h=walls*2, $fn=circSteps);
      
      // camera cable
      translate([wall+(boxOuterLength*0.4), (boxOuterWidth/4), startZ+sinkDepth+up-1]) color([1,0,0]) cube([25, 5, wall+2]);
    }
  }
}

// The upper box which holds the computer parts
module upperBox() {
  computerBoxOuterLength = computerLength + walls + computerBoxPadding;
  computerBoxOuterWidth = computerWidth + walls + computerBoxPadding;
  computerBoxOuterHeight = computerHeight + wall;
  offsetX = (boxOuterLength - computerBoxOuterLength) / 2;
  offsetY = (boxOuterWidth - computerBoxOuterWidth) / 2;
  
  up=50;
    
  difference()
  {
    union()
    {
      translate([offsetX+wall,offsetY,startZ+up]) cube([computerBoxOuterLength-walls, wall, computerBoxOuterHeight]);
      translate([offsetX+wall,offsetY+computerBoxOuterWidth-wall,startZ+up]) cube([computerBoxOuterLength-walls, wall, computerBoxOuterHeight]);
      translate([offsetX, offsetY+wall, startZ+up]) cube([wall, computerBoxOuterWidth-walls, computerBoxOuterHeight]);
      translate([offsetX+computerBoxOuterLength-wall, offsetY+wall, startZ+up]) cube([wall, computerBoxOuterWidth-walls, computerBoxOuterHeight]);
      
      translate([offsetX+wall,offsetY+wall,startZ+up])
          cylinder(d=walls, h=computerBoxOuterHeight, $fn=circSteps);
      translate([offsetX+computerBoxOuterLength-wall,offsetY+wall,startZ+up])
          cylinder(d=walls, h=computerBoxOuterHeight, $fn=circSteps); 
      translate([offsetX+wall,offsetY+computerBoxOuterWidth-wall,startZ+up])
          cylinder(d=walls, h=computerBoxOuterHeight, $fn=circSteps); 
      translate([offsetX+computerBoxOuterLength-wall,offsetY+computerBoxOuterWidth-wall,startZ+up])
          cylinder(d=walls, h=computerBoxOuterHeight, $fn=circSteps);
    }
    union()
    {
      // Insert holes for the lid
      translate([offsetX+wall,offsetY+wall,startZ+computerBoxOuterHeight-walls+up])
          cylinder(d=insertHole, h=computerBoxOuterHeight, $fn=circSteps);
      translate([offsetX+computerBoxOuterLength-wall,offsetY+wall,startZ+computerBoxOuterHeight-walls+up])
          cylinder(d=insertHole, h=computerBoxOuterHeight, $fn=circSteps); 
      translate([offsetX+wall,offsetY+computerBoxOuterWidth-wall,startZ+computerBoxOuterHeight-walls+up])
          cylinder(d=insertHole, h=computerBoxOuterHeight, $fn=circSteps); 
      translate([offsetX+computerBoxOuterLength-wall,offsetY+computerBoxOuterWidth-wall,startZ+computerBoxOuterHeight-walls+up])
          cylinder(d=insertHole, h=computerBoxOuterHeight, $fn=circSteps);
      
      // Panel mount aerial connector
      translate([offsetX-1, offsetY+(computerBoxOuterWidth/2), startZ+30+up]) rotate([0,90,0]) cylinder(d=5.5, h=50, $fn=circSteps);
      
      // Panel mount aerial counter sink
      translate([offsetX+2, offsetY+(computerBoxOuterWidth/2), startZ+30+up]) rotate([0,90,0]) cylinder(d=12, h=6, $fn=circSteps);
      
      // hole for wires to Power switch
      translate([offsetX+(computerBoxOuterLength*0.25),offsetY-10,startZ+28+up]) rotate([0,90,90]) cylinder(d=8, h=250, $fn=circSteps); 
    }
  }
}

module computer() {
  offsetX = (boxOuterLength - computerLength) / 2;
  offsetY = (boxOuterWidth - computerWidth) / 2;
  translate([offsetX, offsetY, startZ]) color([1,1,0]) cube([computerLength, computerWidth, computerHeight]);
}

module servoPlate(x, rot) {
  zpos=-20;
  servoPlateRadius=30;
  difference()
  {
    union()
    {
      translate([wall+x,wall,zpos]) color([1,0,0]) cube([servoPlateWidth, servoPlateLength, servoPlateHeight]);
    }
    union()
    {   
      translate([wall+5+x,wall+35,zpos-1]) color([0,1,0]) cylinder(d=4,h=servoPlateHeight+2, $fn=circSteps);
      translate([wall+5+x,wall+75,zpos-1]) color([0,1,0]) cylinder(d=4,h=servoPlateHeight+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+x,wall+50,zpos-1]) color([0,1,0]) cylinder(d=4,h=servoPlateHeight+2, $fn=circSteps);
      translate([wall+servoPlateWidth-5+x,wall+60,zpos-1]) color([0,1,0]) cylinder(d=4,h=servoPlateHeight+2, $fn=circSteps);
    }
  }
}

module topLid() {
  computerBoxOuterLength = computerLength + walls + computerBoxPadding;
  computerBoxOuterWidth = computerWidth + walls + computerBoxPadding;
  computerBoxOuterHeight = computerHeight + wall;
  offsetX = (boxOuterLength - computerBoxOuterLength) / 2;
  offsetY = (boxOuterWidth - computerBoxOuterWidth) / 2;
  
  font = "Liberation Sans";
  
  posZ = startZ + computerHeight + wall + 50;
  difference()
  {
    union()
    {
      translate([midx, midy, posZ]) cylinder(r=boxOuterLength/2, h=wall, $fn=circSteps);
      translate([offsetX,offsetY+wall,posZ]) cube([computerBoxOuterLength,computerBoxOuterWidth-walls,wall]);
      translate([offsetX+wall,offsetY,posZ]) cube([computerBoxOuterLength-walls,computerBoxOuterWidth,wall]);
      
      translate([offsetX+wall,offsetY+wall,posZ])
          cylinder(d=walls, h=wall, $fn=circSteps);
      translate([offsetX+computerBoxOuterLength-wall,offsetY+wall,posZ])
          cylinder(d=walls, h=wall, $fn=circSteps); 
      translate([offsetX+wall,offsetY+computerBoxOuterWidth-wall,posZ])
          cylinder(d=walls, h=wall, $fn=circSteps); 
      translate([offsetX+computerBoxOuterLength-wall,offsetY+computerBoxOuterWidth-wall,posZ])
          cylinder(d=walls, h=wall, $fn=circSteps);
      
      translate([midx+30, midy-30, posZ-walls]) sphere(d=60);
      translate([midx+30, midy+30, posZ-walls]) sphere(d=60);
    }
    union()
    {
      translate ([midx-50, midy-40, posZ+wall-0.5]) rotate([0,0,90]) {
        linear_extrude(height = 3) {
          text("THORTOISE", font = font, size = 10);
        }
      }
      
      translate ([midx+18, midy-2.5, posZ+wall-0.5]) {
        linear_extrude(height = 3) {
          text("CHARGING", font = font, size = 5);
        }
      }

      translate ([midx-43, midy-12.5, posZ+wall-0.5]) {
        linear_extrude(height = 3) {
          text("POWER LEVEL", font = font, size = 5);
        }
      }
      translate([offsetX+wall,offsetY+wall,posZ-1])
          cylinder(d=boltHole, h=wall+2, $fn=circSteps);
      translate([offsetX+computerBoxOuterLength-wall,offsetY+wall,posZ-1])
          cylinder(d=boltHole, h=wall+2, $fn=circSteps); 
      translate([offsetX+wall,offsetY+computerBoxOuterWidth-wall,posZ-1])
          cylinder(d=boltHole, h=wall+2, $fn=circSteps); 
      translate([offsetX+computerBoxOuterLength-wall,offsetY+computerBoxOuterWidth-wall,posZ-1])
          cylinder(d=boltHole, h=wall+2, $fn=circSteps);
      
      translate([offsetX+wall,offsetY+wall,posZ+3])
          cylinder(d=sinkWidth, h=wall+2, $fn=circSteps);
      translate([offsetX+computerBoxOuterLength-wall,offsetY+wall,posZ+3])
          cylinder(d=sinkWidth, h=wall+2, $fn=circSteps); 
      translate([offsetX+wall,offsetY+computerBoxOuterWidth-wall,posZ+3])
          cylinder(d=sinkWidth, h=wall+2, $fn=circSteps); 
      translate([offsetX+computerBoxOuterLength-wall,offsetY+computerBoxOuterWidth-wall,posZ+3])
          cylinder(d=sinkWidth, h=wall+2, $fn=circSteps);

      // Slice off the bottom
      translate([midx, midy, posZ-50]) cylinder(r=boxOuterLength/2, h=50, $fn=30);

      // Slot for aerial wire
      translate([0, midy-halfWall, posZ-2]) cube([15, wall, wall+4]);

      // Eye insides
      translate([midx+30, midy-30, posZ-walls]) sphere(d=44);
      translate([midx+30, midy+30, posZ-walls]) sphere(d=44);

      // Eye LED holes
      translate([midx+30, midy-30, posZ+wall]) rotate([0,80,0]) cylinder(d=ledBezel, h=50, $fn=circSteps);
      translate([midx+30, midy+30, posZ+wall]) rotate([0,80,0]) cylinder(d=ledBezel, h=50, $fn=circSteps);
      // Countersink the eye LEDs
      translate([midx+47.2, midy-30, posZ+wall+8]) rotate([0,80,0]) cylinder(d=ledBezel*2.5, h=7, $fn=circSteps);
      translate([midx+47.2, midy+30, posZ+wall+8]) rotate([0,80,0]) cylinder(d=ledBezel*2.5, h=7, $fn=circSteps);
      // Charge LED
      translate([midx+10, midy, posZ-1]) cylinder(r=ledBezel/2, h=walls, $fn=circSteps);
      // Power LED 1
      translate([midx-0, midy, posZ-1]) cylinder(r=ledBezel/2, h=walls, $fn=circSteps);
      // Power LED 2
      translate([midx-10, midy, posZ-1]) cylinder(r=ledBezel/2, h=walls, $fn=circSteps);
      // Power LED 3
      translate([midx-20, midy, posZ-1]) cylinder(r=ledBezel/2, h=walls, $fn=circSteps);
      // Power LED 4
      translate([midx-30, midy, posZ-1]) cylinder(r=ledBezel/2, h=walls, $fn=circSteps);
      // Power LED 5
      translate([midx-40, midy, posZ-1]) cylinder(r=ledBezel/2, h=walls, $fn=circSteps);
    }
  }
}

module dome() {
  topZ = startZ + computerHeight + wall + 50;
  difference()
  {
    union()
    {
      translate([midx-halfWall, midy-halfWall, topZ-170]) color(c=[1,1,1],alpha=0.3) sphere(r=200);
    }
    union()
    {
      translate([midx-halfWall, midy-halfWall, topZ-172]) sphere(d=396);
      translate([-180,-180,-180]) cube([500,500,200]);
    }
  }
}

module brace(s) {
  topZ = startZ + computerHeight + wall + 50;
  
  translate([midx-halfWall, midy-halfWall, topZ]) color([0,1,1]) rotate([0,0,r]) cube([200, wall, 40]);
}

batteryHolder();
// batteryHolderRound();
// lid();
// upperBox();
// topLid();
// dome();


length=155;
width=110;
height=5;


difference()
{
    union()
    {
        translate([0,0,0]) cube([length, width, height]);
    }
    union()
    {
        translate([23,3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);        
        translate([23+19,3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
        
        translate([23,width-3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
        translate([23+19,width-3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
        
        
        translate([length-23,3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);        
        translate([length-(23+19),3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
        
        translate([length-23,width-3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
        translate([length-(23+19),width-3.5,-1]) cylinder(d=3.2, h=height+2, $fn=30);
    }
}

// Demo: Digital Puppet Animation
// alberto@acm.org @beto030 CC-BY-SA-NC 4.0

var start = 0.1; // Initial time offset

var idName = [
/* 0 */  "torso",
/* 1 */  "left_arm",
/* 2 */  "right_arm",
/* 3 */  "left_elbow",
/* 4 */  "right_elbow",
/* 5 */  "hip",
/* 6 */  "left_leg",
/* 7 */  "right_leg",
/* 8 */  "left_knee",
/* 9 */  "right_knee"
              ];

var idPivot = [
/* 0 */  "pivot_torso",
/* 1 */  "pivot_left_arm",
/* 2 */  "pivot_right_arm",
/* 3 */  "pivot_left_elbow",
/* 4 */  "pivot_right_elbow",
/* 5 */  "pivot_hip",
/* 6 */  "pivot_left_leg",
/* 7 */  "pivot_right_leg",
/* 8 */  "pivot_left_knee",
/* 9 */  "pivot_right_knee"
               ];


var action = [ // Sequence of angle displacements in time by joint member (Coming streaming data here!!)
/* 0-torso */ [ 5,   [0,4],  [-5,1]],
/* 1-l-arm */ [ 10,  [0,3.5],  [-75,1.5], [-10,1] ],
/* 2-r-arm */ [ 40,  [0,4],  [35,1] ],
/* 3-l-elb */ [ 40,  [65,0.5], [-65,0.3], [65,0.3], [-55,0.25], [55,0.25], [-65,0.2], [65,0.2], [-65,0.2], [65,0.2], [-55,0.2], [55,0.2], [-50,0.25], [50,0.25], [-90,2], [-15,1]  ],
/* 4-r-elb */ [ -10, [0,4],  [10,1] ],
/* 5-hip   */ [ -10, [0,4],  [10,1] ],
/* 6-l-leg */ [ 10,  [0,4],  [-10,1] ],
/* 7-r-leg */ [ -15, [0,4],  [10,1] ],
/* 8-l-kne */ [ ],
/* 9-r-kne */ [ -18, [0,4],  [18,1] ]
              ];


function round(n) { return Math.round(n*100.0)/100.0; }

svgDoc = null;

function init()
{
    var obj = document.getElementById('avatar');
    try {
        if (obj.getSVGDocument) {
            svgDoc = obj.getSVGDocument();
        } else {
            svgDoc =  obj.contentDocument;
        }
    }
    catch(exception) {
        alert('The GetSVGDocument interface is not supported');
    }

    for (var i=0; i < action.length; i++) // each joint
    {
        var d = action[i];
        var tam = d.length;
        if ( tam === 0 ) { // empty?
            continue; // ignore if empty
        }
        var angle = d[0]; // initial value
        var animate = svgDoc.getElementById(i); // animate
        var pivot = svgDoc.getElementById(idPivot[i]); // pivot
        var cx = 1*pivot.getAttribute("cx");
        var cy = 1*pivot.getAttribute("cy");

        var values = angle+" "+cx+" "+cy+";";
        var tot = 0;
        for (var j=1; j<tam; j++ ) // each pose ==> tot
        {
            switch ( d[j].length ) {
                case 1:
                    angle += d[j][0];
                    tot += 1; // default = 1s
                    break; // dur = default = 1s
                case 2:
                    angle += d[j][0];
                    tot   += d[j][1];
                    break;
                default:
                    console.log("BUG init(): numero de valores iniciales incorrecto");
            }
            values += (angle+" "+cx+" "+cy+";"); // (j+1>=tam?"":";"));
        } // for j

        var keyTimes = "0;"; // 0<x<1
        var dur = 0;
        for (var j=1; j<tam; j++ ) // each pose ==> keyTimes
        {
            switch ( d[j].length ) {
                case 1:
                    dur += 1; // default = 1s
                    break; // dur = default = 1s
                case 2:
                    dur += d[j][1];
                    break;
            }
            keyTimes += (round(dur/tot) + ";"); // (1.0*dur/tot + ";");
        } // for j
        keyTimes = keyTimes.substring(0, keyTimes.length - 1); //.2 BUG: Chrome fails if KeyTimes ends with ";"
        if (tot>0) {
            animate.setAttribute( "values",   values );
            animate.setAttribute( "keyTimes", keyTimes );
            animate.setAttribute( "begin",    start );
            animate.setAttribute( "dur",      round(tot) );
            //      console.log(animate);
        } else { // initial angle (empty sequence)
            var obj = svgDoc.getElementById(idName[i]); // joint group
            var trx = "rotate("+angle+","+cx+","+cy+")";
            obj.setAttribute("transform",trx); // initial rotate(angle,pivot)
            //      console.log(i+") "+idName[i]+" = "+trx);
        }
    } // for i
} // init

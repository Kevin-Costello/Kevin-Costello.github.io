// Framework Presented by Daniel Shiffman
// https://youtu.be/uWzPe_S-RVE

//Length
let r1 = 125;
let r2 = 125;

//Mass
let m1 = 10;
let m2 = 10;

//Angle
let a1 = 0;
let a2 = 0;

//Friction
let a1_v = 0;
let a2_v = 0;

//Gravity
let g = 1;

//Line
let px2 = -1;
let py2 = -1;
let cx, cy;

let buffer;
let colors = [];

var cnv;


function centerCanvas() {
  var x = (windowWidth - width) / 1.1;
  var y = 100;
  cnv.position(x, y);
}

function sizeCanvas() {
  var x2 = (windowWidth - width) / 1.5;
  var y2 = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
    

  colorMode(RGB, 255, 255, 255, 1);
  cnv = createCanvas(550, 600);
  cnv.parent("canvasHolder");
  //centerCanvas();
  pixelDensity(1);
  

  // Assign initial angles. First angle shouldnt be between 0-30 or 330-360 so we can get some decent swing each iteration.
  a1 = random(PI / 6, (11 * PI) / 6);
  a2 - random(0.01, PI - 0.001);
    
  cx = width / 2;
  cy = 300;
  
  colors = [
    color(229, 252, 255, 1),
    color(122, 79, 242, 0.7),
    color(230, 9, 116, 0.7),
    // BG
    color(20, 34, 51)
  ];
  
  buffer = createGraphics(width, height);
  buffer.background(colors[3]);
  buffer.translate(cx, cy);
  
  
}

function draw() {
  background(175);
  imageMode(CORNER);
  image(buffer, 0, 0, width, height);
  
  //Equations of motion for double pendulum
  //https://www.myphysicslab.com/pendulum/double-pendulum-en.html
  let num1 = -g * (2 * m1 + m2) * sin(a1);
  let num2 = -m2 * g * sin(a1 - 2 * a2);
  let num3 = -2 * sin(a1 - a2) * m2;
  let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
  let den = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
  let a1_a = (num1 + num2 + num3 * num4) / den;

  num1 = 2 * sin(a1 - a2);
  num2 = (a1_v * a1_v * r1 * (m1 + m2));
  num3 = g * (m1 + m2) * cos(a1);
  num4 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
  den = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
  let a2_a = (num1 * (num2 + num3 + num4)) / den;

  translate(cx, cy);
  stroke(colors[0]);
  strokeWeight(2);

  let x1 = r1 * sin(a1);
  let y1 = r1 * cos(a1);

  let x2 = x1 + r2 * sin(a2);
  let y2 = y1 + r2 * cos(a2);

  line(0, 0, x1, y1);
  fill(colors[0]);
  ellipse(x1, y1, m1, m1);

  line(x1, y1, x2, y2);
  fill(colors[0]);
  ellipse(x2, y2, m2, m2);

  a1_v += a1_a ;
  a2_v += a2_a ;

  a1_v *= 0.998;
  a2_v *= 0.998;

  a1 += a1_v ;
  a2 += a2_v ;
 

  buffer.stroke(0);
  if (frameCount > 1) {
    const trans = map(x2, (r1 + r2) * -1, r1 + r2, 0, 1);
    const lineColor = lerpColor(colors[1], colors[2], trans);
    buffer.stroke(lineColor);
    buffer.line(px2, py2, x2, y2);
  }

  px2 = x2;
  py2 = y2;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function windowResized() {
  //centerCanvas();
}

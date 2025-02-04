var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, 600 / 750, .1, 100000);

camera.position.z = 26;

var renderer = new THREE.WebGLRenderer();

renderer.setSize(600, 750);
renderer.setClearColor(0x008080, 1);
const div = document.getElementById("canvasHolder");
div.appendChild(renderer.domElement);


controls = new THREE.OrbitControls(camera, renderer.domElement);



var delta = 1/60;
var damping = .80;
var cylRad = .15;
var sphRad = .25;
var pegsGeom = new THREE.CylinderGeometry(cylRad, cylRad, 1.5, 8);
var pegMaterial = new THREE.MeshPhongMaterial( {color: 0x212121, ambient: 0x030303, specular: 0x008080, shininess: 30, shading: THREE.SmoothShading } );
var boardGeom = new THREE.BoxGeometry(.3, 16.5, 3);
var boardGeom2 = new THREE.BoxGeometry(10.2, .3, 3);
var boardGeom3 = new THREE.BoxGeometry(10.5, 16.5, .3);
var boardMaterial = new THREE.MeshPhongMaterial( {color: 0x414141, shading: THREE.SmoothShading} );
var slotGeom = new THREE.BoxGeometry(.2, 1, 3);
var slotMaterial = new THREE.MeshPhongMaterial( {color: 0x999999, reflectivity: 1, shininess: 30, shading: THREE.SmoothShading} );
var ballGeom = new THREE.SphereGeometry(sphRad, 16, 16);
var ballMaterial = new THREE.MeshPhongMaterial( {color: 0x999999, reflectivity: 1, shininess: 30, shading: THREE.SmoothShading} );
var woodTexture = new THREE.TextureLoader();
woodTexture.crossOrigin = null;
woodTexture = woodTexture.load( "../Pictures/wood.jpg" );
var woodMaterial = new THREE.MeshBasicMaterial( { map: woodTexture} );

var shiftedRight = true;
var pegRows = 13;
var pegCols = 9;
var pegs = [];
var slotNum = 6;
var slotHeight = 8;
var slots = [];
var movingBalls = [];
var boards = [];
var sidesHeight = 65;
var bottomWidth = 40;
var leftBoardEdges = [];
var rightBoardEdges = [];
var bottomBoardEdges = [];

/*********** Scene Lighting *************/
var ambientLight = new THREE.AmbientLight( 0x909090 );
scene.add( ambientLight );
var light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 1, 1, 1 );
scene.add( light );
/****************************************/

/********** Peg Orientation *************/
for (var i = 0; i < pegRows; i++) {
  shiftedRight = !shiftedRight;
  for (var j = 0; j < pegCols; j++) {
    var peg = new THREE.Mesh(pegsGeom, pegMaterial);
    peg.radius = cylRad;
    peg.position.y = (i-pegRows/2 + 1);
    peg.position.x = (j+(shiftedRight-pegCols+.5)/2);
    peg.rotation.x = Math.PI/2;
    scene.add(peg);
    pegs[i+j*pegRows] = peg;
  }
}
/****************************************/

/********** Slot Orientation ************/
for (var i = 0; i < slotNum; i++) {
  for(var j = 0; j < slotHeight; j++){
  var slot = new THREE.Mesh(pegsGeom, slotMaterial);
  slot.radius = cylRad;
  slot.position.y = (j * .25) - 9 ;
  slot.position.x = -3.7 + (i)*1.5;
  slot.rotation.x = Math.PI/2;
  scene.add(slot);
  slots[i + j*slotHeight] = slot;
  }
}
/****************************************/

/************** Borders *****************/
var leftBoard = new THREE.Mesh(boardGeom, boardMaterial);
leftBoard.position.x = -5.1;
leftBoard.position.y = -.9;
scene.add(leftBoard);
boards.push(leftBoard);

for (var i = 0; i < sidesHeight; i++) {
    var leftBoardEdge = new THREE.Mesh(pegsGeom, pegMaterial);
    leftBoardEdge.radius = cylRad;
    leftBoardEdge.position.y = -9 + (i)*.25;
    leftBoardEdge.position.x = -5.1;
    leftBoardEdge.rotation.x = Math.PI/2;
    scene.add(leftBoardEdge);
    leftBoardEdges[i] = leftBoardEdge;
  }

var rightBoard = new THREE.Mesh(boardGeom, boardMaterial);
rightBoard.position.x = 5.1;
rightBoard.position.y = -.9;
scene.add(rightBoard);
boards.push(rightBoard);

for (var i = 0; i < sidesHeight; i++) {
    var rightBoardEdge = new THREE.Mesh(pegsGeom, pegMaterial);
    rightBoardEdge.radius = cylRad;
    rightBoardEdge.position.y = -9 + (i)*.25;
    rightBoardEdge.position.x = 5.1;
    rightBoardEdge.rotation.x = Math.PI/2;
    scene.add(rightBoardEdge);
    rightBoardEdges[i] = rightBoardEdge;
  }

var bottomBoard = new THREE.Mesh(boardGeom2, boardMaterial);
bottomBoard.position.y = -9;
scene.add(bottomBoard);
boards.push(bottomBoard);

for (var i = 0; i < bottomWidth; i++) {
    var bottomBoardEdge = new THREE.Mesh(pegsGeom, pegMaterial);
    bottomBoardEdge.radius = cylRad;
    bottomBoardEdge.position.y = -9;
    bottomBoardEdge.position.x = -4.75 + (i)*.25;
    bottomBoardEdge.rotation.x = Math.PI/2;
    scene.add(bottomBoardEdge);
    bottomBoardEdges[i] = bottomBoardEdge;
  }

var backBoard = new THREE.Mesh(boardGeom3, woodMaterial);
backBoard.position.y = -.9;
backBoard.position.z = -1.5;
backBoard.position.z = -1.5;
scene.add(backBoard);
/****************************************/


/************ Ball On Click *************/
var createBall = function() {
  var ball = new THREE.Mesh(ballGeom, ballMaterial);
  ball.radius = sphRad;
  ball.position.y = 7.75; //Ball instaniates at set height above board
  ball.position.x = Math.random() * (4 - -4) + -4; //Position along board randomized
  ball.velocity = new THREE.Vector3(0.1, -8, 0);
  ball.acceleration = new THREE.Vector3(0, -9.1, 0);
  scene.add(ball);
  movingBalls.push(ball);
}
renderer.domElement.onclick = createBall; //Click To Make Ball
/****************************************/

/************* Ball Move ****************/
var move = function(moving) {
  var acc = moving.acceleration.clone();
  var vel = moving.velocity.clone();
  moving.velocity.add(acc.multiplyScalar(delta));
  moving.position.add(vel.multiplyScalar(delta)).add(acc.multiplyScalar(.5*delta));
  checkCollisions(moving, movingBalls.concat(pegs));
  checkCollisions(moving, movingBalls.concat(leftBoardEdges));
  checkCollisions(moving, movingBalls.concat(rightBoardEdges));
  checkCollisions(moving, movingBalls.concat(bottomBoardEdges));
  checkCollisions(moving, movingBalls.concat(slots));
    
}
/****************************************/


/********* Collision Checking ***********/
var checkCollisions = function(movobject, targets) {
  for (target in targets) {
    var displacementVector = movobject.position.clone().sub(targets[target].position); 
    //returns bounding box with same center and radius of ball and and subtracts its position by the position of the peg
    var excess = movobject.radius + targets[target].radius - displacementVector.length();
    if (excess > 0 && displacementVector.length() >0)  {
      movobject.velocity.reflect(displacementVector.normalize()).multiplyScalar(damping); 
      //reflected vector normal from peg
      movobject.position.add(displacementVector.setLength(excess));
    }
  }
}
/****************************************/


/************** 'Physics' ***************/
var physics = function(movingBalls) {
  for (ball in movingBalls) {
    move(movingBalls[ball]);
    //Remove balls from scene if they go off screen
    if(movingBalls[this.ball].position.y < -9) {
      removeObject(movingBalls[this.ball]);
      movingBalls.splice(this.ball, 1);
  }
  }  
}
/****************************************/


/********* Key Press Controller *********/
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var keyCode = event.which;
    
  //Remove balls from scene on 'q' press    
  if (keyCode == 81) {
      while (Infinity > movingBalls.length) {
        removeObject(movingBalls[0]);
        movingBalls.splice(movingBalls[0], 1);
      }
        
    }
  }
/****************************************/

/************ Remove Objects ************/
var removeObject = function(object) {
  object.geometry.dispose();
  object.material.dispose();
  scene.remove( object );
}
/****************************************/


var render = function() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  physics(movingBalls);
}

render();
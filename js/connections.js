
var WIDTH;
var HEIGHT;
var canvas;
var con;
var g;
var rint = 40;
var stars;
var delay = true;
var counter = 0;

var MAX_DISTANCE = 100;
var SPEED = 0.7;
var DENSITY = 0.08;
var SMALLEST_SIZE = 4;
var LARGEST_SIZE = 8;

setInterval(function () {
  ++counter;
  if (counter > 0) {
  	delay = false;
  }
}, 1000);

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var pxs = [];

$(document).ready(function(){

  bang(); // creating life

  $( window ).resize(function() {
    WIDTH = $('#space').width();
    $(canvas).attr('width', WIDTH).attr('height',WIDTH);
    stars = WIDTH * DENSITY;
  });


});

function bang() {
  WIDTH = $('#space').width();
  HEIGHT = $('#space').height();

  canvas = document.getElementById('space-content');
  $(canvas).attr('width', WIDTH).attr('height',HEIGHT);

  con = canvas.getContext('2d');
  stars = WIDTH * DENSITY;
  for(var i = 0; i < stars; i++) {
    pxs[i] = new Body(i);
  }
  draw();
}

function draw() {
  con.clearRect(0,0,WIDTH,HEIGHT);
  for(var i = 0; i < pxs.length; i++) {
    pxs[i].move();
    pxs[i].draw();
    pxs[i].connections = [];
    for(var j = 0 ; j < pxs.length; j++){
      if(j===i) continue;
      var dis = getDistance(pxs[i], pxs[j]);
      if(dis <= MAX_DISTANCE)
        connect(pxs[i], pxs[j], 1-dis/MAX_DISTANCE);
    }
  }
  window.requestAnimationFrame(draw);
}

function Body(id) {
  var x, y, r, dx, dy, dr, opacity;

  this.id = id;
  this.connections = [];

  this.createBug = function(){

  	x = (WIDTH*Math.random());
  	y = (HEIGHT*Math.random());
  	r = getRandomIn(SMALLEST_SIZE, LARGEST_SIZE);
  	planet = false;
  	dx = (Math.random() > 0.5 ? -1 : 1) * Math.random() * SPEED;
  	dy = (Math.random() > 0.5 ? -1 : 1) * Math.random() * SPEED;
  	dr = 0;
  	opacity = 1;
  };

  this.reset = function() {
      this.createBug();
  };

  this.draw = function() {

    con.beginPath();

    con.fillStyle = 'rgba(226,225,142,'+opacity+')';
    con.shadowColor   = 'rgba(226,225,142,1)';
    con.arc(x - r, y - r, r, 0, 2 * Math.PI, false);

    con.closePath();
    con.shadowOffsetX = 0;
    con.shadowOffsetY = 0;
    con.shadowBlur    = 10;
    con.fill();

  };

  this.move = function() {
    x += dx;
    y += dy;
    r += dr;
    if(r <= 0 || r > 30)
      opacity-=0.025;
    if(x > WIDTH || x < 0 || opacity <= 0 || r <= 0)
      dx*=-1;
    if(y > HEIGHT || y < 0)
      dy*=-1;
  };


  this.addConnection = function(body){
    this.connections.push(body);
  };

  this.getX = function() { return x; };
  this.getY = function() { return y; };
  this.getR = function() { return r; };


  this.reset();
}

var getRandomIn = function(bottom, top){
  return bottom + (Math.random())*(top - bottom);
};

var getDistance = function(current, other){
  return Math.sqrt(
    Math.pow(other.getX() - current.getX(), 2) +
    Math.pow(other.getY() - current.getY(), 2)
    );
};

var alreadyConnected = function(b1, b2){

  var already = b2.connections.some(function(b){
    return b.id == b1.id;
  });
  return already;

};

var connect = function(bug1, bug2, opacity){

  if(alreadyConnected(bug1, bug2))
    return;

  bug1.addConnection(bug2);

  con.beginPath();

  con.lineWidth = 1;
  con.strokeStyle = 'rgba(255,255,255,' + opacity + ')';
  con.moveTo(bug1.getX() - bug1.getR(), bug1.getY() - bug1.getR());
  con.lineTo(bug2.getX() - bug2.getR(), bug2.getY() - bug2.getR());
  con.stroke();

  con.closePath();
};

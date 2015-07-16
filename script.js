var width = window.innerWidth;//width of window and canvas
var height = window.innerHeight;//height of window and canvas

document.write('<canvas id="canvas" width="' + width + '" height="' + height + '"></canvas>'); //add canvas
var context = document.getElementById("canvas").getContext("2d");

//call loop after 15 milliseconds. updates objects and move them around
window.setInterval(function() { canvasLoop(); }, 15);
document.getElementById("canvas").addEventListener("click", mouse);

//array for circles
var circlesArray = [];

//find mouse push circles into circle array
function mouse(event) {
  circlesArray.push(new drawCircle(event.pageX, event.pageY));
}

//to stop them from moving, remove .loop()
function canvasLoop() {
  for (var i = 0; i<circlesArray.length; i++) {
    circlesArray[i].canvasLoop();
}

  //check collision. if collision, bounce off
  for (var i = 0; i - 1 < circlesArray.length - 1; i++) {
    for (var j = i + 1; j < circlesArray.length; j++) {
      if(circlesArray[i].hit(circlesArray[j])) {
        circlesArray[i].bounce(circlesArray[j]);
      }
    }
  }
  setStage();
}

//clear window + draw circle
function setStage() {
  //clear window
  context.clearRect(0, 0, width, height);
  for(var i = 0; i<circlesArray.length; i++) {
    circlesArray[i].setStage();
  }
}

function drawCircle(x,y) {
  //start
  this.x = x;
  this.y = y;
  //moves to
  this.moveX = 0;
  this.moveY = 0;
  this.radius = 30; //ball radius
  this.mass = 100; //for when they hit

  this.canvasLoop = function() {
    if (this.moveX > 0) {
      this.moveX = -0.05;
    }
    else if (this.moveX <0) {
      this.moveX = 0.05;
    }
    this.moveY += 0.5;//how fast the ball drops and bounces
    this.x += this.moveX;//move the circle
    this.y += this.moveY;//move the circle

    //when it hits the bottom, it bounces instead of falling through
    if (this.y + this.radius > height) {
        this.y = height - this.radius;
        this.moveY = -this.moveY; //ball keeps bouncing back to where it was dropped
      }
  };

  //draw circle. y updates every time the function is called so it moves up and down the canvas
  this.setStage = function() {
      context.fillStyle = "#006600";
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
  };

  //check for collision
  this.hit = function(second) {
      var twoBalls = this.radius + second.radius;
      //distance = square root of (x2-x1)^2 + (y2-y1)^2
      var distance = Math.sqrt(Math.pow(this.x - second.x, 2) + Math.pow(this.y - second.y, 2));
      //if distance between two balls is less than the diameter of the two balls, then they've collided
      if (distance <= twoBalls) {
        return true;
      }
      else {
        return false;
      }
  };

  //when collision happens
  this.bounce= function(second) {
    //distance between two circles
    var dist = Math.sqrt(Math.pow(this.x - second.x, 2) + Math.pow(this.y - second.y, 2));
    //find where they collide in terms of x, y
    var collideX = (second.x - this.x) / dist;
    var collideY = (second.y - this.y) / dist;
    //calc change in velocity of the first ball
    var vel = 2 * (this.moveX * collideX + this.moveY * collideY - second.moveX * collideX - second.moveY * collideY) / (this.mass + second.mass);
    this.moveX = this.moveX - vel * this.mass * collideX; //so that it goes across whole screen width
    this.moveY = this.moveY - vel * this.mass * collideY;
    second.moveX = second.moveX + vel * second.mass * collideX;
    second.moveY = second.moveY + vel * second.mass * collideY;
    //midpoint formula = (x1 + x2) / 2
    var midptX = (this.x + second.x) / 2;
    var midptY = (this.y + second.y) / 2;
    //calc x/y velocities of both balls post hit
    this.x = midptX + this.radius * (this.x - second.x) / dist;
    this.y = midptY + this.radius * (this.y - second.y) / dist;
    second.x = midptX + this.radius * (second.x - this.x) / dist;
    second.y = midptY + this.radius * (second.y - this.y) / dist;
  };
}

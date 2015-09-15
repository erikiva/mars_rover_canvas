var console = {
  log: function(msg) {
        var para = document.createElement("p");
        var t = document.createTextNode(msg);
        var msgs = document.getElementById("messages");
        para.appendChild(t); 
                                                 // Append the text to <p>
        msgs.appendChild(para); 
        msgs.scrollTop = msgs.scrollHeight; 
  }
}

function Rover(position, direction, name, grid) {
  if (grid.setObstacle(position, 'r')) {
    this.position = position;
    this.direction = direction;
    this.name = name;
    this.grid = grid;
   } else { throw "Unable to place robot on that position"
  }
}

function Grid(SN, WE){
  
  this.grid = new Array(SN);
  for (var i = 0; i < SN; i++) {
    this.grid[i] = new Array(WE);
  }
  this.height = SN;
  this.width = WE;

}

Grid.prototype.setObstacle = function(coordinates, type) {
  
  if (this.grid[coordinates[0]][coordinates[1]]){
    console.log("Invalid position");
    return false;
  } else {
    this.grid[coordinates[0]][coordinates[1]] = type;
    return true;
  }
}

Grid.prototype.moveObstacle = function(oldPos, newPos){
  if (this.validatePosition(newPos) && !this.validatePosition(oldPos) ){
    this.grid[newPos[0]][newPos[1]] = this.grid[oldPos[0]][oldPos[1]];
    this.grid[oldPos[0]][oldPos[1]] = '';
    
    return true;
  } else {
    return false;
  }

}

Rover.prototype.move = function(squares){
  var newPos = [this.position[0], this.position[1]];
  switch(this.direction) {
    case 'N':
      newPos[0] += squares
      break;
    case 'E':
      newPos[1] += squares
      break;
    case 'S':
      newPos[0] -= squares
      break;
    case 'W':
      newPos[1] -= squares
      break;
  };
  this.grid.correctPosition(newPos);
  if (this.grid.moveObstacle(this.position, newPos)) {
    this.position = newPos;
    console.log("New Position for " + this.name + " : [" + this.position[0] + ", " + this.position[1] + "]");
    return true;
  } else {
    console.log("Obstacle in position [" + newPos[0] + ", " + newPos[1] +"] Unable to continue");
    return false;
  }

}

Rover.prototype.goForward = function() {
  return this.move(1);
  
}

Rover.prototype.goBack= function() {
  return this.move(-1);

}

Rover.prototype.turnRight = function() {
  switch(this.direction) {
    case 'N':
      this.direction = 'E'
      break;
    case 'E':
      this.direction = 'S'
      break;
    case 'S':
      this.direction = 'W'
      break;
    case 'W':
      this.direction = 'N'
      break;
  };

  console.log("New Direction for " + this.name + ": [" + this.direction  + "]")
}

Rover.prototype.turnLeft = function() {
  switch(this.direction) {
    case 'N':
      this.direction = 'W'
      break;
    case 'E':
      this.direction = 'N'
      break;
    case 'S':
      this.direction = 'E'
      break;
    case 'W':
      this.direction = 'S'
      break;
  };

  console.log("New Rover Direction: [" + this.direction  + "]")
}

Rover.prototype.moveAlong = function(sequence) {

  loop:
  for (var i = 0, len = sequence.length; i < len; i++) {
    switch(sequence[i]){
      case 'f':
        if (!this.goForward()) break loop;
        break;
      case 'b':
        if (!this.goBack())  break loop;
        break;
      case 'l':
        this.turnLeft();
        break;
      case 'r':
        this.turnRight();
        break;
    }
  }

  console.log("Current Direction for " + this.name + ": [" + this.direction  + "]", 
    "Current Position for " + this.name + ": [" + this.position[0] + ", " + this.position[1] + "]")
}

Grid.prototype.correctPosition = function (newPos){
    if (newPos[0] < 0) newPos[0] = this.height + newPos[0];
    else if (newPos[0] > this.height - 1) newPos[0] = newPos[0] - this.height;

    if (newPos[1] < 0) newPos[1] = this.width + newPos[1];
    else if (newPos[1] > this.width - 1) newPos[1] = newPos[1] - this.width;

}

Grid.prototype.validatePosition = function (newPos){
  if (this.grid[newPos[0]][newPos[1]]){
    return false;
  }   
  return true;
} 

var a_canvas = document.getElementById("a");
    var a_context = a_canvas.getContext("2d");

    var grid = new Grid(10,10);

    function drawGrid(grid){
      a_canvas.width = a_canvas.width;
      a_context.setTransform(1, 0, 0, -1, 0, 501)
      for (var x = 0.5; x < 501; x += 50) {
        a_context.moveTo(x, 0);
        a_context.lineTo(x, 501);
      } for (var y = 0.5; y < 501; y += 50) {
        a_context.moveTo(0, y);
        a_context.lineTo(501, y);
      }

      a_context.strokeStyle = "#eee";
      a_context.stroke();


      for (var i = 0; i < grid.width; i++){
        for (var j = 0; j < grid.height; j++){
          switch (grid.grid[i][j]){
            case 'x':
            a_context.fillStyle = "#333";
            a_context.fillRect(50*j, 50*i, 50, 50);
            break;
            case 'r':
            var directions = {
              N: '\u25BC',
              S: '\u25B2',
              E: '\u25B6',
              W: '\u25C0',
            }
            var symbol = directions[walle.direction]
            a_context.font = "bold 40px sans-serif";
            a_context.fillStyle = "#666699";
            a_context.fillText(symbol, 50*j+10, 50*i+40);
            //a_context.fillRect(50*j, 50*i, 50, 50);
            break;
          }
        }
      }

    }

    walle = new Rover([0,0], 'N', "Wall-E", grid);
    drawGrid(grid);
    // Add event listener for `click` events.
    a_canvas.addEventListener('click', function(event) {
        var x = Math.floor(event.offsetX/50),
            y = Math.floor((500 - event.offsetY)/50);
            grid.setObstacle([y,x], 'x');
            drawGrid(grid);

        console.log(x+" "+y);

    }, false);

    window.addEventListener('keydown', function(event) {
      switch (event.keyCode) {
        case 37: // Left
          walle.turnLeft();
        break;

        case 38: // Up
          walle.goForward();
        break;

        case 39: // Right
          walle.turnRight();
        break;

        case 40: // Down
          walle.goBack();
        break;
      }
      drawGrid(grid);
    }, false);


    drawGrid(grid);


var Sprite = function(){
  this.width=10;
  this.height=5;
  this.font_aspect_ratio = 0.5309734513274337; // courier aspect ratio
  this.frames = [];
}
var cell_height = 100; // height in pixels
var cell_width = cell_height * font_aspect_ratio;
var offset_x = 15;
var offset_y = 20;

var checker_img = new Image();
checker_img.src = './img/checker.png';
function drawDataToContext(context, cell_data, selected_cell){
  // clear
  context.fillStyle = context.createPattern(checker_img, 'repeat');;
  context.fillRect(0,0,800,600)

  // draw text
  var font_size = cell_height*2/3 - 0.059;  // font-size in pt
  context.font = "normal " + font_size + "pt Courier";
  context.textBaseline="top";
  context.textAligh="left";

  for(var i=0;i<grid_height;i++){
    cell_data.push([]);
    for(var j=0;j<grid_width;j++){
      if(cell_data[i][j] !== null){
        context.fillStyle = cell_data[i][j].bg_color;
        context.fillRect(offset_x + j*cell_width, offset_y + i*cell_height, cell_width, cell_height);
        context.fillStyle = cell_data[i][j].fg_color;
        context.fillText(cell_data[i][j].value, offset_x + j*cell_width, offset_y + i*cell_height);
      }
    }
  }

  // draw gridlines

  context.lineWidth="1";
  context.strokeStyle="#333";
  for(var i=0;i<=grid_width*cell_width + 0.01;i = i + cell_width){
    context.beginPath();
    context.moveTo(offset_x + i, offset_y + 0);
    context.lineTo(offset_x + i, offset_y + cell_height*grid_height);
    context.stroke();
  }

  for(var i=0;i<=grid_height*cell_height;i = i + cell_height){
    context.beginPath();
    context.moveTo(offset_x + 0, offset_y + i);
    context.lineTo(offset_x + cell_height*font_aspect_ratio*grid_width, offset_y + i);
    context.stroke();
  }

  if(selected_cell !== null){
    context.beginPath();
    context.strokeStyle="red";
    context.lineWidth="2";
    context.rect(offset_x + selected.x*cell_width, offset_y + selected.y*cell_height, cell_width, cell_height);
    context .stroke();
  }
}

var cells;

function initCells(){
    cells = [];
    for(var i=0;i<grid_height;i++){
      cells.push([]);
      for(var j=0;j<grid_width;j++){
        cells[i].push(null);
      }
    }
}

function setCell(row, col, value, fg_color, bg_color){
  if(value == null){
    cells[row][col] = null;
    return;
  }
  cells[row][col] = {
    value: value,
    fg_color: fg_color,
    bg_color: bg_color
  };
}


var isDragging = false;

$(function(){

  //setup callbacks
  $("#editorCanvas").mousedown(mousedown);
  $("#editorCanvas").mousemove(mousemove);
  $("#editorCanvas").mouseup(mouseup);
  $("body").keypress(keypress);
  $("body").keyup(keypress);

  // initialize
  initCells();
  draw();
});

function clamp(val, min, max){
  return Math.max(Math.min(val, max), min);
}

// cellLoc {x: x, y: y}
function getNextCellLoc(cellLoc){
  var nextCell = {};
  if(cellLoc.x < grid_width - 1 || cellLoc.y === grid_height - 1){
    nextCell.x = clamp(cellLoc.x + 1, 0, grid_width-1);
    nextCell.y = cellLoc.y;
  }else{
    nextCell.x = 0;
    nextCell.y = clamp(cellLoc.y + 1, 0, grid_height-1);
  }
  return nextCell;
}

// cellLoc {x: x, y: y}
function getPrevCellLoc(cellLoc){
  var nextCell = {};
  if(cellLoc.x > 0 || cellLoc.y === 0){
    nextCell.x = clamp(cellLoc.x - 1, 0, grid_width-1);
    nextCell.y = cellLoc.y;
  }else{
    nextCell.x = grid_width - 1;
    nextCell.y = clamp(cellLoc.y - 1, 0, grid_height-1);
  }
  return nextCell;
}

// ui state

var selected = null; // {x: x, y: y}

function draw(){
    var canvas = document.getElementById("editorCanvas");
    var context = canvas.getContext('2d');
    drawDataToContext(context, cells, selected);
}

var mousedown = function(e){
  isDragging = false;
};

var mousemove = function(e){
  if(e.buttons === 1){
    isDragging = true;
    offset_x += e.originalEvent.movementX;
    offset_y += e.originalEvent.movementY;
    draw();
  }
};

var mouseup = function(e){
  if(!isDragging){
    console.log(e.offsetX);
    var col = clamp(Math.floor((e.offsetX - offset_x) / cell_width), 0, grid_width-1);
    var row = clamp(Math.floor((e.offsetY - offset_y) / cell_height), 0, grid_height-1);
    selected = {x: col, y: row};
    draw();
  }else{
    isDragging = false;
  }
};


var keypress = function(e){
  if (e.type === "keypress" && e.which >= 32) {
    var fgColor = document.getElementById("fgColor");
    var bgColor = document.getElementById("bgColor");
    setCell(selected.y, selected.x, String.fromCharCode(e.charCode), fgColor.value, bgColor.value);
    selected = getNextCellLoc(selected);
    draw();
  }
  if(e.type === "keyup"){
    if(e.which == 8){ // backspace
      setCell(selected.y, selected.x, null);
      selected = getPrevCellLoc(selected);
      draw();
    }
    if(e.which == 46) { // delete
      setCell(selected.y, selected.x, null);
      selected = getNextCellLoc(selected);
      draw();
    }
    if(e.which === 38){ // up
      selected.y = clamp(selected.y - 1, 0, grid_height-1);
      draw();
    }
    if(e.which === 37){ // right
      selected.x = clamp(selected.x - 1, 0, grid_width-1);
      draw();
    }
    if(e.which === 40){ // down
      selected.y = clamp(selected.y + 1, 0, grid_height-1);
      draw();
    }
    if(e.which === 39){ // left
      selected.x = clamp(selected.x + 1, 0, grid_width-1);
      draw();
    }
  }
};

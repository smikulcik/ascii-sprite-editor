
var font_aspect_ratio = 0.5309734513274337; // courier aspect ratio

var checker_img = new Image();
checker_img.src = './img/checker.png';

var Editor = function(context, sprite){
  this.cell_height = 100; // height in pixels
  this.cell_width = this.cell_height * font_aspect_ratio;
  this.offset_x = 15;
  this.offset_y = 20;
  this.context = context;
  this.sprite = sprite
  this.selected = {x: 0, y: 0};
};

Editor.prototype.clear = function(){
    // clear
    this.context.fillStyle = this.context.createPattern(checker_img, 'repeat');;
    this.context.fillRect(0,0,800,600)
};

Editor.prototype.drawOverlays = function(){
    this.context.lineWidth="1";
    this.context.strokeStyle="#333";
    for(var i=0;i<=this.sprite.width*this.cell_width + 0.01;i = i + this.cell_width){
      this.context.beginPath();
      this.context.moveTo(this.offset_x + i, this.offset_y + 0);
      this.context.lineTo(this.offset_x + i, this.offset_y + this.cell_height*this.sprite.height);
      this.context.stroke();
    }

    for(var i=0;i<=this.sprite.height*this.cell_height;i = i + this.cell_height){
      this.context.beginPath();
      this.context.moveTo(this.offset_x + 0, this.offset_y + i);
      this.context.lineTo(this.offset_x + this.cell_height*font_aspect_ratio*this.sprite.width, this.offset_y + i);
      this.context.stroke();
    }

    if(this.selected !== null){
      this.context.beginPath();
      this.context.strokeStyle="green";
      this.context.lineWidth="2";
      this.context.rect(this.offset_x + this.selected.x*this.cell_width, this.offset_y + this.selected.y*this.cell_height, this.cell_width, this.cell_height);
      this.context.stroke();
    }
};

Editor.prototype.draw = function(){
  this.clear();
  this.sprite.draw(this.context, this.sprite.curFrame, this.offset_x, this.offset_y, this.cell_width, this.cell_height);
  this.drawOverlays();
};

Editor.prototype.select = function(row, col){
  this.selected = {x: col, y: row};
};

// cellLoc {x: x, y: y}
Editor.prototype.selectNextLoc = function(){
  if(this.selected.x < this.sprite.width - 1 || this.selected.y === this.sprite.height - 1){
    this.selected.x = clamp(this.selected.x + 1, 0,  this.sprite.width-1);
  }else{
    this.selected.x = 0;
    this.selected.y = clamp(this.selected.y + 1, 0,  this.sprite.height-1);
  }
};

// cellLoc {x: x, y: y}
Editor.prototype.selectPrevLoc = function(){
  if(this.selected.x > 0 || this.selected.y === 0){
    this.selected.x = clamp(this.selected.x - 1, 0,  this.sprite.width-1);
  }else{
    this.selected.x = this.sprite.width - 1;
    this.selected.y = clamp(this.selected.y - 1, 0,  this.sprite.height-1);
  }
};

var Sprite = function(){
  this.width=10;
  this.height=5;
  this.frames = [];

  this.frames.push(
    this.newFrame() //create initial frame
  );
  this.curFrame = 0;

  this.animator;
};

Sprite.prototype.newFrame = function(){
  var frame = [];
  for(var i=0;i<this.height;i++){
    frame.push([]);
    for(var j=0;j<this.width;j++){
      frame[i].push(null);
    }
  }
  return frame;
};

Sprite.prototype.insertFrame = function(){
  var newFrame = JSON.parse(JSON.stringify(this.frames[this.curFrame]));
  this.frames.splice(this.curFrame+1, 0, newFrame);
}

Sprite.prototype.draw = function(context, frame_idx, offset_x, offset_y, cell_width, cell_height){
  var font_size = cell_height*2/3 - 0.059;  // font-size in pt
  context.font = "normal " + font_size + "pt Courier";
  context.textBaseline="top";
  context.textAligh="left";

  for(var i=0;i<this.height;i++){
    for(var j=0;j<this.width;j++){
      if(this.frames[frame_idx][i][j] !== null){
        context.fillStyle = this.frames[frame_idx][i][j].bg_color;
        context.fillRect(offset_x + j*cell_width, offset_y + i*cell_height, cell_width, cell_height);
        context.fillStyle = this.frames[frame_idx][i][j].fg_color;
        context.fillText(this.frames[frame_idx][i][j].value, offset_x + j*cell_width, offset_y + i*cell_height);
      }
    }
  }
};

Sprite.prototype.setCell = function(row, col, value, fg_color, bg_color){
  var frame = this.frames[this.curFrame];
  if(value == null){
    frame[row][col] = null;
    return;
  }
  frame[row][col] = {
    value: value,
    fg_color: fg_color,
    bg_color: bg_color
  };
};

Sprite.prototype.play = function(){
  this.stop()
  var spr = this;
  this.animator = setInterval(function(){
    spr.curFrame = (spr.curFrame + 1) % spr.frames.length;
    drawAll();
  }, 250);
}
Sprite.prototype.stop = function(){
  clearInterval(this.animator)
}


var FrameSelector = function(context, sprite){
  this.context = context;
  this.sprite = sprite;
  this.offset_y = 0;

  this.frame_width = 100;
  this.cell_width = this.frame_width/this.sprite.width;
  this.cell_height = this.cell_width/font_aspect_ratio;
  this.frame_height = this.cell_height*this.sprite.height;
}

FrameSelector.prototype.draw = function(){
  this.context.fillStyle = this.context.createPattern(checker_img, 'repeat');;
  this.context.fillRect(0,0,100,400)

  for(var i=0;i<this.sprite.frames.length;i++){
    this.sprite.draw(this.context, i, 0, this.offset_y + i*(this.frame_height + 10), this.cell_width, this.cell_height);
    if(i === this.sprite.curFrame){
      this.context.beginPath();
      this.context.strokeStyle="green";
      this.context.lineWidth="2";
      this.context.rect(0, this.offset_y + i*(this.frame_height + 10), this.frame_width, this.frame_height);
      this.context.stroke();
    }else{

        this.context.beginPath();
        this.context.strokeStyle="grey";
        this.context.lineWidth="2";
        this.context.rect(0, this.offset_y + i*(this.frame_height + 10), this.frame_width, this.frame_height);
        this.context.stroke();
    }
  }
};

FrameSelector.prototype.select = function(idx){
  this.sprite.curFrame = idx;
}


function clamp(val, min, max){
  return Math.max(Math.min(val, max), min);
}


// ui
var editor;
var sprite;
var frameSelector;

$(function(){

  //setup callbacks
  $("#editorCanvas").mousedown(mousedown);
  $("#editorCanvas").mousemove(mousemove);
  $("#editorCanvas").mouseup(mouseup);
  $("body").keypress(keypress);
  $("body").keyup(keypress);
  $("#insertFrame").click(function(){sprite.insertFrame();drawAll();});
  $("#frameSelectorCanvas").mousedown(framemousedown);
  $("#frameSelectorCanvas").mousemove(framemousemove);
  $("#frameSelectorCanvas").mouseup(framemouseup);
  $("#playBtn").click(function(){sprite.play();});
  $("#stopBtn").click(function(){sprite.stop();});

  // initialize
  var canvas = document.getElementById("editorCanvas");
  var context = canvas.getContext('2d');
  sprite = new Sprite();
  editor = new Editor(context, sprite);

  var frameSelectorCtx = document.getElementById("frameSelectorCanvas").getContext('2d');
  frameSelector = new FrameSelector(frameSelectorCtx, sprite);

  drawAll();
});

function drawAll(){
  editor.draw();
  frameSelector.draw();
}

var isDragging = false;
var mousedown = function(e){
  isDragging = false;
};

var mousemove = function(e){
  if(e.buttons === 1){
    isDragging = true;
    editor.offset_x += e.originalEvent.movementX;
    editor.offset_y += e.originalEvent.movementY;
    drawAll()
  }
};

var mouseup = function(e){
  if(!isDragging){
    var col = clamp(Math.floor((e.offsetX - editor.offset_x) / editor.cell_width), 0, editor.sprite.width-1);
    var row = clamp(Math.floor((e.offsetY - editor.offset_y) / editor.cell_height), 0, editor.sprite.height-1);
    editor.select(row, col);
    drawAll()
  }else{
    isDragging = false;
  }
};


var keypress = function(e){
  if (e.type === "keypress" && e.which >= 32) {
    var fgColor = document.getElementById("fgColor");
    var bgColor = document.getElementById("bgColor");
    editor.sprite.setCell(editor.selected.y, editor.selected.x, String.fromCharCode(e.charCode), fgColor.value, bgColor.value);
    editor.selectNextLoc();
    drawAll()
  }
  if(e.type === "keyup"){
    if(e.which == 8){ // backspace
      editor.sprite.setCell(editor.selected.y, editor.selected.x, null);
      editor.selectPrevLoc();
      drawAll()
    }
    if(e.which == 46) { // delete
      editor.sprite.setCell(editor.selected.y, editor.selected.x, null);
      editor.selectNextLoc();
      drawAll()
    }
    if(e.which === 38){ // up
      editor.selected.y = clamp(editor.selected.y - 1, 0, editor.sprite.height-1);
      drawAll()
    }
    if(e.which === 37){ // right
      editor.selected.x = clamp(editor.selected.x - 1, 0, editor.sprite.width-1);
      drawAll()
    }
    if(e.which === 40){ // down
      editor.selected.y = clamp(editor.selected.y + 1, 0, editor.sprite.height-1);
      drawAll()
    }
    if(e.which === 39){ // left
      editor.selected.x = clamp(editor.selected.x + 1, 0, editor.sprite.width-1);
      drawAll()
    }
  }
};


var frameisDragging = false;
var framemousedown = function(e){
  frameisDragging = false;
};

var framemousemove = function(e){
  if(e.buttons === 1){
    frameisDragging = true;
    frameSelector.offset_y = clamp(frameSelector.offset_y + e.originalEvent.movementY, Math.min(400 - sprite.frames.length*(frameSelector.frame_height + 10) + 10, 0), 0);
    frameSelector.draw();
  }
};

var framemouseup = function(e){
  if(!frameisDragging){
    var row = clamp(Math.floor((e.offsetY - frameSelector.offset_y) / 110), 0, sprite.frames.length-1);
    frameSelector.select(row);
    drawAll();
  }else{
    frameisDragging = false;
  }
};

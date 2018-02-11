function Flower (def_x, def_y, horiz_, length_) {
  var base_petal;
  var petal_num;
  var rotate_val;
  var petal_layers = random(3, 6);
  var petal_seed = int(random(4, 9));
  var col = color(random(0, 255), random(0, 255), random(0, 255));
  var end_col = color(random(0, 255), random(0, 255), random(0, 255));
  
  this.disp = () => {
    console.log("Draw start");
    for (var j = 1; j < petal_layers; j++) {
      petal_num = fib(petal_seed);
      petal_seed -= 1;
      if (petal_num <= 1) { petal_num = 2 };
      rotate_val = 360.00 / petal_num;
      col = lerpColor(col, end_col, j / petal_layers);
      end_col = color(random(0, 255), random(0, 255), random(0, 255));
      length_ -= (length_ / petal_layers);
      base_petal = new Petal(def_x, def_y, random(10, 50), length_, col, end_col);
      for (var i = 0; i <= petal_num; i++){
        push();
        rotate(radians(rotate_val * i));
        translate(def_x, def_y - length_/2);
        base_petal.disp();
        pop();
      }
      console.log("Petal " + j + "/" + int(petal_layers) + " drawn");
    }
    console.log("Flower drawn");
  }
}

function Petal (center_x, center_y, horizontal_offset, length_, fill_col, end_col) {
  var control_x = random(100, 300);
  var control_y = random(center_y - length_, center_y + length_);
  var top_off = random(0, 10);
  
  this.disp = () => {
    var grads = 10;
    noStroke();
    for (var j = grads; j > 0; j--) {
      fill(lerpColor(end_col, fill_col, j / grads));
      beginShape();
      vertex(center_x - horizontal_offset, center_y + length_);
      bezierVertex(center_x, (center_y + length_), center_x, (center_y + length_), center_x + horizontal_offset, center_y + length_);
      bezierVertex(center_x + control_x, control_y, center_x + control_x, control_y, center_x + top_off, center_y - (length_ / grads * j));
      bezierVertex(center_x + top_off, center_y - (length_ / grads * j) - top_off, center_x - top_off, center_y - (length_ / grads * j) - top_off, center_x - top_off, center_y - (length_ / grads * j));
      bezierVertex(center_x - control_x, control_y, center_x - control_x, control_y, center_x - horizontal_offset, center_y + length_);
      endShape();
     }
  }

}

function fib (n) {
  var temp_a;
  var a = 1;
  var b = 0;
  
  for (var i = 0; i < n; i ++) {
    temp_a = a;
    a += b;
    b = temp_a;
  }
  
  return a;
}

function setup() {
  var canvas = createCanvas(document.getElementById('flower-area').offsetWidth, document.getElementById('flower-area').offsetHeight);
  canvas.parent('flower-area');
  blendMode(LIGHTEST);
  flower = new Flower(0, 0, 20, canvas.height/2 - 100);
  push();
  translate(canvas.width/2, canvas.height/2);
  flower.disp();
  pop();
}

function new_flow () {
  clear();
  flower = new Flower(0, 0, 20, canvas.height/2 - 100);
  push();
  translate(canvas.width/2, canvas.height/2);
  flower.disp();
  pop();
}

function draw() {
  new_flower.onclick = (ev) => {
    new_flow();
  }
  save_flower.onclick = (ev) => {
    save("flower.png");
  }
}
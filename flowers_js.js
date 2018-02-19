var graphics_arr = new Array();
var flower_arr = new Array();
var cur_buffer = -1;
var text_ = '';

function Flower (def_x, def_y, horiz_, length_, graphics_buffer) {
  var base_petal;
  var petal_num;
  var rotate_val;
  var petal_layers = random(3, 6);
  var petal_seed = int(random(4, 9));
  var col = color(random(0, 255), random(0, 255), random(0, 255));
  var end_col = color(random(0, 255), random(0, 255), random(0, 255));
  
  this.disp = () => {
    graphics_buffer.beginShape();
    for (var j = 1; j < petal_layers; j++) {
      petal_num = fib(petal_seed);
      petal_seed -= 1;
      if (petal_num <= 1) { petal_num = 2 };
      rotate_val = 360.00 / petal_num;
      col = lerpColor(col, end_col, j / petal_layers);
      end_col = color(random(0, 255), random(0, 255), random(0, 255));
      length_ -= (length_ / petal_layers);
      base_petal = new Petal(def_x, def_y, random(10, 50), length_, col, end_col, graphics_buffer);
      for (var i = 0; i <= petal_num; i++){
        graphics_buffer.push();
        graphics_buffer.rotate(radians(rotate_val * i));
        graphics_buffer.translate(def_x, def_y - length_/2);
        base_petal.disp();
        graphics_buffer.pop();
      }
    }
    graphics_buffer.endShape();
  }
}

function Petal (center_x, center_y, horizontal_offset, length_, fill_col, end_col, graphics_buffer) {
  var control_x = random(100, 300);
  var control_y = random(center_y - length_, center_y + length_);
  var top_off = random(0, 10);
  
  this.disp = () => {
    var grads = 10;
    graphics_buffer.noStroke();
    for (var j = grads; j > 0; j--) {
      graphics_buffer.fill(lerpColor(end_col, fill_col, j / grads));
      graphics_buffer.beginShape();
      graphics_buffer.vertex(center_x - horizontal_offset, center_y + length_);
      graphics_buffer.bezierVertex(center_x, center_y + length_, center_x, center_y + length_, center_x + horizontal_offset, center_y + length_);
      graphics_buffer.bezierVertex(center_x + control_x, control_y, center_x + control_x, control_y, center_x + top_off, center_y - (length_ / grads * j));
      graphics_buffer.bezierVertex(center_x + top_off, center_y - (length_ / grads * j) - top_off, center_x - top_off, center_y - (length_ / grads * j) - top_off, center_x - top_off, center_y - (length_ / grads * j));
      graphics_buffer.bezierVertex(center_x - control_x, control_y, center_x - control_x, control_y, center_x - horizontal_offset, center_y + length_);
      graphics_buffer.endShape();
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

function new_flow () {
  var length = (37 * min(canvas.height, canvas.width)) / 100;
  var buff_size = 256;
  var new_buff = createGraphics(buff_size, buff_size);
  graphics_arr.push(new_buff);
  cur_buffer += 1;
  buffer = graphics_arr[cur_buffer];
  buffer.blendMode(LIGHTEST);
  var flower = new Flower(0, 0, (15 * length) / 100,  length, buffer);
  buffer.push();
  let size = min(buff_size / canvas.height, buff_size / canvas.width);
  buffer.scale(size, size);
  buffer.translate(canvas.width / 2, canvas.height / 1.5);
  flower.disp();
  buffer.pop();
  let pos_y = 0;
  let pos_x = 0;
  let failed_attempts = 0;
  while (true) {
  	let good_pos = true;
  	let height_offset = canvas.height / 1.5;
  	let width_offset = canvas.width * 0.4;
  	pos_y = random(-32, height_offset - 128);
  	pos_x = random(width_offset, canvas.width - 256);
  	for (i in flower_arr) {
  		past_flow_x = flower_arr[i].x;
  		past_flow_y = flower_arr[i].y;

  		let x1 = past_flow_x + 64;
  		let x2 = past_flow_x + 192;
  		let y1 = past_flow_y + 32;
  		let y2 = past_flow_y + 192;

  		let test_x1 = pos_x + 64;
  		let test_x2 = pos_x + 192;
  		let test_y1 = pos_y + 32;
  		let test_y2 = pos_y + 192;
  		
  		/*fill(255);

  		ellipse(x1, y1, 10, 10);
  		ellipse(x2, y1, 10, 10);
  		ellipse(x1, y2, 10, 10);
  		ellipse(x2, y2, 10, 10);

  		fill(100);

  		ellipse(test_x1, test_y1, 10, 10);
  		ellipse(test_x2, test_y1, 10, 10);
  		ellipse(test_x1, test_y2, 10, 10);
  		ellipse(test_x2, test_y2, 10, 10);*/

  		if ((x1 <= test_x2) && (test_x1 <= x2) && 
  			(y1 <= test_y2) && (test_y1 <= y2)) {
  			failed_attempts++;
  			if (failed_attempts > 4*512) {
  				break;
  			}
  			good_pos = false;
  			break;
  		}
  	}
  	if (good_pos) {
	  	flower_arr.push({'x':pos_x, 'y':pos_y});
	  	break;
	}
  }

}

function display_flowers () {
  let crossover_x = (canvas.width / 3) ;
  let crossover_y = (canvas.height / 1.3);
  
  for (let i = 0; i < graphics_arr.length; i++) {
    stroke('#3E5F16');
    strokeWeight(3);
    beginShape();
    let start_x = flower_arr[i].x + 128;
    let start_y = flower_arr[i].y + 128;
    
    let vector_1 = createVector(crossover_x - start_x, crossover_y - start_y);
    let vector_2 = vector_1.mult(10);

    let lerp_val = 0.3;

    while (vector_2.x < 10 || vector_2.y > canvas.height - 20) {
      vector_2.x = lerp(vector_2.x, crossover_x, lerp_val);
      vector_2.y = lerp(vector_2.y, crossover_y, lerp_val);
    }

    vertex(start_x, start_y);
    vertex(vector_2.x, vector_2.y);
    endShape();
    image(graphics_arr[i], flower_arr[i].x, flower_arr[i].y);
  }
  
  let cen_x = crossover_x;
  let cen_y = crossover_y;
  let bow_size = 60;
  push();
  fill('#CC2222');
  stroke('#CC2222');
  strokeJoin(ROUND);
  strokeCap(ROUND);
  strokeWeight(5);
  translate(cen_x + 256, -cen_y + 480);
  rotate(60);
  beginShape();
  quad(cen_x, cen_y - bow_size, cen_x + bow_size / 2, cen_y - bow_size / 2, cen_x, cen_y, cen_x - bow_size / 2, cen_y - bow_size / 2);
  triangle(cen_x + bow_size / 2, cen_y - bow_size / 2, cen_x + bow_size * 1.3, cen_y, cen_x + bow_size * 1.3, cen_y - bow_size);
  triangle(cen_x - bow_size / 2, cen_y - bow_size / 2, cen_x - bow_size * 1.3, cen_y, cen_x - bow_size * 1.3, cen_y - bow_size);
  quad(cen_x + bow_size / 2, cen_y - bow_size / 2, cen_x + bow_size * 0.375, cen_y + bow_size / 2, cen_x + bow_size , cen_y + bow_size, cen_x + bow_size * 1.3, cen_y + bow_size / 2);
  quad(cen_x - bow_size / 2, cen_y - bow_size / 2, cen_x - bow_size * 0.375, cen_y + bow_size / 2, cen_x - bow_size , cen_y + bow_size, cen_x - bow_size * 1.3, cen_y + bow_size / 2);
  endShape();
  pop();
  
  noStroke();
  text(text_, 64, 64, 400);
}

function setup() {
  var canvas = createCanvas(document.getElementById('flower-area').offsetWidth, document.getElementById('flower-area').offsetHeight);
  canvas.parent('flower-area');
  angleMode(DEGREES);
  textSize(32);
  textFont('Brush Script MT');
  flower_text.value = '';
  new_flow();
  display_flowers();
  
}

function draw() {
  new_flower.onclick = (ev) => {
    clear();
    new_flow();
    display_flowers();
  }
  
  save_flower.onclick = (ev) => {
  	background(255);
  	display_flowers();
    save("flower.png");
    clear();
    display_flowers();
  }
  
  add_text.onclick = (ev) => {
    text_ = flower_text.value;
    display_flowers();
  }
}
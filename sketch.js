let particles = [];
let num = 1000;
let nx, ny;
let released = false;
let i;
let count = 0;
let inc = 0;
let dia = [10, 30, 50, 70, 90];
let xx = 0;
let yy = 0;
let posX = 300;
let posY = 300;
let sound;

function setup() {
  createCanvas(600, 600);
  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(0, 10);

  nx = random(0, width);
  ny = random(0, height);
  circle(nx, ny, 5);

  strokeWeight(2.5);
  circle(mouseX, mouseY, 5);

  for (let i = 0; i < num; i++) {
    let p = particles[i];
    point(p.x, p.y);
    let n = noise(p.x * 0.006, p.y * 0.006);
    let a = 2 * PI * n * map(mouseX, 0, width, 1, 2);
    p.x += cos(a);
    p.y += sin(a);
    let r = map(sin(a), -1, 1, 0, 255);
    let b = map(cos(a), -1, 1, 0, 255);
    let g = 100;
    stroke(r, g, b);

    if (!onScreen(p)) {
      p.x = random(width);
      p.y = random(height);
    }

    let d = dist(p.x, p.y, xx, yy);
    let d2 = dist(p.x, p.y, mouseX, mouseY);

    if (d <= 40) {
      p.x = random(width);
      p.y = random(height);
    }

    if (d > 40 && d < 80) {
      let dx = p.x - xx;
      let dy = p.y - yy;
      let xfish = dx * 0.05;
      let yfish = dy * 0.05;
      p.x += xfish;
      p.y += yfish;
    }
    if (mouseIsPressed) {
      if (d2<40) {
        let dx = p.x - xx;
        let dy = p.y - yy;
        let xfish = dx * 0.05;
        let yfish = dy * 0.05;
        p.x += xfish;
        p.y += yfish;
      }
    }
  }

  ripple();
  predator();

  fill(255);
  text("try to move / press you mouse", 10, 30);
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

function ripple() {
  if (mouseIsPressed) {
    for (let i = 0; i < dia.length; i++) {
      stroke(255, 25);
      noFill();
      circle(mouseX, mouseY, dia[i]);
      dia[i] += 1;
      if (dia[i] >= 70) {
        dia[i] = 10;
      }
    }
  }
}

function predator() {
  if (mouseIsPressed) {
    let targetX = mouseX;
    let targetY = mouseY;

    let disX = targetX - xx;
    let disY = targetY - yy;

    xx += disX * 0.02;
    yy += disY * 0.02;

    posX = xx;
    posY = yy;
  } else {
    let xspd = map(noise(inc), 0, 1, -2, 2);
    let yspd = map(noise(1000 + inc), 0, 1, -2, 2);
    xx = posX + xspd;
    yy = posY + yspd;

    posX = xx;
    posY = yy;

    posX = constrain(posX, 0, width);
    posY = constrain(posY, 0, height);
  }

  push();
  translate(xx, yy);
  noStroke();
  fill(160, 130, 170, 20);
  beginShape();
  for (var a = 0; a < TWO_PI; a += 0.1) {
    let xoff = cos(a) + 1;
    let yoff = sin(a) + 1;
    let scl1 = map(sin(inc), -1, 1, 20, 30);
    let scl2 = map(sin(inc), -1, 1, 40, 50);
    let r = map(noise(xoff + inc, yoff + inc), 0, 1, scl1, scl2);
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
  inc += 0.01;
  pop();
}

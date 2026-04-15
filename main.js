// shoutout tsodin

const MODEL_FILENAME = 'models/car.obj';

const FPS = 60;
const SPIN_SPEED = 1.2;
const BG_COLOR = "Black";
const FG_COLOR = "White";
const Z_OFFSET = 8;

viewport.width = 800;
viewport.height = 800;

const ctx = viewport.getContext("2d");
// console.log(ctx);

function clear() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, viewport.width, viewport.height);
}

function point({x, y}) {
  const size = 10;
  ctx.fillStyle = FG_COLOR;
  ctx.fillRect(x - size/2, y - size/2, size, size);
}

function screen(p) {
  return {
    x: (p.x + 1)/2*viewport.width,
    y: (1 - (p.y + 1)/2)*viewport.height
  }
}

function project({x, y, z}) {
  return {
    x: x/z,
    y: y/z
  }
}

function translate(va, pos) {
  let result = [];
  for (let i = 0; i < va.length; i++) {
    result.push({
      x: va[i].x + pos.x,
      y: va[i].y + pos.y,
      z: va[i].z + pos.z
    });
  }
  return result;
}

function rotate_xz(va, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  let result = [];
  for (let i = 0; i < va.length; i++) {
    result.push({
      x: va[i].x * c - va[i].z * s,
      y: va[i].y,
      z: va[i].x * s + va[i].z * c
    });

  }
  return result;
}

function line(p1, p2) {
  ctx.lineWidth = 3;
  ctx.strokeStyle = FG_COLOR;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

const cube = {
  va: [ 
    {x:  1.5, y:  1.5, z:  1.5},
    {x: -1.5, y:  1.5, z:  1.5},
    {x: -1.5, y: -1.5, z:  1.5},
    {x:  1.5, y: -1.5, z:  1.5},
    {x:  1.5, y:  1.5, z: -1.5},
    {x: -1.5, y:  1.5, z: -1.5},
    {x: -1.5, y: -1.5, z: -1.5},
    {x:  1.5, y: -1.5, z: -1.5}
  ],
  fs: [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
  ]
}

async function init() {
  let model;
  try {
    model = await loadOBJ(MODEL_FILENAME);
  } catch (err) {
    model = cube;
  }
  console.log('model:', model);
  model.angle = {x: 0, y: 0, z: 0};
  model.pos = {x: 0, y: 0, z: Z_OFFSET};

  main(model);
}

let t = 0;

function main(model) {

  function frame() {
    const dt = 1/FPS;
    t += dt;

    const va = translate(rotate_xz(model.va, model.angle.y), model.pos);

    // fun zone

    model.pos = {
      x: Math.sin(t),
      y: Math.cos(t),
      z: Z_OFFSET
    }

    model.angle.y += SPIN_SPEED * dt;

    // eof (end of fun zone)

    clear();
    // for (const v of va) {
    //   point(screen(project(v)));
    // }
    for (const f of model.fs) {
      for (let i = 0; i < f.length; i++) {
        const a = va[f[i]];
        const b = va[f[(i+1) % f.length]];
        line(
          screen(project(a)),
          screen(project(b))
        );
      }
    }
    setTimeout(frame, 1000/FPS);
  }
  setTimeout(frame, 1000/FPS);
}

init();

// shoutout tsodin

const MODEL_FILENAME = 'models/car.obj';

const FPS = 60;
const BG_COLOR = "Black";
const FG_COLOR = "White";

let should_stop = false;
let spin_speed = 1.2;

offset = {
  x: 0,
  y: 0,
  z: 8
}

const viewport = document.querySelector("#viewport");
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
  if (z < 0)
    return {x: 0, y: 0};
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

function pollInputs() {
  return {
    x: Number(xSlider.value),
    y: Number(ySlider.value),
    z: Number(zSlider.value),
    spin: Number(spinSlider.value)
  }
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

document.querySelectorAll('button').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    should_stop = true;
    console.log(e.target.id);
    init('models/' + e.target.id +'.obj');
  });
});

async function init(model_name) {
  // sleep :DDDDDDD
  await new Promise(r => setTimeout(r, 100));
  let model;
  try {
    model = await loadOBJ(model_name);
  } catch (err) {
    model = cube;
  }
  console.log('model:', model);
  model.angle = {x: 0, y: 0, z: 0};
  model.pos = {x: 0, y: 0, z: offset.z};

  main(model);
}

let t = 0;

function main(model) {
  should_stop = false;

  function frame() {
    const dt = 1/FPS;
    t += dt;

    const va = translate(rotate_xz(model.va, model.angle.y), model.pos);

    // fun zone

    model.pos = {
      x: Math.sin(t) + offset.x,
      y: Math.cos(t) + offset.y,
      z: offset.z
    }

    model.angle.y += spin_speed * dt;

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
    offset = pollInputs();
    spin_speed = offset.spin;

    if (!should_stop) 
      setTimeout(frame, 1000/FPS);
  }
  setTimeout(frame, 1000/FPS);
}

init(MODEL_FILENAME);

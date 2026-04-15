// shoutout tsodin

const BG_COLOR = "Black";
const FG_COLOR = "White";

const Z_OFFSET = 3;

game.width = 800;
game.height = 800;

const ctx = game.getContext("2d");
console.log(ctx);

function clear() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, game.width, game.height);
}

function point({x, y}) {
  const size = 10;
  ctx.fillStyle = FG_COLOR;
  ctx.fillRect(x - size/2, y - size/2, size, size);
}

function screen(p) {
  return {
    x: (p.x + 1)/2*game.width,
    y: (1 - (p.y + 1)/2)*game.height
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
  // console.log(angle);
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
    {x:  0.5, y:  0.5, z:  0.5},
    {x: -0.5, y:  0.5, z:  0.5},
    {x: -0.5, y: -0.5, z:  0.5},
    {x:  0.5, y: -0.5, z:  0.5},
    {x:  0.5, y:  0.5, z: -0.5},
    {x: -0.5, y:  0.5, z: -0.5},
    {x: -0.5, y: -0.5, z: -0.5},
    {x:  0.5, y: -0.5, z: -0.5}
  ],
  fs: [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7]
  ],
  pos:   {x: 0, y: 0, z: Z_OFFSET},
  angle: {x: 0, y: 0, z: 0}
}

const FPS = 60;
let t = 0;

function frame() {
  const dt = 1/FPS;
  t += dt;
  const va = translate(rotate_xz(cube.va, cube.angle.y), cube.pos);

  // fun zone
  
  cube.pos = {
    x: Math.sin(t),
    y: Math.tan(t),
    z: Math.cos(t) + Z_OFFSET,
  }

  cube.angle.y += 2*Math.PI*dt;

  // eof (end of fun zone)

  clear();
  // for (const v of va) {
  //   point(screen(project(v)));
  // }
  for (const f of cube.fs) {
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

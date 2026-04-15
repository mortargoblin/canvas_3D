function parseOBJ(text) {
  const va = [];
  const fs = [];

  const lines = text.split('\n');

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);

    if (parts[0] === 'v') {
      va.push({
        x: parseFloat(parts[1]),
        y: parseFloat(parts[2]),
        z: parseFloat(parts[3])
      });
    }

    if (parts[0] === 'f') {
      const face = [];

      for (let i = 1; i < parts.length; i++) {
        const index = parts[i].split('/')[0];
        face.push(parseInt(index) - 1);
      }

      fs.push(face);
    }
  }

  return { va, fs };
}

async function loadOBJ(url) {
  const res = await fetch(url);
  const text = await res.text();
  return parseOBJ(text);
}

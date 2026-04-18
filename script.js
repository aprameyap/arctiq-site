const canvas = document.getElementById("circuit");
if (!canvas) throw new Error("Canvas #circuit not found");

const ctx = canvas.getContext("2d");

const GRID = 50;

let paths = [];

/* ─────────────────────────────
   Resize
───────────────────────────── */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buildPaths();
}

/* ─────────────────────────────
   Build Circuit Layout
───────────────────────────── */
function buildPaths() {
  paths = [];

  const cols = Math.ceil(canvas.width / GRID) + 1;
  const rows = Math.ceil(canvas.height / GRID) + 1;

  // Horizontal lines
  for (let r = 0; r < rows; r++) {
    if (Math.random() > 0.25) continue;

    const y = r * GRID;
    const startC = Math.floor(Math.random() * 3);
    const len = 4 + Math.floor(Math.random() * (cols - 4));

    paths.push({
      x1: startC * GRID,
      y1: y,
      x2: (startC + len) * GRID,
      y2: y,
      t: -Math.random(), // directional flow
      speed: 0.015 + Math.random() * 0.006,
      green: Math.random() > 0.45,
      bright: 0.06 + Math.random() * 0.08
    });
  }

  // Vertical lines
  for (let c = 0; c < cols; c++) {
    if (Math.random() > 0.22) continue;

    const x = c * GRID;
    const startR = Math.floor(Math.random() * 3);
    const len = 4 + Math.floor(Math.random() * (rows - 4));

    paths.push({
      x1: x,
      y1: startR * GRID,
      x2: x,
      y2: (startR + len) * GRID,
      t: -Math.random(),
      speed: 0.015 + Math.random() * 0.006,
      green: Math.random() > 0.45,
      bright: 0.06 + Math.random() * 0.08
    });
  }
}

/* ─────────────────────────────
   Draw Frame
───────────────────────────── */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* ── Subtle Grid ── */
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = "rgba(15,35,55,0.25)";

  for (let x = 0; x <= canvas.width + GRID; x += GRID) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height + GRID; y += GRID) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  /* ── Circuit Lines + Fast Pulses ── */
  paths.forEach(p => {
    const gc = p.green;

    // Base line (very subtle)
    ctx.strokeStyle = gc
      ? `rgba(0,255,136,${p.bright})`
      : `rgba(0,140,255,${p.bright})`;

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x1, p.y1);
    ctx.lineTo(p.x2, p.y2);
    ctx.stroke();

    // Move signal
    p.t += p.speed;
    if (p.t > 1.2) p.t = -0.1;

    const dx = p.x2 - p.x1;
    const dy = p.y2 - p.y1;

    const cx = p.x1 + dx * p.t;
    const cy = p.y1 + dy * p.t;

    const tail = 0.08;

    const gx = p.x1 + dx * (p.t - tail);
    const gy = p.y1 + dy * (p.t - tail);

    // Pulse gradient (sharp + fast)
    const grad = ctx.createLinearGradient(gx, gy, cx, cy);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(
      0.3,
      gc ? "rgba(0,255,136,0.3)" : "rgba(0,140,255,0.3)"
    );
    grad.addColorStop(
      1,
      gc ? "rgba(0,255,136,1)" : "rgba(80,200,255,1)"
    );

    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.2;

    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(cx, cy);
    ctx.stroke();
  });

  requestAnimationFrame(draw);
}

/* ─────────────────────────────
   Init
───────────────────────────── */
resize();
window.addEventListener("resize", resize);
draw();
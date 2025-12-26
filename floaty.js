// floaty.js
// Photo follows mouse inside the frame (never leaves the box).

(function () {
  const frame = document.getElementById("floatFrame");
  const card = document.getElementById("floatCard");
  if (!frame || !card) return;

  // Current position
  let x = 18;
  let y = 18;

  // Target position (mouse-driven)
  let tx = 18;
  let ty = 18;

  // Smooth follow strength (bigger = snappier)
  const follow = 0.12;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function setTargetFromMouse(clientX, clientY) {
    const r = frame.getBoundingClientRect();

    const fw = frame.clientWidth;
    const fh = frame.clientHeight;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;

    const maxX = Math.max(0, fw - cw);
    const maxY = Math.max(0, fh - ch);

    // mouse position relative to frame
    const mx = clientX - r.left;
    const my = clientY - r.top;

    // center the card on cursor
    tx = clamp(mx - cw / 2, 0, maxX);
    ty = clamp(my - ch / 2, 0, maxY);
  }

  function step() {
    // ease toward target
    x += (tx - x) * follow;
    y += (ty - y) * follow;

    // small tilt based on movement direction
    const dx = tx - x;
    const dy = ty - y;
    const rot = clamp(dx * 0.03, -4, 4);

    card.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;

    requestAnimationFrame(step);
  }

  function start() {
    // initialize target to current
    tx = x;
    ty = y;
    requestAnimationFrame(step);
  }

  if (card.complete) start();
  else card.addEventListener("load", start);

  // Follow mouse only when inside frame
  frame.addEventListener("mousemove", (e) => {
    setTargetFromMouse(e.clientX, e.clientY);
  });

  // When mouse leaves, gently return to a nice resting spot
  frame.addEventListener("mouseleave", () => {
    tx = 18;
    ty = 18;
  });

  // Touch support (mobile)
  frame.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    if (!t) return;
    setTargetFromMouse(t.clientX, t.clientY);
  }, { passive: true });

  frame.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;
    setTargetFromMouse(t.clientX, t.clientY);
  }, { passive: true });

  // Keep in bounds on resize
  window.addEventListener("resize", () => {
    const fw = frame.clientWidth;
    const fh = frame.clientHeight;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;

    x = clamp(x, 0, Math.max(0, fw - cw));
    y = clamp(y, 0, Math.max(0, fh - ch));
    tx = clamp(tx, 0, Math.max(0, fw - cw));
    ty = clamp(ty, 0, Math.max(0, fh - ch));
  });
})();

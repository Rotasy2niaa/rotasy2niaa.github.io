(function () {
  const frame = document.getElementById("floatFrame");
  const card = document.getElementById("floatCard");
  if (!frame || !card) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let idlePhase = 0;
  let pointerActive = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getBounds() {
    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;

    return {
      frameRect: frame.getBoundingClientRect(),
      maxX: Math.max(0, frameWidth - cardWidth),
      maxY: Math.max(0, frameHeight - cardHeight)
    };
  }

  function getRestPosition() {
    const { maxX, maxY } = getBounds();

    return {
      x: maxX * 0.14,
      y: maxY * 0.12
    };
  }

  function setRestPosition() {
    const rest = getRestPosition();
    x = rest.x;
    y = rest.y;
    targetX = rest.x;
    targetY = rest.y;
  }

  function setTargetFromPointer(clientX, clientY) {
    const { frameRect, maxX, maxY } = getBounds();
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const localX = clientX - frameRect.left;
    const localY = clientY - frameRect.top;

    targetX = clamp(localX - cardWidth * 0.48, 0, maxX);
    targetY = clamp(localY - cardHeight * 0.48, 0, maxY);
  }

  function render() {
    if (!pointerActive) {
      const rest = getRestPosition();
      idlePhase += 0.015;
      targetX = rest.x + Math.sin(idlePhase) * 7;
      targetY = rest.y + Math.cos(idlePhase * 0.85) * 5;
    }

    x += (targetX - x) * 0.08;
    y += (targetY - y) * 0.08;

    const driftX = targetX - x;
    const driftY = targetY - y;
    const rotate = clamp(driftX * 0.04, -4.5, 4.5);
    const scale = pointerActive ? 1.012 : 1;

    card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
    card.style.boxShadow = `0 24px 52px rgba(29, 18, 17, 0.18), ${driftX * 0.7}px ${Math.abs(driftY) * 0.45}px 24px rgba(29, 18, 17, 0.1)`;

    window.requestAnimationFrame(render);
  }

  function start() {
    setRestPosition();

    if (prefersReducedMotion) {
      card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      return;
    }

    window.requestAnimationFrame(render);
  }

  if (card.complete) {
    start();
  } else {
    card.addEventListener("load", start, { once: true });
  }

  frame.addEventListener("pointerenter", () => {
    pointerActive = true;
  });

  frame.addEventListener("pointermove", event => {
    pointerActive = true;
    setTargetFromPointer(event.clientX, event.clientY);
  });

  frame.addEventListener("pointerleave", () => {
    pointerActive = false;
  });

  frame.addEventListener(
    "touchstart",
    event => {
      const touch = event.touches[0];
      if (!touch) return;

      pointerActive = true;
      setTargetFromPointer(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  frame.addEventListener(
    "touchmove",
    event => {
      const touch = event.touches[0];
      if (!touch) return;

      pointerActive = true;
      setTargetFromPointer(touch.clientX, touch.clientY);
    },
    { passive: true }
  );

  frame.addEventListener("touchend", () => {
    pointerActive = false;
  });

  window.addEventListener("resize", () => {
    const { maxX, maxY } = getBounds();
    x = clamp(x, 0, maxX);
    y = clamp(y, 0, maxY);
    targetX = clamp(targetX, 0, maxX);
    targetY = clamp(targetY, 0, maxY);

    if (prefersReducedMotion) {
      card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  });
})();

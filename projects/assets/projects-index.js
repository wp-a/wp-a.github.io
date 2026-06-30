(() => {
  const root = document.querySelector('[data-project-carousel]');
  if (!root || window.matchMedia('(max-width: 760px)').matches) return;

  const cards = [...root.querySelectorAll('[data-project-card]')];
  const dots = [...root.querySelectorAll('[data-carousel-dot]')];
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = cards.length;
  if (!total) return;

  const state = {
    progress: 0,
    target: 0,
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    frame: 0,
    lastAuto: performance.now(),
  };

  const wrapIndex = (value) => ((value % total) + total) % total;

  const shortestDelta = (from, to) => {
    let delta = to - from;
    const half = total / 2;
    while (delta > half) delta -= total;
    while (delta < -half) delta += total;
    return delta;
  };

  const setTarget = (index) => {
    const current = wrapIndex(Math.round(state.target));
    state.target += shortestDelta(current, wrapIndex(index));
    state.lastAuto = performance.now();
  };

  const activateDot = () => {
    const active = wrapIndex(Math.round(state.progress));
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === active);
      dot.setAttribute('aria-current', index === active ? 'true' : 'false');
    });
  };

  const render = (time) => {
    if (!reduceMotion && time - state.lastAuto > 3800) {
      state.target += 1;
      state.lastAuto = time;
    }

    state.progress += (state.target - state.progress) * 0.07;
    state.tiltX += (state.targetTiltX - state.tiltX) * 0.08;
    state.tiltY += (state.targetTiltY - state.tiltY) * 0.08;

    cards.forEach((card, index) => {
      let offset = index - state.progress;
      const half = total / 2;
      while (offset > half) offset -= total;
      while (offset < -half) offset += total;

      const abs = Math.abs(offset);
      const isActive = abs < 0.56;
      const isClickable = abs < 1.72;
      const angle = offset * 44;
      const radians = angle * Math.PI / 180;
      const x = Math.sin(radians) * 320;
      const z = Math.cos(radians) * 250 - 60;
      const opacity = Math.max(0.2, 1 - abs * 0.26);
      const focus = Math.max(0, 1 - abs);

      card.style.setProperty('--tx', `${x.toFixed(2)}px`);
      card.style.setProperty('--tz', `${z.toFixed(2)}px`);
      card.style.setProperty('--rot-y', `${(-angle).toFixed(2)}deg`);
      card.style.setProperty('--rot-x', `${(offset * -2.4).toFixed(2)}deg`);
      card.style.setProperty('--tilt-x', `${(state.tiltY * -8 * focus).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(state.tiltX * 10 * focus).toFixed(2)}deg`);
      card.style.setProperty('--card-opacity', opacity.toFixed(3));
      card.style.pointerEvents = isClickable ? 'auto' : 'none';
      card.style.zIndex = String(Math.round((focus + 1) * 100 - abs * 10));
      card.classList.toggle('is-inactive', !isActive);
      card.tabIndex = isActive ? 0 : -1;
      card.setAttribute('aria-hidden', isClickable ? 'false' : 'true');
    });

    activateDot();
    state.frame = requestAnimationFrame(render);
  };

  root.addEventListener('mousemove', (event) => {
    const rect = root.getBoundingClientRect();
    state.targetTiltX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    state.targetTiltY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  });

  root.addEventListener('mouseleave', () => {
    state.targetTiltX = 0;
    state.targetTiltY = 0;
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => setTarget(index));
  });

  prev?.addEventListener('click', () => setTarget(Math.round(state.target) - 1));
  next?.addEventListener('click', () => setTarget(Math.round(state.target) + 1));

  cards.forEach((card) => {
    card.addEventListener('click', (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      event.preventDefault();
      window.location.assign(card.href);
    });
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') setTarget(Math.round(state.target) - 1);
    if (event.key === 'ArrowRight') setTarget(Math.round(state.target) + 1);
  });

  render(performance.now());

  window.addEventListener('pagehide', () => cancelAnimationFrame(state.frame), { once: true });
})();

(() => {
  const detail = document.querySelector('.detalhe-loja');
  if (!detail) return;
  const zoom = document.createElement('dialog');
  zoom.className = 'zoom-peca';
  zoom.setAttribute('aria-label', 'Foto ampliada da peça');
  zoom.innerHTML = '<div class="zoom-barra"><span>Veja cada detalhe</span><div class="zoom-controles"><button type="button" data-zoom="menos" aria-label="Diminuir zoom">−</button><output aria-live="polite">100%</output><button type="button" data-zoom="mais" aria-label="Ampliar zoom">+</button><button type="button" data-zoom="ajustar">Ajustar</button><button type="button" data-zoom="fechar" aria-label="Fechar foto ampliada">×</button></div></div><div class="zoom-area"><img alt="" draggable="false"></div><p class="zoom-dica">Use + e −, a roda do mouse ou dois dedos para ampliar. Arraste para explorar.</p>';
  document.body.append(zoom);
  const area = zoom.querySelector('.zoom-area');
  const image = area.querySelector('img');
  const output = zoom.querySelector('output');
  const points = new Map();
  let scale = 1, x = 0, y = 0, gesture = null;
  const limits = (value, min, max) => Math.min(max, Math.max(min, value));
  function paint() {
    const width = area.clientWidth, height = area.clientHeight;
    const fit = Math.min(width / (image.naturalWidth || width), height / (image.naturalHeight || height));
    const maxX = Math.max(0, ((image.naturalWidth || width) * fit * scale - width) / 2);
    const maxY = Math.max(0, ((image.naturalHeight || height) * fit * scale - height) / 2);
    x = limits(x, -maxX, maxX); y = limits(y, -maxY, maxY);
    image.style.transform = `translate(${x}px,${y}px) scale(${scale})`;
    output.value = Math.round(scale * 100) + '%';
    zoom.querySelector('[data-zoom="menos"]').disabled = scale <= 1;
    zoom.querySelector('[data-zoom="mais"]').disabled = scale >= 4;
    area.classList.toggle('com-zoom', scale > 1);
  }
  function setScale(value, anchorX = 0, anchorY = 0) {
    const next = limits(value, 1, 4), ratio = next / scale;
    x = anchorX - (anchorX - x) * ratio;
    y = anchorY - (anchorY - y) * ratio;
    scale = next; paint();
  }
  function reset() { scale = 1; x = 0; y = 0; points.clear(); gesture = null; paint(); }
  function open(photo) {
    image.src = photo.currentSrc || photo.src; image.alt = photo.alt;
    scale = 1; x = 0; y = 0;
    zoom.showModal(); detail.classList.add('com-ampliacao'); paint();
    zoom.querySelector('[data-zoom="fechar"]').focus();
  }
  function closeZoom() {detail.classList.remove('com-ampliacao');if(zoom.open)zoom.close();}
  image.addEventListener('load', paint);
  zoom.addEventListener('click', e => {
    const action = e.target.closest('[data-zoom]')?.dataset.zoom;
    if (action === 'fechar' || e.target === zoom) closeZoom();
    if (action === 'mais') setScale(scale + .5);
    if (action === 'menos') setScale(scale - .5);
    if (action === 'ajustar') reset();
  });
  zoom.addEventListener('cancel', e => {e.preventDefault();e.stopPropagation();closeZoom();});
  zoom.addEventListener('close', () => { detail.classList.remove('com-ampliacao'); reset(); });
  area.addEventListener('wheel', e => {
    e.preventDefault();
    const box = area.getBoundingClientRect();
    setScale(scale * Math.exp(-e.deltaY * .002), e.clientX - box.left - box.width / 2, e.clientY - box.top - box.height / 2);
  }, { passive: false });
  function beginGesture() {
    const list = [...points.values()];
    if (list.length >= 2) {
      const a = list[0], b = list[1], box = area.getBoundingClientRect();
      gesture = { type: 'pinch', distance: Math.max(1, Math.hypot(b.x-a.x,b.y-a.y)), scale, x, y,
        cx: (a.x+b.x)/2-box.left-box.width/2, cy: (a.y+b.y)/2-box.top-box.height/2 };
    } else if (list.length) gesture = { type: 'pan', startX: list[0].x, startY: list[0].y, x, y };
    else gesture = null;
  }
  area.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.preventDefault(); area.setPointerCapture(e.pointerId);
    points.set(e.pointerId, { x: e.clientX, y: e.clientY }); beginGesture();
  });
  area.addEventListener('pointermove', e => {
    if (!points.has(e.pointerId)) return;
    points.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const list = [...points.values()];
    if (gesture?.type === 'pinch' && list.length >= 2) {
      const a = list[0], b = list[1], box = area.getBoundingClientRect();
      scale = limits(gesture.scale * Math.hypot(b.x-a.x,b.y-a.y) / gesture.distance, 1, 4);
      const ratio = scale / gesture.scale;
      x = (a.x+b.x)/2-box.left-box.width/2 - (gesture.cx-gesture.x)*ratio;
      y = (a.y+b.y)/2-box.top-box.height/2 - (gesture.cy-gesture.y)*ratio;
    } else if (gesture?.type === 'pan') {
      x = gesture.x + e.clientX - gesture.startX;
      y = gesture.y + e.clientY - gesture.startY;
    }
    paint();
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    area.addEventListener(event, e => { points.delete(e.pointerId); beginGesture(); });
  }
  area.addEventListener('dblclick', () => setScale(scale > 1 ? 1 : 2));
  new ResizeObserver(() => { if (zoom.open) paint(); }).observe(area);
  function addLoupe() {
    const photo = detail.querySelector('.detalhe-imagens > img');
    if (!photo || photo.dataset.lupa) return;
    photo.dataset.lupa = 'true'; photo.classList.add('foto-com-lupa');
    photo.tabIndex = 0; photo.setAttribute('role', 'button');
    photo.setAttribute('aria-label', 'Ampliar foto da peça');
    photo.addEventListener('click', () => open(photo));
    photo.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(photo); } });
    const button = document.createElement('button'); button.type = 'button'; button.className = 'abrir-zoom';
    button.setAttribute('aria-label', 'Ampliar foto da peça');
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6M7 10h6m-3-3v6"/></svg><span>Ampliar</span>';
    button.addEventListener('click', () => open(photo));
    photo.parentElement.insertBefore(button, photo.nextSibling);
  }
  new MutationObserver(addLoupe).observe(detail, { childList: true, subtree: true });
  addLoupe();
})();

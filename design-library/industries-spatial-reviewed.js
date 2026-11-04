const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const cards = [...document.querySelectorAll('.industry-card')];
const links = [...document.querySelectorAll('.industry-jump-links a')];
const stages = cards.map(card => card.querySelector('.industry-card-image'));
const ease = 'cubic-bezier(.23,1,.32,1)';

const tablist = document.querySelector('.industry-jump-links');
tablist.setAttribute('role', 'tablist');
const controls = document.createElement('div');
controls.className = 'industry-carousel-controls';
controls.innerHTML = '<span class="industry-carousel-position" aria-hidden="true"></span><button class="industry-carousel-toggle" type="button">Pause rotation</button>';
tablist.after(controls);
const toggle = controls.querySelector('button');
const position = controls.querySelector('span');
let current = Math.max(0, cards.findIndex(card => card.id === location.hash.slice(1)));
let paused = reduced.matches, hovered = false, focused = false, visible = false, timer = 0;
function syncRotation() {
  clearTimeout(timer);
  const playing = !paused && !hovered && !focused && visible && !document.hidden && !reduced.matches;
  tablist.dataset.playing = String(playing);
  toggle.textContent = paused ? 'Play rotation' : 'Pause rotation';
  toggle.setAttribute('aria-label', paused ? 'Play automatic industry rotation' : 'Pause automatic industry rotation');
  if (playing) timer = setTimeout(() => activate((current + 1) % cards.length, false), 8000);
}
function activate(index, manual = false, focus = false) {
  current = index;
  cards.forEach((card, i) => {
    card.hidden = i !== index;
    card.setAttribute('role', 'tabpanel');
    card.setAttribute('aria-labelledby', 'industry-tab-' + i);
  });
  links.forEach((link, i) => {
    link.id = 'industry-tab-' + i;
    link.setAttribute('role', 'tab');
    link.setAttribute('aria-controls', cards[i].id);
    link.setAttribute('aria-selected', String(i === index));
    link.tabIndex = i === index ? 0 : -1;
    if (i === index) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  position.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
  if (manual) {
    paused = true;
    history.replaceState(null, '', '#' + cards[index].id);
  }
  if (focus) links[index].focus();
  if (!reduced.matches) cards[index].animate([
    { opacity: 0, transform: 'translateX(18px)' },
    { opacity: 1, transform: 'translateX(0)' }
  ], { duration: 450, easing: ease });
  syncRotation();
}
links.forEach((link, index) => {
  link.addEventListener('click', event => { event.preventDefault(); activate(index, true); });
  link.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (current + 1) % cards.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + cards.length) % cards.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = cards.length - 1;
    if (next === undefined) return;
    event.preventDefault(); activate(next, true, true);
  });
});
toggle.addEventListener('click', () => { paused = !paused; syncRotation(); });
const grid = document.querySelector('.industry-grid');
grid.addEventListener('pointerenter', () => { hovered = true; syncRotation(); });
grid.addEventListener('pointerleave', () => { hovered = false; syncRotation(); });
grid.addEventListener('focusin', () => { focused = true; syncRotation(); });
grid.addEventListener('focusout', event => { if (!grid.contains(event.relatedTarget)) { focused = false; syncRotation(); } });
new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncRotation(); }, { threshold: .2 }).observe(grid);
document.addEventListener('visibilitychange', syncRotation);
reduced.addEventListener('change', () => { if (reduced.matches) paused = true; syncRotation(); });
window.addEventListener('hashchange', () => { const index = cards.findIndex(card => '#' + card.id === location.hash); if (index >= 0) activate(index, true); });
activate(current);
document.querySelectorAll('.industry-example').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (detail.open && !reduced.matches) detail.querySelector('.industry-example-content').animate([
      { opacity: 0, transform: 'translateY(-6px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 220, easing: ease });
  });
});

// The original artwork stays visible if WebGL or the optional module cannot load.
stages.forEach(stage => {
  const img = stage.querySelector('img');
  stage.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches || stage.classList.contains('scene-ready')) return;
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    img.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateY(-4px)`;
  });
  stage.addEventListener('pointerleave', () => { img.style.transform = ''; });
});

async function enhanceWithThree() {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
  const scenes = [];
  const loader = new THREE.TextureLoader();
  let raf = 0;
  let last = 0;
  function schedule() {
    if (!raf && !document.hidden) raf = requestAnimationFrame(render);
  }
  function render(time) {
    raf = 0;
    const dt = last ? Math.min((time - last) / 1000, .05) : 1 / 60;
    last = time;
    let moving = false;
    scenes.forEach(item => {
      if (!item.visible || item.lost) return;
      const factor = reduced.matches ? 1 : 1 - Math.exp(-9 * dt);
      item.group.rotation.x += (item.targetX - item.group.rotation.x) * factor;
      item.group.rotation.y += (item.targetY - item.group.rotation.y) * factor;
      const unsettled = Math.abs(item.targetX - item.group.rotation.x) + Math.abs(item.targetY - item.group.rotation.y) > .0001;
      if (item.dirty || unsettled) item.renderer.render(item.scene, item.camera);
      item.dirty = false;
      moving ||= unsettled;
    });
    if (moving) schedule();
  }
  function roundedPanel(width, height) {
    const x = -width / 2, y = -height / 2, r = .16;
    const shape = new THREE.Shape();
    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return new THREE.ExtrudeGeometry(shape, { depth: .035, bevelEnabled: true, bevelSize: .025, bevelThickness: .025, bevelSegments: 3, steps: 1 });
  }
  async function createScene(stage) {
    const img = stage.querySelector('img');
    let renderer;
    try {
      const texture = await loader.loadAsync(img.currentSrc || img.src);
      texture.colorSpace = THREE.SRGBColorSpace;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setClearColor(0xffffff, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const canvas = renderer.domElement;
      canvas.setAttribute('aria-hidden', 'true');
      stage.appendChild(canvas);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-3, 3, 3, -3, .1, 30);
      camera.position.set(0, 0, 9);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x9db4ff, 2.1));
      const light = new THREE.DirectionalLight(0xffffff, 2.5);
      light.position.set(-3, 5, 7);
      scene.add(light);
      const group = new THREE.Group();
      scene.add(group);
      const aspect = texture.image.width / texture.image.height;
      const artWidth = 5.05;
      const artHeight = artWidth / aspect;
      const plate = roundedPanel(4.4, 3.15);
      const back = new THREE.Mesh(plate, new THREE.MeshPhysicalMaterial({ color: 0x3450f0, roughness: .22, metalness: .1, transparent: true, opacity: .045, clearcoat: 1, depthWrite: false }));
      back.position.set(.12, .14, -.42);
      back.rotation.z = -.045;
      group.add(back);
      const middle = new THREE.Mesh(plate, new THREE.MeshPhysicalMaterial({ color: 0xdce5ff, roughness: .16, metalness: .05, transparent: true, opacity: .08, clearcoat: 1, depthWrite: false }));
      middle.position.set(-.11, -.04, -.2);
      middle.rotation.z = .035;
      group.add(middle);
      const art = new THREE.Mesh(new THREE.PlaneGeometry(artWidth, artHeight), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
      art.position.z = .12;
      art.renderOrder = 2;
      group.add(art);
      const item = { stage, renderer, camera, scene, group, targetX: 0, targetY: -.025, visible: false, dirty: true, lost: false };
      scenes.push(item);
      const resize = new ResizeObserver(() => {
        const width = stage.clientWidth, height = stage.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        const ratio = width / height;
        const viewHeight = Math.max(4.6, 5.7 / ratio);
        camera.left = -viewHeight * ratio / 2;
        camera.right = viewHeight * ratio / 2;
        camera.top = viewHeight / 2;
        camera.bottom = -viewHeight / 2;
        camera.updateProjectionMatrix();
        item.dirty = true;
        schedule();
      });
      resize.observe(stage);
      const visibility = new IntersectionObserver(entries => {
        item.visible = entries[0].isIntersecting;
        item.dirty = true;
        if (item.visible) schedule();
      }, { rootMargin: '120px' });
      visibility.observe(stage);
      stage.addEventListener('pointermove', event => {
        if (reduced.matches || !finePointer.matches) return;
        const rect = stage.getBoundingClientRect();
        item.targetY = ((event.clientX - rect.left) / rect.width - .5) * .19;
        item.targetX = ((event.clientY - rect.top) / rect.height - .5) * .13;
        item.dirty = true;
        schedule();
      });
      stage.addEventListener('pointerleave', () => {
        item.targetX = 0;
        item.targetY = -.025;
        item.dirty = true;
        schedule();
      });
      canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        item.lost = true;
        stage.classList.remove('scene-ready');
      });
      canvas.addEventListener('webglcontextrestored', () => {
        item.lost = false;
        item.dirty = true;
        stage.classList.add('scene-ready');
        schedule();
      });
      stage.classList.add('scene-ready');
      item.cleanup = () => {
        resize.disconnect();
        visibility.disconnect();
        scene.traverse(object => {
          object.geometry?.dispose();
          object.material?.dispose();
        });
        texture.dispose();
        renderer.dispose();
      };
    } catch {
      renderer?.dispose();
      stage.classList.remove('scene-ready');
    }
  }
  // Initialise close to the viewport instead of allocating every GPU context at once.
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      lazyObserver.unobserve(entry.target);
      createScene(entry.target);
    });
  }, { rootMargin: '250px' });
  stages.forEach(stage => lazyObserver.observe(stage));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else { last = 0; scenes.forEach(item => { item.dirty = true; }); schedule(); }
  });
  reduced.addEventListener('change', () => {
    scenes.forEach(item => { item.targetX = 0; item.targetY = -.025; item.dirty = true; });
    schedule();
  });
  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    cancelAnimationFrame(raf);
    lazyObserver.disconnect();
    scenes.forEach(item => item.cleanup?.());
  });
}
enhanceWithThree().catch(() => { /* CSS depth and the original art remain available. */ });

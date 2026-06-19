/* ════════════════════════════════════════════
   CAMPUSVERSE AI — script.js
   ════════════════════════════════════════════ */

'use strict';

/* ── 1. AOS INIT ─────────────────────────── */
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60,
});

/* ── 2. NAV SCROLL ────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── 3. HAMBURGER ─────────────────────────── */
const hamburger = document.getElementById('hamburger');
hamburger && hamburger.addEventListener('click', () => {
  const links = document.querySelector('.nav-links');
  if (!links) return;
  const open = links.style.display === 'flex';
  links.style.cssText = open
    ? ''
    : 'display:flex;flex-direction:column;position:fixed;top:70px;left:0;right:0;background:rgba(5,8,16,0.97);backdrop-filter:blur(20px);padding:24px;gap:20px;z-index:999;border-bottom:1px solid rgba(0,212,255,0.15)';
});

/* ── 4. PARTICLES.JS ──────────────────────── */
if (window.particlesJS) {
  particlesJS('particles-js', {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 1000 } },
      color: { value: ['#00d4ff', '#8b5cf6', '#06d6a0'] },
      shape: { type: 'circle' },
      opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
      size: { value: 2, random: true },
      line_linked: { enable: true, distance: 140, color: '#00d4ff', opacity: 0.1, width: 1 },
      move: { enable: true, speed: 1.2, direction: 'none', random: true, out_mode: 'out' },
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
      modes: { grab: { distance: 180, line_linked: { opacity: 0.4 } }, push: { particles_nb: 3 } },
    },
    retina_detect: true,
  });
}

/* ── 5. THREE.JS HERO CANVAS (background grid) ── */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Grid plane
  const gridHelper = new THREE.GridHelper(40, 40, 0x00d4ff, 0x00d4ff);
  gridHelper.material.opacity = 0.06;
  gridHelper.material.transparent = true;
  gridHelper.rotation.x = Math.PI / 6;
  gridHelper.position.y = -3;
  scene.add(gridHelper);

  // Floating spheres
  const spheres = [];
  const geoSphere = new THREE.SphereGeometry(0.06, 8, 8);
  const colors = [0x00d4ff, 0x8b5cf6, 0x06d6a0];
  for (let i = 0; i < 30; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.5,
    });
    const mesh = new THREE.Mesh(geoSphere, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6 - 2
    );
    mesh.userData = { vx: (Math.random() - 0.5) * 0.003, vy: (Math.random() - 0.5) * 0.003 };
    scene.add(mesh);
    spheres.push(mesh);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;
    gridHelper.rotation.z = frame * 0.0004;
    spheres.forEach(s => {
      s.position.x += s.userData.vx;
      s.position.y += s.userData.vy;
      if (Math.abs(s.position.x) > 8) s.userData.vx *= -1;
      if (Math.abs(s.position.y) > 5) s.userData.vy *= -1;
    });
    renderer.render(scene, camera);
  }
  animate();
})();

/* ── 6. THREE.JS ROBOT (icosahedron placeholder) ── */
(function initRobotCanvas() {
  const canvas = document.getElementById('robot-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(360, 360);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 4.5);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x00d4ff, 0.4);
  scene.add(ambientLight);
  const pointLight1 = new THREE.PointLight(0x00d4ff, 2, 10);
  pointLight1.position.set(3, 2, 3);
  scene.add(pointLight1);
  const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 10);
  pointLight2.position.set(-3, -2, 2);
  scene.add(pointLight2);
  const rimLight = new THREE.DirectionalLight(0x06d6a0, 0.8);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);

  // Body — icosahedron
  const bodyGeo = new THREE.IcosahedronGeometry(1, 1);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x050810,
    metalness: 0.9,
    roughness: 0.1,
    wireframe: false,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  scene.add(body);

  // Wireframe overlay
  const wireMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.15 });
  const wire = new THREE.Mesh(bodyGeo, wireMat);
  scene.add(wire);

  // Head — small octahedron
  const headGeo = new THREE.OctahedronGeometry(0.5, 0);
  const headMat = new THREE.MeshStandardMaterial({ color: 0x001122, metalness: 0.95, roughness: 0.05 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 1.3;
  scene.add(head);

  const headWireMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.3 });
  const headWire = new THREE.Mesh(headGeo, headWireMat);
  headWire.position.y = 1.3;
  scene.add(headWire);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.18, 1.32, 0.45);
  scene.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.18, 1.32, 0.45);
  scene.add(eyeR);

  // Orbit ring
  const ringGeo = new THREE.TorusGeometry(1.4, 0.012, 8, 80);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.5 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.5;
  scene.add(ring);

  const ringGeo2 = new THREE.TorusGeometry(1.8, 0.008, 8, 80);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.35 });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.z = Math.PI / 6;
  scene.add(ring2);

  // Hologram plane
  const holoGeo = new THREE.PlaneGeometry(4, 4, 20, 20);
  const holoMat = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    wireframe: true,
    transparent: true,
    opacity: 0.04,
  });
  const holo = new THREE.Mesh(holoGeo, holoMat);
  holo.position.y = -1.5;
  holo.rotation.x = -Math.PI / 2;
  scene.add(holo);

  let frame = 0;
  let mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * -2;
  });

  function animate() {
    requestAnimationFrame(animate);
    frame++;
    const t = frame * 0.008;

    body.rotation.y = t + mouse.x * 0.3;
    body.rotation.x = Math.sin(t * 0.5) * 0.15 + mouse.y * 0.1;
    wire.rotation.y = body.rotation.y;
    wire.rotation.x = body.rotation.x;

    head.rotation.y = t * 0.6;
    headWire.rotation.y = head.rotation.y;

    ring.rotation.z = t * 0.5;
    ring2.rotation.z = -t * 0.3;

    // Eye glow pulse
    const glow = 0.7 + 0.3 * Math.sin(t * 3);
    eyeL.material.opacity = glow;
    eyeR.material.opacity = glow;
    eyeL.material.transparent = true;
    eyeR.material.transparent = true;

    // Float
    body.position.y = Math.sin(t * 0.8) * 0.12;
    head.position.y = 1.3 + Math.sin(t * 0.8) * 0.12;
    headWire.position.y = head.position.y;
    eyeL.position.y = 1.32 + Math.sin(t * 0.8) * 0.12;
    eyeR.position.y = eyeL.position.y;
    wire.position.y = body.position.y;

    renderer.render(scene, camera);
  }
  animate();
})();

/* ── 7. GSAP SCROLL ANIMATIONS ──────────────── */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero title reveal
  gsap.from('.hero-title', {
    duration: 1.2,
    y: 60,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.2,
  });

  // Parallax on hero robot wrap
  gsap.to('#robot-wrap', {
    y: 80,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* ── 8. STAT COUNTERS ─────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ── 9. KPI LIVE UPDATE (dashboard) ──────── */
function randomDelta(val, range) {
  return Math.max(1, val + Math.floor((Math.random() - 0.5) * range));
}
setInterval(() => {
  const kpi1 = document.getElementById('kpi1');
  const kpi4 = document.getElementById('kpi4');
  if (kpi1) kpi1.textContent = randomDelta(parseInt(kpi1.textContent) || 247, 6);
  if (kpi4) kpi4.textContent = randomDelta(parseInt(kpi4.textContent) || 38, 3);
}, 3000);

/* ── 10. DONUT CHART ─────────────────────── */
(function drawDonut() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const data = [38, 27, 20, 15];
  const colors = ['#00d4ff', '#8b5cf6', '#06d6a0', '#f59e0b'];
  const cx = 80, cy = 80, R = 68, r = 46;
  let angle = -Math.PI / 2;

  data.forEach((d, i) => {
    const slice = (d / 100) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, R, angle, angle + slice);
    ctx.arc(cx, cy, r, angle + slice, angle, true);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    angle += slice;
  });

  // Center text
  ctx.fillStyle = '#e8f4ff';
  ctx.font = 'bold 22px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AI', cx, cy - 8);
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = '#8ba3c7';
  ctx.fillText('TRENDS', cx, cy + 12);
})();

/* ── 11. LINE CHART (activity) ───────────── */
(function drawLine() {
  const canvas = document.getElementById('lineChart');
  if (!canvas) return;
  const parent = canvas.parentElement;
  canvas.width = parent.offsetWidth - 40;
  canvas.height = 70;
  const ctx = canvas.getContext('2d');

  const points = Array.from({ length: 20 }, (_, i) =>
    30 + Math.sin(i * 0.5) * 20 + Math.random() * 10
  );

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width, h = canvas.height;
    const stepX = w / (points.length - 1);
    const maxY = Math.max(...points);
    const toY = v => h - (v / maxY) * (h - 6) - 3;

    // Fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(0,212,255,0.25)');
    grad.addColorStop(1, 'rgba(0,212,255,0)');
    ctx.beginPath();
    ctx.moveTo(0, h);
    points.forEach((p, i) => ctx.lineTo(i * stepX, toY(p)));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(0, toY(points[0]));
    points.forEach((p, i) => ctx.lineTo(i * stepX, toY(p)));
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  draw();

  // Animate
  setInterval(() => {
    points.shift();
    points.push(30 + Math.random() * 40);
    draw();
  }, 800);
})();

/* ── 12. MENTOR CHAT ─────────────────────── */
const chatResponses = {
  'dónde puedo aprender ia': '¡Excelente pregunta! Te recomiendo visitar el **Laboratorio de Inteligencia Artificial** dentro del Campus Virtual. Allí encontrarás recursos, proyectos y mentores especializados. ¿Te guío hasta allá? 🧬',
  'qué programas ofrecen': 'Campuslands ofrece programas en **Desarrollo de Software**, **Inteligencia Artificial**, **Data Science**, **UX/UI Design** y **Cloud Computing**. ¿Cuál se alinea mejor con tu perfil? 🎓',
  'recórrenos el campus': 'Con gusto. El campus tiene 5 zonas principales: el **Hall Central** de bienvenida, el **Lab IA** para experimentos, el **Dev Hub** para código, el **Studio Creativo** y el **Innovation Hub**. ¿Por cuál empezamos? 🗺️',
  'default': 'Entiendo tu consulta. Como tu Mentor IA, te recomiendo explorar el campus virtual para encontrar la respuesta experiencialmente. También puedes conectarte con un asesor humano. ¿En qué más puedo ayudarte? ✨',
};

function addMessage(text, isUser = false) {
  const body = document.getElementById('chat-body');
  if (!body) return;
  const div = document.createElement('div');
  div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
  div.innerHTML = `
    ${!isUser ? '<span class="msg-icon">🤖</span>' : ''}
    <div class="bubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
    ${isUser ? '<span class="msg-icon" style="background:linear-gradient(135deg,#00d4ff,#8b5cf6)">👤</span>' : ''}
  `;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function getResponse(query) {
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const key of Object.keys(chatResponses)) {
    if (key !== 'default' && q.includes(key.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
      return chatResponses[key];
    }
  }
  return chatResponses['default'];
}

function handleChatSend() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, true);
  input.value = '';
  setTimeout(() => addMessage(getResponse(text), false), 800);
}

function sendSuggestion(btn) {
  const input = document.getElementById('chat-input');
  if (!input) return;
  input.value = btn.textContent;
  handleChatSend();
}

const chatInput = document.getElementById('chat-input');
chatInput && chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleChatSend();
});

/* ── 13. MAP NODE HOVER LABELS ───────────── */
document.querySelectorAll('.map-node').forEach(node => {
  node.addEventListener('mouseenter', () => {
    node.querySelector('span').style.color = '#00d4ff';
  });
  node.addEventListener('mouseleave', () => {
    node.querySelector('span').style.color = '';
  });
});

/* ── 14. SMOOTH SECTION LINKS ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile nav if open
      const links = document.querySelector('.nav-links');
      if (links && links.style.display === 'flex') links.style.cssText = '';
    }
  });
});

/* ── 15. FEATURE CARD NEON TRAIL ─────────── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,212,255,0.08), rgba(10,14,28,0.7) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ── 16. PROGRESS BARS ANIMATE ON VIEW ──── */
const progressBars = document.querySelectorAll('.progress-bar');
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const w = e.target.style.width;
      e.target.style.width = '0%';
      setTimeout(() => { e.target.style.width = w; }, 100);
      progressObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
progressBars.forEach(b => progressObserver.observe(b));

/* ── 17. CONSOLE EASTER EGG ──────────────── */
console.log(`%c
 ██████╗ █████╗ ███╗   ███╗██████╗ ██╗   ██╗███████╗██╗   ██╗███████╗██████╗ ███████╗     █████╗ ██╗
██╔════╝██╔══██╗████╗ ████║██╔══██╗██║   ██║██╔════╝██║   ██║██╔════╝██╔══██╗██╔════╝    ██╔══██╗██║
██║     ███████║██╔████╔██║██████╔╝██║   ██║███████╗██║   ██║█████╗  ██████╔╝███████╗    ███████║██║
██║     ██╔══██║██║╚██╔╝██║██╔═══╝ ██║   ██║╚════██║╚██╗ ██╔╝██╔══╝  ██╔══██╗╚════██║    ██╔══██║██║
╚██████╗██║  ██║██║ ╚═╝ ██║██║     ╚██████╔╝███████║ ╚████╔╝ ███████╗██║  ██║███████║    ██║  ██║██║
 ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝      ╚═════╝ ╚══════╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝    ╚═╝  ╚═╝╚═╝

Hackathon Campuslands 2026 — Built with ❤️ by Sergio, Michael, Daniel, Mario & Santiago
`, 'color: #00d4ff; font-size: 8px; font-family: monospace;');

/* ════════════════════════════════════════════
   CAMPUSVERSE AI — script.js
   ════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════════
   WEBHOOK CONFIGURATION
   ════════════════════════════════════════════
   Coloca aquí la URL de tu webhook (Make, Zapier, n8n, etc.)
   cuando lo tengas disponible. Esta función se llama cada
   vez que el Mentor IA recibe un mensaje del usuario.

   Ejemplo Make.com:   'https://hook.eu1.make.com/tu-id-aqui'
   Ejemplo n8n:        'https://tu-n8n.app/webhook/tu-id-aqui'
   Ejemplo Zapier:     'https://hooks.zapier.com/hooks/catch/tu-id-aqui'
   ════════════════════════════════════════════ */
const WEBHOOK_URL = 'https://icon-lingo-essay.ngrok-free.dev/webhook-test/campusverse-chat';

async function sendToWebhook(payload) {
  if (!WEBHOOK_URL) return null; // Si no hay webhook configurado, retorna null
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const text = await response.text();
    console.log('[CVAI] Webhook response text:', text);
    
    if (!text || text.trim() === '') {
      console.log('[CVAI] Respuesta vacía del webhook');
      return null;
    }
    
    try {
      const data = JSON.parse(text);
      console.log('[CVAI] Webhook response JSON:', data);
      
      // Buscar la respuesta en diferentes propiedades posibles
      const responseText = data.respuesta || data.response || data.message || data.reply || data.text || data.result;
      
      if (responseText && responseText.trim() !== '') {
        return responseText;
      }
    } catch (e) {
      // Si no es JSON válido, devuelve el texto como está
      console.log('[CVAI] Respuesta no es JSON válido, usando como texto:', text);
      return text;
    }
    
    return null;
  } catch (err) {
    console.error('[CVAI] Webhook error:', err);
    return null;
  }
}

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
      number: { value: 60, density: { enable: true, value_area: 1000 } },
      color: { value: ['#00d4ff', '#8b5cf6', '#06d6a0'] },
      shape: { type: 'circle' },
      opacity: { value: 0.35, random: true, anim: { enable: true, speed: 1, opacity_min: 0.05 } },
      size: { value: 2, random: true },
      line_linked: { enable: true, distance: 130, color: '#00d4ff', opacity: 0.08, width: 1 },
      move: { enable: true, speed: 1.0, direction: 'none', random: true, out_mode: 'out' },
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
      modes: { grab: { distance: 160, line_linked: { opacity: 0.3 } }, push: { particles_nb: 2 } },
    },
    retina_detect: true,
  });
}



/* ── 5. GLOBAL 3D BACKGROUND (Three.js) ──────
   El mismo fondo animado del hero, pero fijo y
   persistente en TODAS las secciones de la página
   ──────────────────────────────────────────── */
(function initGlobalBackground() {
  const canvas = document.getElementById('global-bg-canvas');
  if (!canvas || !window.THREE) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);


  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 6);


  // --- Grid plane (floor) ---
  const gridHelper = new THREE.GridHelper(60, 50, 0x00d4ff, 0x00d4ff);
  gridHelper.material.opacity = 0.05;
  gridHelper.material.transparent = true;
  gridHelper.position.y = -5;
  gridHelper.rotation.x = Math.PI / 8;
  scene.add(gridHelper);

  // --- Second grid (ceiling) ---
  const gridHelper2 = new THREE.GridHelper(60, 50, 0x8b5cf6, 0x8b5cf6);
  gridHelper2.material.opacity = 0.03;
  gridHelper2.material.transparent = true;
  gridHelper2.position.y = 5;
  gridHelper2.rotation.x = -Math.PI / 8;
  scene.add(gridHelper2);

  // --- Floating particles ---
  const sphereGeo = new THREE.SphereGeometry(0.05, 6, 6);
  const colors = [0x00d4ff, 0x8b5cf6, 0x06d6a0, 0xec4899];
  const floaters = [];
  for (let i = 0; i < 50; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.4 + Math.random() * 0.3,
    });
    const mesh = new THREE.Mesh(sphereGeo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 18,
      (Math.random() - 0.5) * 12 - 3
    );
    mesh.userData = {
      vx: (Math.random() - 0.5) * 0.004,
      vy: (Math.random() - 0.5) * 0.003,
      vz: (Math.random() - 0.5) * 0.002,
      phase: Math.random() * Math.PI * 2,
    };
    scene.add(mesh);
    floaters.push(mesh);
  }


  // --- Connection lines (wireframe cube-like shapes) ---
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.06 });
  for (let i = 0; i < 8; i++) {
    const points = [];
    const cx = (Math.random() - 0.5) * 20;
    const cy = (Math.random() - 0.5) * 12;
    const cz = (Math.random() - 0.5) * 8 - 4;
    const r = 1.5 + Math.random() * 2;
    const sides = 3 + Math.floor(Math.random() * 4);
    for (let j = 0; j <= sides; j++) {
      const a = (j / sides) * Math.PI * 2;
      points.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, cz));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    scene.add(new THREE.Line(geo, lineMat));
  }

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;
    const t = frame * 0.006;

    // Slow grid drift
    gridHelper.rotation.z  = t * 0.0003;
    gridHelper2.rotation.z = -t * 0.0002;

    // Animate floaters
    floaters.forEach((f, i) => {
      f.position.x += f.userData.vx;
      f.position.y += f.userData.vy + Math.sin(t + f.userData.phase) * 0.001;
      f.position.z += f.userData.vz;
      if (Math.abs(f.position.x) > 15) f.userData.vx *= -1;
      if (Math.abs(f.position.y) > 9)  f.userData.vy *= -1;
      if (f.position.z > 2 || f.position.z < -10) f.userData.vz *= -1;
    });

    
    // Subtle camera drift
    camera.position.x = Math.sin(t * 0.08) * 0.4;
    camera.position.y = Math.cos(t * 0.06) * 0.2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
})();

/* ── 6. GSAP SCROLL ANIMATIONS ──────────────── */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-title', {
    duration: 1.2,
    y: 60,
    opacity: 0,
    ease: 'power4.out',
    delay: 0.3,
  });

  gsap.from('.hero-sub', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.6,
  });

  // Parallax on robot wrap
  gsap.to('#robot-wrap', {
    y: 60,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

/* ── 7. STAT COUNTERS ─────────────────────── */
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
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ── 8. KPI LIVE UPDATE ──────────────────── */
function randomDelta(val, range) { return Math.max(1, val + Math.floor((Math.random() - 0.5) * range)); }
setInterval(() => {
  const kpi1 = document.getElementById('kpi1');
  const kpi4 = document.getElementById('kpi4');
  if (kpi1) kpi1.textContent = randomDelta(parseInt(kpi1.textContent) || 247, 6);
  if (kpi4) kpi4.textContent = randomDelta(parseInt(kpi4.textContent) || 38, 3);
}, 3000);

/* ── 9. DONUT CHART ─────────────────────── */
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
  ctx.fillStyle = '#e8f4ff';
  ctx.font = 'bold 22px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AI', cx, cy - 8);
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillStyle = '#8ba3c7';
  ctx.fillText('TRENDS', cx, cy + 12);
})();

/* ── 10. LINE CHART ─────────────────────── */
(function drawLine() {
  const canvas = document.getElementById('lineChart');
  if (!canvas) return;
  const parent = canvas.parentElement;
  canvas.width = parent.offsetWidth - 40;
  canvas.height = 70;
  const ctx = canvas.getContext('2d');
  const points = Array.from({ length: 20 }, (_, i) => 30 + Math.sin(i * 0.5) * 20 + Math.random() * 10);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width, h = canvas.height;
    const stepX = w / (points.length - 1);
    const maxY = Math.max(...points);
    const toY = v => h - (v / maxY) * (h - 6) - 3;
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
    ctx.beginPath();
    ctx.moveTo(0, toY(points[0]));
    points.forEach((p, i) => ctx.lineTo(i * stepX, toY(p)));
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  draw();
  setInterval(() => { points.shift(); points.push(30 + Math.random() * 40); draw(); }, 800);
})();

/* ── 11. MENTOR CHAT ─────────────────────── */
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

  // Show loading message
  const body = document.getElementById('chat-body');
  if (body) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-msg bot';
    loadingDiv.id = 'loading-msg';
    loadingDiv.innerHTML = '<span class="msg-icon">🤖</span><div class="bubble">Consultando al Mentor IA...</div>';
    body.appendChild(loadingDiv);
    body.scrollTop = body.scrollHeight;
  }

  // Intentar obtener respuesta del webhook, si falla usar respuestas locales
  sendToWebhook({
    event: 'mentor_chat_message',
    message: text,
    timestamp: new Date().toISOString(),
    source: 'CampusVerse AI — Mentor Chat',
  }).then(webhookResponse => {
    const loadingMsg = document.getElementById('loading-msg');
    if (loadingMsg) loadingMsg.remove();
    
    // Usar respuesta del webhook si existe, sino usar respuesta local
    const finalResponse = webhookResponse || getResponse(text);
    addMessage(finalResponse, false);
  });
}

function sendSuggestion(btn) {
  const input = document.getElementById('chat-input');
  if (!input) return;
  input.value = btn.textContent;
  handleChatSend();
}
const chatInput = document.getElementById('chat-input');
chatInput && chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleChatSend(); });

/* ── 12. MAP NODE HOVER LABELS ───────────── */
document.querySelectorAll('.map-node').forEach(node => {
  node.addEventListener('mouseenter', () => { node.querySelector('span').style.color = '#00d4ff'; });
  node.addEventListener('mouseleave', () => { node.querySelector('span').style.color = ''; });
});

/* ── 13. SMOOTH SECTION LINKS ──────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const links = document.querySelector('.nav-links');
      if (links && links.style.display === 'flex') links.style.cssText = '';
    }
  });
});

/* ── 14. FEATURE CARD NEON TRAIL ─────────── */
document.querySelectorAll('.feature-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,212,255,0.09), rgba(10,14,28,0.7) 60%)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });
});

/* ── 15. PROGRESS BARS ANIMATE ON VIEW ──── */
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

/* ── 16. CONSOLE EASTER EGG ──────────────── */
console.log(`%c
 ██████╗██╗   ██╗ █████╗ ██╗
██╔════╝██║   ██║██╔══██╗██║
██║     ██║   ██║███████║██║
██║     ╚██╗ ██╔╝██╔══██║██║
╚██████╗ ╚████╔╝ ██║  ██║██║
 ╚═════╝  ╚═══╝  ╚═╝  ╚═╝╚═╝

CampusVerse AI — Hackathon Campuslands 2026
Built with ❤️ by Sergio, Michael, Daniel, Mario & Santiago
`, 'color: #00d4ff; font-size: 9px; font-family: monospace;');
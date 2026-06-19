/**
 * ═══════════════════════════════════════════════════
 *  CampusVerse AI — server.js
 *  Backend Node.js + Express
 *  Sirve: galería FiftyOne, Mentor IA, analytics
 * ═══════════════════════════════════════════════════
 *
 * INSTALACIÓN:
 *   npm install express cors dotenv node-fetch
 *
 * ARRANQUE:
 *   node server.js
 *   El servidor corre en http://localhost:3000
 */

'use strict';

const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());

// Sirve los archivos estáticos del proyecto (HTML, CSS, JS, imágenes)
app.use(express.static(path.join(__dirname)));

// Sirve los screenshots para la galería
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));


// ══════════════════════════════════════════════════
//  RUTAS DE LA API
// ══════════════════════════════════════════════════

/**
 * GET /api/gallery
 * Devuelve el JSON generado por FiftyOne con las imágenes
 * etiquetadas del campus de Roblox.
 */
app.get('/api/gallery', (req, res) => {
  const galleryPath = path.join(__dirname, 'data', 'campus_gallery.json');

  if (!fs.existsSync(galleryPath)) {
    return res.status(404).json({
      error:   'Galería no generada aún.',
      mensaje: 'Ejecuta primero: python fiftyone_campus.py',
    });
  }

  try {
    const raw  = fs.readFileSync(galleryPath, 'utf-8');
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error leyendo la galería', detalle: err.message });
  }
});


/**
 * GET /api/gallery/zona/:zona
 * Filtra la galería por zona del campus.
 * Ejemplo: GET /api/gallery/zona/Laboratorio%20IA
 */
app.get('/api/gallery/zona/:zona', (req, res) => {
  const galleryPath = path.join(__dirname, 'data', 'campus_gallery.json');
  const zonaFiltro  = decodeURIComponent(req.params.zona);

  if (!fs.existsSync(galleryPath)) {
    return res.status(404).json({ error: 'Galería no generada aún.' });
  }

  const data   = JSON.parse(fs.readFileSync(galleryPath, 'utf-8'));
  const filtro = data.galeria.filter(img =>
    img.zona.toLowerCase().includes(zonaFiltro.toLowerCase())
  );

  res.json({ zona: zonaFiltro, total: filtro.length, galeria: filtro });
});


/**
 * GET /api/gallery/stats
 * Devuelve estadísticas de las zonas analizadas por FiftyOne.
 * El frontend las usa en el dashboard de coordinadores.
 */
app.get('/api/gallery/stats', (req, res) => {
  const galleryPath = path.join(__dirname, 'data', 'campus_gallery.json');

  if (!fs.existsSync(galleryPath)) {
    return res.status(404).json({ error: 'Galería no generada aún.' });
  }

  const data = JSON.parse(fs.readFileSync(galleryPath, 'utf-8'));

  // Calcular clase más detectada
  const conteoClases = {};
  data.galeria.forEach(img => {
    img.etiquetas.forEach(e => {
      conteoClases[e.clase] = (conteoClases[e.clase] || 0) + 1;
    });
  });

  const claseTop = Object.entries(conteoClases)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([clase, total]) => ({ clase, total }));

  res.json({
    total_imagenes:         data.total_imagenes,
    generado_en:            data.generado_en,
    estadisticas_por_zona:  data.estadisticas_por_zona,
    clases_mas_detectadas:  claseTop,
    plugin_usado:           data.plugin_usado,
    modelo:                 data.modelo,
  });
});


/**
 * POST /api/mentor
 * Mentor IA — recibe el mensaje del usuario y responde.
 *
 * Si tienes OPENAI_API_KEY en .env, usa GPT real.
 * Si no, usa respuestas predefinidas sobre Campuslands.
 */
app.post('/api/mentor', async (req, res) => {
  const { mensaje, historial = [] } = req.body;

  if (!mensaje || mensaje.trim() === '') {
    return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
  }

  // Registrar en analytics
  registrarEvento('mentor_chat', { mensaje, timestamp: new Date().toISOString() });

  // Si hay API Key de OpenAI, usar GPT
  if (process.env.OPENAI_API_KEY) {
    try {
      const fetch = (await import('node-fetch')).default;

      const messages = [
        {
          role: 'system',
          content: `Eres el Mentor IA de CampusVerse AI, el campus virtual de Campuslands.
Campuslands es una institución de formación en tecnología ubicada en Colombia.
Ofrece programas en: Desarrollo de Software, Inteligencia Artificial, Data Science, UX/UI Design y Cloud Computing.
El campus virtual en Roblox tiene zonas: Hall Principal, Laboratorio IA, Dev Hub, Studio Creativo, Innovation Hub, Data Center.
Responde siempre en español, de forma amigable, concisa y motivadora.
Si no sabes algo, sugiere explorar el campus virtual o contactar un asesor.`
        },
        ...historial.map(h => ({ role: h.rol, content: h.texto })),
        { role: 'user', content: mensaje },
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model:       'gpt-3.5-turbo',
          messages,
          max_tokens:  300,
          temperature: 0.7,
        }),
      });

      const data     = await response.json();
      const respuesta = data.choices?.[0]?.message?.content || respuestaLocal(mensaje);

      return res.json({ respuesta, fuente: 'openai' });

    } catch (err) {
      console.error('[Mentor IA] Error OpenAI:', err.message);
      return res.json({ respuesta: respuestaLocal(mensaje), fuente: 'local' });
    }
  }

  // Sin API Key → respuesta local predefinida
  return res.json({ respuesta: respuestaLocal(mensaje), fuente: 'local' });
});


/**
 * POST /api/analytics/evento
 * Registra eventos de comportamiento del usuario
 * (qué zonas visitó, cuánto tiempo pasó, clics, etc.)
 * El dashboard de coordinadores los consume.
 */
app.post('/api/analytics/evento', (req, res) => {
  const { tipo, datos } = req.body;

  if (!tipo) {
    return res.status(400).json({ error: 'El tipo de evento es obligatorio.' });
  }

  registrarEvento(tipo, datos || {});
  res.json({ ok: true, tipo, timestamp: new Date().toISOString() });
});


/**
 * GET /api/analytics
 * Devuelve los eventos registrados para el dashboard de coordinadores.
 */
app.get('/api/analytics', (req, res) => {
  const analyticsPath = path.join(__dirname, 'data', 'analytics.json');

  if (!fs.existsSync(analyticsPath)) {
    return res.json({ eventos: [], total: 0 });
  }

  const data = JSON.parse(fs.readFileSync(analyticsPath, 'utf-8'));
  res.json(data);
});


/**
 * GET /api/recomendador/:perfil
 * Recomendador inteligente: recibe un perfil de intereses
 * y devuelve el programa académico más adecuado.
 */
app.get('/api/recomendador/:perfil', (req, res) => {
  const perfil = req.params.perfil.toLowerCase();

  const recomendaciones = {
    'ia':         { programa: 'Inteligencia Artificial', zona: 'Laboratorio IA',  descripcion: 'Aprende ML, NLP y visión computacional.' },
    'codigo':     { programa: 'Desarrollo de Software',  zona: 'Dev Hub',         descripcion: 'Domina JavaScript, Python y arquitectura de software.' },
    'datos':      { programa: 'Data Science',            zona: 'Data Center',     descripcion: 'Analítica, visualización y Big Data.' },
    'diseño':     { programa: 'UX/UI Design',            zona: 'Studio Creativo', descripcion: 'Crea interfaces que enamoran a los usuarios.' },
    'nube':       { programa: 'Cloud Computing',         zona: 'Innovation Hub',  descripcion: 'AWS, Azure y arquitecturas serverless.' },
    'innovacion': { programa: 'Cloud Computing',         zona: 'Innovation Hub',  descripcion: 'Lidera proyectos de transformación digital.' },
  };

  const resultado = Object.entries(recomendaciones).find(([key]) =>
    perfil.includes(key)
  );

  if (resultado) {
    res.json({ perfil, recomendacion: resultado[1], confianza: 0.92 });
  } else {
    res.json({
      perfil,
      recomendacion: {
        programa:    'Desarrollo de Software',
        zona:        'Hall Principal',
        descripcion: 'Empieza explorando el campus y descubre tu área ideal.',
      },
      confianza: 0.60,
    });
  }
});


// ══════════════════════════════════════════════════
//  FUNCIONES AUXILIARES
// ══════════════════════════════════════════════════

/** Respuestas locales del Mentor IA sin OpenAI */
function respuestaLocal(mensaje) {
  const m = mensaje.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (m.includes('ia') || m.includes('inteligencia')) {
    return '¡La IA es el corazón de Campuslands! Te recomiendo visitar el **Laboratorio IA** donde encontrarás proyectos de Machine Learning, NLP y visión computacional. ¿Te llevo hasta allá? 🧬';
  }
  if (m.includes('programa') || m.includes('curso') || m.includes('estudiar')) {
    return 'Campuslands ofrece: **Desarrollo de Software**, **IA**, **Data Science**, **UX/UI Design** y **Cloud Computing**. Todos con enfoque práctico y empleabilidad real. ¿Cuál te llama más? 🎓';
  }
  if (m.includes('campus') || m.includes('recorr') || m.includes('zona')) {
    return 'El campus virtual tiene 5 zonas: **Hall Principal** (entrada), **Lab IA** (experimentos), **Dev Hub** (código), **Studio Creativo** (diseño) e **Innovation Hub** (proyectos del futuro). ¿Por cuál empezamos? 🗺️';
  }
  if (m.includes('roblox') || m.includes('juego') || m.includes('virtual')) {
    return 'El campus en **Roblox** es completamente navegable. Puedes interactuar con otros estudiantes, asistir a demos en vivo y completar misiones. ¡Es educación gamificada! 🎮';
  }
  if (m.includes('mision') || m.includes('logro') || m.includes('xp')) {
    return 'El sistema de misiones tiene 4 niveles: **Explorador** (250 XP), **Raro** (500 XP), **Épico** (1000 XP) y **Legendario** (2500 XP). ¡Completa misiones y desbloquea insignias exclusivas! 🏆';
  }
  if (m.includes('hola') || m.includes('buenos') || m.includes('saludos')) {
    return '¡Hola! Soy tu Mentor IA de CampusVerse. Estoy aquí para guiarte por el campus virtual de Campuslands y ayudarte a encontrar tu ruta académica ideal. ¿Qué te trae por aquí? 👋';
  }

  return 'Entiendo tu consulta. Como tu Mentor IA, te recomiendo explorar el campus para encontrar la respuesta de forma experiencial. También puedes chatear con un asesor humano. ¿En qué más puedo ayudarte? ✨';
}


/** Registra un evento en data/analytics.json */
function registrarEvento(tipo, datos) {
  const analyticsPath = path.join(__dirname, 'data', 'analytics.json');
  os.makedirs && null; // no-op

  let analytics = { eventos: [], total: 0 };

  if (fs.existsSync(analyticsPath)) {
    try {
      analytics = JSON.parse(fs.readFileSync(analyticsPath, 'utf-8'));
    } catch (_) {}
  }

  const evento = {
    id:        `evt_${Date.now()}`,
    tipo,
    datos,
    timestamp: new Date().toISOString(),
  };

  analytics.eventos.push(evento);
  analytics.total = analytics.eventos.length;

  // Mantener solo los últimos 500 eventos
  if (analytics.eventos.length > 500) {
    analytics.eventos = analytics.eventos.slice(-500);
  }

  if (!fs.existsSync('data')) fs.mkdirSync('data', { recursive: true });
  fs.writeFileSync(analyticsPath, JSON.stringify(analytics, null, 2));
}


// ── Arrancar servidor ───────────────────────────────
app.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════╗`);
  console.log(`║   CampusVerse AI — Servidor Node.js   ║`);
  console.log(`╚═══════════════════════════════════════╝`);
  console.log(`✓ Corriendo en http://localhost:${PORT}`);
  console.log(`✓ API Gallery:     http://localhost:${PORT}/api/gallery`);
  console.log(`✓ API Stats:       http://localhost:${PORT}/api/gallery/stats`);
  console.log(`✓ API Mentor IA:   http://localhost:${PORT}/api/mentor`);
  console.log(`✓ API Analytics:   http://localhost:${PORT}/api/analytics\n`);
});

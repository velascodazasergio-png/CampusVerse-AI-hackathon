/**
 * ════════════════════════════════════════════
 * CAMPUSVERSE AI — types.ts
 * Tipos TypeScript y utilidades del proyecto
 * Hackathon Campuslands 2026
 * ════════════════════════════════════════════
 */

/* ══════════════════════════════════════════
   TIPOS DE EVENTOS WEBHOOK
   ══════════════════════════════════════════ */

export type WebhookEventType =
  | 'mentor_chat_message'
  | 'user_joined'
  | 'user_zone_visited'
  | 'mission_completed'
  | 'mission_progress'
  | 'dashboard_viewed'
  | 'page_section_viewed';

export interface WebhookBasePayload {
  event: WebhookEventType;
  timestamp: string;         // ISO 8601
  source: string;            // e.g. 'CampusVerse AI'
  sessionId?: string;
  userId?: string;
}

export interface ChatMessagePayload extends WebhookBasePayload {
  event: 'mentor_chat_message';
  message: string;
  responseGiven?: string;
}

export interface ZoneVisitPayload extends WebhookBasePayload {
  event: 'user_zone_visited';
  zone: CampusZone;
  durationSeconds?: number;
}

export interface MissionPayload extends WebhookBasePayload {
  event: 'mission_completed' | 'mission_progress';
  missionId: string;
  missionTitle: string;
  xpAwarded?: number;
  progressPercent?: number;
}

export type WebhookPayload =
  | ChatMessagePayload
  | ZoneVisitPayload
  | MissionPayload
  | WebhookBasePayload;

/* ══════════════════════════════════════════
   CAMPUS — ZONAS
   ══════════════════════════════════════════ */

export type CampusZone =
  | 'hall_principal'
  | 'laboratorio_ia'
  | 'dev_hub'
  | 'studio_creativo'
  | 'innovation_hub'
  | 'data_center';

export interface ZoneInfo {
  id: CampusZone;
  label: string;
  description: string;
  icon: string;
  color: string;  // hex
  visitCount: number;
}

export const CAMPUS_ZONES: Record<CampusZone, ZoneInfo> = {
  hall_principal: {
    id: 'hall_principal',
    label: 'Hall Principal',
    description: 'Punto de partida del campus virtual',
    icon: '🏛️',
    color: '#00d4ff',
    visitCount: 0,
  },
  laboratorio_ia: {
    id: 'laboratorio_ia',
    label: 'Laboratorio IA',
    description: 'Experimenta con modelos de IA',
    icon: '🧬',
    color: '#00d4ff',
    visitCount: 0,
  },
  dev_hub: {
    id: 'dev_hub',
    label: 'Dev Hub',
    description: 'Zona de desarrollo y código',
    icon: '💻',
    color: '#8b5cf6',
    visitCount: 0,
  },
  studio_creativo: {
    id: 'studio_creativo',
    label: 'Studio Creativo',
    description: 'Diseño UX/UI y experiencias',
    icon: '🎨',
    color: '#06d6a0',
    visitCount: 0,
  },
  innovation_hub: {
    id: 'innovation_hub',
    label: 'Innovation Hub',
    description: 'Proyectos del futuro',
    icon: '📡',
    color: '#f59e0b',
    visitCount: 0,
  },
  data_center: {
    id: 'data_center',
    label: 'Data Center',
    description: 'Analítica e inteligencia de datos',
    icon: '📊',
    color: '#ec4899',
    visitCount: 0,
  },
};

/* ══════════════════════════════════════════
   MISIONES
   ══════════════════════════════════════════ */

export type MissionRarity = 'explorador' | 'raro' | 'epico' | 'legendario';
export type MissionStatus = 'bloqueada' | 'en_progreso' | 'completada';

export interface Mission {
  id: string;
  title: string;
  description: string;
  rarity: MissionRarity;
  xpReward: number;
  status: MissionStatus;
  progress: number;     // 0–100
  maxProgress: number;  // total steps
  currentProgress: number;
  icon: string;
}

export const MISSIONS: Mission[] = [
  {
    id: 'explorador_campuslands',
    title: 'Explorador Campuslands',
    description: 'Recorre todas las zonas del campus virtual por primera vez.',
    rarity: 'explorador',
    xpReward: 250,
    status: 'completada',
    progress: 100,
    maxProgress: 6,
    currentProgress: 6,
    icon: '🏆',
  },
  {
    id: 'ai_hunter',
    title: 'AI Hunter',
    description: 'Interactúa con el Mentor IA más de 10 veces en una sesión.',
    rarity: 'raro',
    xpReward: 500,
    status: 'en_progreso',
    progress: 70,
    maxProgress: 10,
    currentProgress: 7,
    icon: '🔍',
  },
  {
    id: 'future_developer',
    title: 'Future Developer',
    description: 'Completa todas las misiones del Hub de Desarrollo.',
    rarity: 'epico',
    xpReward: 1000,
    status: 'en_progreso',
    progress: 30,
    maxProgress: 10,
    currentProgress: 3,
    icon: '⚡',
  },
  {
    id: 'innovation_master',
    title: 'Innovation Master',
    description: 'Descubre todos los secretos ocultos del Campus Virtual.',
    rarity: 'legendario',
    xpReward: 2500,
    status: 'bloqueada',
    progress: 10,
    maxProgress: 20,
    currentProgress: 2,
    icon: '👑',
  },
];

/* ══════════════════════════════════════════
   DASHBOARD / ANALÍTICA
   ══════════════════════════════════════════ */

export interface DashboardKPIs {
  activeUsers: number;
  avgSessionTime: string;   // e.g. '1.8h'
  satisfactionRate: string; // e.g. '94%'
  missionsCompleted: number;
}

export interface ZoneAnalytics {
  zone: CampusZone;
  visitPercent: number;     // 0–100
  avgDurationMinutes: number;
}

export interface TechPreference {
  label: string;
  percent: number;
  color: string;
}

export const TECH_PREFERENCES: TechPreference[] = [
  { label: 'IA',     percent: 38, color: '#00d4ff' },
  { label: 'Roblox', percent: 27, color: '#8b5cf6' },
  { label: 'Data',   percent: 20, color: '#06d6a0' },
  { label: 'UX',     percent: 15, color: '#f59e0b' },
];

/* ══════════════════════════════════════════
   EQUIPO
   ══════════════════════════════════════════ */

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  description: string;
  skills: string[];
  avatarColor: 'default' | 'cyan' | 'purple' | 'green' | 'orange';
  github?: string;
  linkedin?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    initials: 'SV',
    name: 'Sergio Velasco Daza',
    role: 'Frontend Developer & UX Designer',
    description: 'Especialista en desarrollo frontend, diseño de interfaces modernas y experiencias digitales inmersivas. Arquitecto visual de CampusVerse AI.',
    skills: ['HTML/CSS', 'Three.js', 'UX'],
    avatarColor: 'default',
  },
  {
    initials: 'MS',
    name: 'Michael Fernando Santos',
    role: 'Full Stack Developer & Systems Architect',
    description: 'Responsable de la planificación técnica y estructuración del ecosistema digital. Integración de servicios y sistemas escalables.',
    skills: ['Node.js', 'APIs', 'Arquitectura'],
    avatarColor: 'cyan',
  },
  {
    initials: 'DV',
    name: 'Daniel Fernando Vargas Sarmiento',
    role: 'Artificial Intelligence Engineer',
    description: 'Investigación e integración de soluciones basadas en IA. Conceptualizó el Mentor IA y los sistemas de recomendación inteligente.',
    skills: ['Python', 'ML', 'NLP'],
    avatarColor: 'purple',
  },
  {
    initials: 'MR',
    name: 'Mario Alberto Rojas',
    role: 'Game Environment Designer',
    description: 'Especialista en diseño de entornos virtuales. Lideró la construcción del campus en Roblox optimizando interacción y espacios educativos.',
    skills: ['Roblox Studio', '3D', 'Lua'],
    avatarColor: 'green',
  },
  {
    initials: 'SM',
    name: 'Santiago Mendoza Barona',
    role: 'Data Analytics & Innovation Specialist',
    description: 'Diseño de métricas, visualización de datos y análisis de comportamiento. Convierte datos en estrategia para mejorar la experiencia educativa.',
    skills: ['Python', 'D3.js', 'Analytics'],
    avatarColor: 'orange',
  },
];

/* ══════════════════════════════════════════
   ROADMAP / FASES
   ══════════════════════════════════════════ */

export type PhaseStatus = 'completado' | 'en_curso' | 'proximo';

export interface RoadmapPhase {
  number: string;    // '01', '02', ...
  title: string;
  description: string;
  status: PhaseStatus;
  eta?: string;      // e.g. '2026'
}

export const ROADMAP: RoadmapPhase[] = [
  { number: '01', title: 'Investigación',    description: 'Análisis de necesidades, benchmarking y definición de arquitectura.',           status: 'completado' },
  { number: '02', title: 'Diseño UX/UI',     description: 'Wireframes, prototipos y sistema visual de la plataforma.',                      status: 'completado' },
  { number: '03', title: 'Desarrollo Roblox',description: 'Construcción del campus virtual 3D en Roblox Studio.',                          status: 'completado' },
  { number: '04', title: 'Integración IA',   description: 'Implementación del Mentor IA y sistema de recomendaciones.',                    status: 'en_curso'   },
  { number: '05', title: 'Analítica',         description: 'Dashboard de métricas y sistema de visualización de datos.',                    status: 'proximo'    },
  { number: '06', title: 'Lanzamiento',       description: 'Despliegue público y presentación en Hackathon Campuslands.',                   status: 'proximo', eta: '2026' },
];

/* ══════════════════════════════════════════
   WEBHOOK HELPER (para importar en otros módulos)
   ══════════════════════════════════════════ */

export async function sendWebhookEvent(
  webhookUrl: string,
  payload: WebhookPayload
): Promise<boolean> {
  if (!webhookUrl) {
    console.warn('[CVAI] No webhook URL configured.');
    return false;
  }
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('[CVAI] Webhook send failed:', err);
    return false;
  }
}

/* ══════════════════════════════════════════
   UTILIDADES GENERALES
   ══════════════════════════════════════════ */

/** Genera un ID de sesión único basado en tiempo + random */
export function generateSessionId(): string {
  return `cvai_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Formatea segundos como '1h 24m' */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** Normaliza texto para búsquedas (sin tildes, minúsculas) */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Clamp un número entre min y max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Interpola linealmente entre a y b por t (0–1) */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
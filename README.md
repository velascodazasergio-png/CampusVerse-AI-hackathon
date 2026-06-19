[🎓 CampusVerse AI.md](https://github.com/user-attachments/files/29151959/CampusVerse.AI.md)

# 🎓 CampusVerse AI

## Transformando la experiencia educativa mediante IA, analítica de datos y gamificación

---

# 📖 Descripción

CampusVerse AI es una plataforma inteligente diseñada para potenciar la experiencia educativa dentro de Campuslands mediante la integración de:

- Inteligencia Artificial Generativa
- Analítica de Datos
- Gamificación
- Entornos Virtuales Inmersivos
- Automatización Inteligente

La solución combina un campus virtual desarrollado en Roblox con una plataforma web impulsada por IA que permite orientar estudiantes, personalizar experiencias de aprendizaje y proporcionar información estratégica para la toma de decisiones académicas.

---

# 🚨 Problemática

Las instituciones educativas generan constantemente información relacionada con:

- Asistencia
- Participación
- Aprendizaje
- Intereses académicos
- Rendimiento estudiantil

Sin embargo, gran parte de estos datos no son aprovechados para:

- Brindar acompañamiento personalizado.
- Detectar tendencias académicas.
- Optimizar recursos educativos.
- Mejorar la experiencia de aprendizaje.
- Facilitar la toma de decisiones institucionales.

---

# 💡 Nuestra Solución

CampusVerse AI transforma las interacciones de los estudiantes en información accionable mediante una plataforma compuesta por:

## 🕹️ Campus Virtual Roblox

Espacio inmersivo donde los usuarios pueden:

- Explorar Campuslands.
- Conocer rutas tecnológicas.
- Participar en desafíos.
- Completar misiones educativas.
- Descubrir áreas de interés profesional.

---

## 🤖 Mentor IA

Asistente académico inteligente capaz de:

- Resolver dudas.
- Explicar rutas de aprendizaje.
- Recomendar tecnologías.
- Guiar estudiantes.
- Ofrecer acompañamiento personalizado.

---

## 🎯 Sistema Inteligente de Recomendación

Analiza:

- Comportamiento del usuario.
- Zonas visitadas.
- Tiempo de interacción.
- Preguntas realizadas.
- Logros obtenidos.

Genera:

- Recomendaciones académicas.
- Sugerencias de contenido.
- Rutas tecnológicas personalizadas.

---

## 📊 Dashboard Analítico

Panel de control para coordinadores que permite visualizar:

- Intereses predominantes.
- Tendencias académicas.
- Participación estudiantil.
- Consultas frecuentes.
- Áreas más visitadas del campus virtual.

---

# 🏗️ Arquitectura

```text
Usuario
   │
   ▼
Roblox Campus
   │
   ▼
API REST
   │
   ▼
n8n Workflows
   │
 ┌─┴────────────┐
 ▼             ▼
Gemini      PostgreSQL
 ▼             ▼
IA         Analítica
 ▼             ▼
Recomendador Dashboard
```

---

# 🧠 Inteligencia Artificial

## Mentor IA

Desarrollado utilizando:

- Gemini 2.5 Flash
- Retrieval Augmented Generation (RAG)
- n8n AI Agent

Funciones:

- Responder preguntas académicas.
- Recomendar rutas de aprendizaje.
- Proporcionar orientación personalizada.
- Generar respuestas contextuales.

---

# 📈 Analítica de Datos

Cada interacción realizada dentro del campus virtual genera eventos que son almacenados y analizados para obtener métricas relevantes.

Ejemplos:

- Tiempo de permanencia.
- Zonas visitadas.
- Intereses predominantes.
- Frecuencia de consultas.
- Participación en actividades.

---

# 🔬 FiftyOne

Para el análisis avanzado de comportamiento e información visual se utiliza FiftyOne.

## Plugin: Zero-Shot Prediction

### Objetivo

Clasificar automáticamente intereses de los usuarios sin necesidad de entrenamiento previo.

### Funcionamiento

A partir de:

- Zonas visitadas.
- Consultas al Mentor IA.
- Actividades realizadas.

El sistema puede inferir intereses como:

- Inteligencia Artificial
- Desarrollo Web
- Ciencia de Datos
- Ciberseguridad
- Backend

### Beneficios

- Clasificación automática.
- Segmentación inteligente.
- Recomendaciones más precisas.

### Ejemplo

```text
Usuario:

- Visitó Laboratorio IA
- Consultó sobre Machine Learning
- Completó desafío Python

Predicción:

Interés Principal:
Inteligencia Artificial
```

---

## Plugin: ScreenParser

### Objetivo

Extraer información visual del entorno virtual para generar métricas de interacción.

### Funcionamiento

Analiza capturas y elementos visuales presentes en el campus virtual.

Permite identificar:

- Objetos observados.
- Recursos más visualizados.
- Contenido de mayor interés.
- Patrones de navegación.

### Beneficios

- Comprensión visual del comportamiento.
- Análisis contextual.
- Métricas avanzadas de interacción.

### Ejemplo

```text
Pantalla analizada:

- Área IA visible
- Panel Python visible
- Tutorial Machine Learning visible

Resultado:

Categoría detectada:
Inteligencia Artificial
```

---

## Plugin: Similarity Search

Permite encontrar usuarios con comportamientos similares.

### Aplicaciones

- Recomendaciones académicas.
- Agrupación por intereses.
- Descubrimiento de perfiles afines.

---

## Plugin: Embeddings Visualization

Visualiza agrupaciones de usuarios según sus intereses.

### Beneficios

- Identificación de tendencias.
- Segmentación de perfiles.
- Detección de comunidades de aprendizaje.

---

# 🔄 Flujo de Datos

```text
Interacción Usuario
        │
        ▼
Campus Roblox
        │
        ▼
Registro de Eventos
        │
        ▼
PostgreSQL
        │
        ▼
FiftyOne
        │
        ▼
Análisis IA
        │
        ▼
Dashboard
```

---

# 🛠️ Tecnologías Utilizadas

## Frontend

- React
- Tailwind CSS
- Chart.js

## Backend

- Node.js
- Express.js

## Base de Datos

- PostgreSQL

## Automatización

- n8n

## Inteligencia Artificial

- Gemini 2.5 Flash
- RAG
- AI Agent

## Analítica

- FiftyOne
- Pandas

## Entorno Virtual

- Roblox Studio

## APIs

- REST API
- Webhooks

---

# 🎯 Impacto Esperado

## Para Estudiantes

- Orientación personalizada.
- Mayor participación.
- Aprendizaje gamificado.
- Descubrimiento de rutas tecnológicas.

## Para Mentores

- Seguimiento inteligente.
- Menos consultas repetitivas.
- Mejor acompañamiento.

## Para Coordinadores

- Información en tiempo real.
- Detección de tendencias.
- Toma de decisiones basada en datos.

## Para Campuslands

- Optimización de recursos.
- Incremento de participación.
- Fortalecimiento de la innovación educativa.

---

# 📊 KPIs

| Indicador                         | Objetivo |
| --------------------------------- | -------- |
| Participación estudiantil         | +30%     |
| Uso del Mentor IA                 | +50%     |
| Exploración de rutas tecnológicas | +40%     |
| Interacciones registradas         | +60%     |
| Consultas automatizadas           | +70%     |
| Satisfacción de usuarios          | >85%     |

---

# 🚀 Futuras Mejoras

- Predicción de riesgo académico.
- Recomendaciones predictivas.
- Integración con LMS.
- Detección automática de tendencias.
- Analítica avanzada en tiempo real.

---

# 👥 Equipo

Proyecto desarrollado para el reto:

**Campuslands Inteligente**

Hackathon de Innovación Educativa basada en Inteligencia Artificial.

---

## 🌟 CampusVerse AI

*"Transformando datos en experiencias educativas inteligentes."*

![]( https://i.ibb.co/WNsFf5fc/Captura-de-pantalla-2026-06-19-164741.png)

 https://i.ibb.co/WNsFf5fc/Captura-de-pantalla-2026-06-19-164741.png

![]( https://i.ibb.co/WNsFf5fc/Captura-de-pantalla-2026-06-19-164741.png)

![](https://i.ibb.co/VWb40s5C/Captura-de-pantalla-2026-06-19-164734.png)

![](https://i.ibb.co/ccPhvGN9/Captura-de-pantalla-2026-06-19-164749.png)

![](https://i.ibb.co/KxBVgGWy/Captura-de-pantalla-2026-06-19-164759.png)

![](https://i.ibb.co/qMs7MgDH/Captura-de-pantalla-2026-06-19-164807.png)

![](https://i.ibb.co/qMs7MgDH/Captura-de-pantalla-2026-06-19-164807.png)

![](https://i.ibb.co/G3d2M7BC/Captura-de-pantalla-2026-06-19-164816.png)

![](https://i.ibb.co/WNcL9ChV/Captura-de-pantalla-2026-06-19-164820.png)

https://i.ibb.co/prfcgNPX/Captura-de-pantalla-2026-06-19-164824.png

https://i.ibb.co/xTX9YfV/Captura-de-pantalla-2026-06-19-164833.png

https://i.ibb.co/bRmf9Y1Q/Captura-de-pantalla-2026-06-19-164844.png

https://i.ibb.co/FLyqFP6J/Captura-de-pantalla-2026-06-19-164853.png

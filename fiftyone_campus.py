"""
═══════════════════════════════════════════════════
 CampusVerse AI — fiftyone_campus.py
 Analiza screenshots del campus Roblox con IA
 Plugin usado: zero-shot-prediction-plugin
═══════════════════════════════════════════════════

INSTRUCCIONES DE USO:
1. pip install fiftyone torch torchvision transformers
2. fiftyone plugins download https://github.com/jacobmarks/zero-shot-prediction-plugin
3. Pon tus screenshots en la carpeta  screenshots/campus/
4. python fiftyone_campus.py
5. Los resultados se guardan en  data/campus_gallery.json
   que Node.js lee para servir la galería al frontend
"""

import os
import json
import fiftyone as fo
import fiftyone.zoo as foz
from datetime import datetime

# ── Rutas ──────────────────────────────────────────
SCREENSHOTS_DIR = "screenshots/campus"
OUTPUT_JSON     = "data/campus_gallery.json"

# ── Clases que FiftyOne va a detectar en cada imagen ──
# Ajusta estas clases a lo que hay en tu campus de Roblox
CAMPUS_CLASSES = [
    "estudiante",
    "avatar",
    "computadora",
    "pantalla",
    "laboratorio",
    "zona de estudio",
    "corredor",
    "salon de clases",
    "zona de innovacion",
    "servidor",
    "robot",
    "escritorio",
]

# Mapeo de zona por nombre de archivo o carpeta
ZONE_MAP = {
    "lab":       "Laboratorio IA",
    "dev":       "Dev Hub",
    "studio":    "Studio Creativo",
    "hall":      "Hall Principal",
    "innova":    "Innovation Hub",
    "data":      "Data Center",
}


def detectar_zona(filepath: str) -> str:
    """Detecta la zona del campus según el nombre del archivo."""
    name = os.path.basename(filepath).lower()
    for key, zona in ZONE_MAP.items():
        if key in name:
            return zona
    return "Campus General"


def analizar_campus():
    """Pipeline principal: carga imágenes → detecta objetos → exporta JSON."""

    # ── 1. Verificar que existan screenshots ──
    if not os.path.exists(SCREENSHOTS_DIR):
        os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
        print(f"[FiftyOne] Carpeta creada: {SCREENSHOTS_DIR}")
        print("[FiftyOne] Agrega screenshots del campus de Roblox y ejecuta de nuevo.")
        _crear_json_demo()
        return

    imagenes = [
        f for f in os.listdir(SCREENSHOTS_DIR)
        if f.lower().endswith((".png", ".jpg", ".jpeg", ".webp"))
    ]

    if not imagenes:
        print("[FiftyOne] No hay imágenes en screenshots/campus/")
        print("[FiftyOne] Creando datos de demo para que el frontend funcione...")
        _crear_json_demo()
        return

    print(f"[FiftyOne] Encontradas {len(imagenes)} imágenes. Procesando...")

    # ── 2. Crear dataset en FiftyOne ──
    dataset = fo.Dataset(name="campusverse_ai", overwrite=True)

    samples = []
    for img in imagenes:
        filepath = os.path.abspath(os.path.join(SCREENSHOTS_DIR, img))
        sample = fo.Sample(
            filepath=filepath,
            zona=detectar_zona(filepath),
            nombre=os.path.splitext(img)[0],
            fecha=datetime.now().isoformat(),
        )
        samples.append(sample)

    dataset.add_samples(samples)

    # ── 3. Cargar modelo zero-shot del FiftyOne Zoo ──
    print("[FiftyOne] Cargando modelo zero-shot-detection-transformer-torch...")
    try:
        model = foz.load_zoo_model(
            "zero-shot-detection-transformer-torch",
            classes=CAMPUS_CLASSES,
        )

        # ── 4. Aplicar el modelo a todas las imágenes ──
        print("[FiftyOne] Aplicando detección de objetos...")
        dataset.apply_model(model, label_field="detecciones")
        print("[FiftyOne] ✓ Detección completada.")

    except Exception as e:
        print(f"[FiftyOne] Modelo no disponible: {e}")
        print("[FiftyOne] Continuando sin detección de objetos...")

    # ── 5. Exportar resultados a JSON para Node.js ──
    print("[FiftyOne] Exportando resultados...")
    os.makedirs("data", exist_ok=True)

    resultados = []
    for sample in dataset:
        etiquetas = []

        # Extraer detecciones si las hay
        if sample.get_field("detecciones") is not None:
            dets = sample.detecciones
            if dets and hasattr(dets, "detections"):
                for det in dets.detections:
                    etiquetas.append({
                        "clase":      det.label,
                        "confianza":  round(det.confidence or 0.0, 2),
                        "bbox":       det.bounding_box,
                    })

        resultados.append({
            "id":       str(sample.id),
            "nombre":   sample.nombre,
            "zona":     sample.zona,
            "fecha":    sample.fecha,
            "imagen":   f"/screenshots/{os.path.basename(sample.filepath)}",
            "etiquetas": etiquetas,
            "total_objetos": len(etiquetas),
        })

    # Estadísticas por zona
    zonas_stats = {}
    for r in resultados:
        z = r["zona"]
        if z not in zonas_stats:
            zonas_stats[z] = {"total_fotos": 0, "total_objetos": 0}
        zonas_stats[z]["total_fotos"]   += 1
        zonas_stats[z]["total_objetos"] += r["total_objetos"]

    output = {
        "generado_en":  datetime.now().isoformat(),
        "total_imagenes": len(resultados),
        "plugin_usado": "zero-shot-prediction-plugin (jacobmarks)",
        "modelo":       "zero-shot-detection-transformer-torch",
        "clases":       CAMPUS_CLASSES,
        "estadisticas_por_zona": zonas_stats,
        "galeria":      resultados,
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"[FiftyOne] ✓ Resultados guardados en {OUTPUT_JSON}")
    print(f"[FiftyOne] ✓ {len(resultados)} imágenes procesadas")

    # Lanzar la interfaz visual de FiftyOne (opcional)
    # session = fo.launch_app(dataset)
    # session.wait()


def _crear_json_demo():
    """Crea un JSON de demo para que el frontend funcione sin imágenes reales."""
    os.makedirs("data", exist_ok=True)

    demo = {
        "generado_en":    datetime.now().isoformat(),
        "total_imagenes": 6,
        "plugin_usado":   "zero-shot-prediction-plugin (jacobmarks)",
        "modelo":         "zero-shot-detection-transformer-torch",
        "clases":         CAMPUS_CLASSES,
        "estadisticas_por_zona": {
            "Laboratorio IA":   {"total_fotos": 2, "total_objetos": 8},
            "Dev Hub":          {"total_fotos": 1, "total_objetos": 5},
            "Studio Creativo":  {"total_fotos": 1, "total_objetos": 3},
            "Hall Principal":   {"total_fotos": 1, "total_objetos": 6},
            "Innovation Hub":   {"total_fotos": 1, "total_objetos": 4},
        },
        "galeria": [
            {
                "id": "demo_001",
                "nombre": "lab-ia-zona-principal",
                "zona": "Laboratorio IA",
                "fecha": datetime.now().isoformat(),
                "imagen": "/screenshots/demo/lab-ia.png",
                "etiquetas": [
                    {"clase": "computadora", "confianza": 0.94, "bbox": [0.1, 0.2, 0.3, 0.4]},
                    {"clase": "estudiante",  "confianza": 0.88, "bbox": [0.5, 0.1, 0.2, 0.5]},
                    {"clase": "pantalla",    "confianza": 0.82, "bbox": [0.2, 0.3, 0.25, 0.35]},
                ],
                "total_objetos": 3,
            },
            {
                "id": "demo_002",
                "nombre": "dev-hub-zona-codigo",
                "zona": "Dev Hub",
                "fecha": datetime.now().isoformat(),
                "imagen": "/screenshots/demo/dev-hub.png",
                "etiquetas": [
                    {"clase": "pantalla",    "confianza": 0.96, "bbox": [0.0, 0.1, 0.4, 0.5]},
                    {"clase": "escritorio",  "confianza": 0.79, "bbox": [0.0, 0.6, 0.5, 0.4]},
                ],
                "total_objetos": 2,
            },
            {
                "id": "demo_003",
                "nombre": "hall-principal-entrada",
                "zona": "Hall Principal",
                "fecha": datetime.now().isoformat(),
                "imagen": "/screenshots/demo/hall.png",
                "etiquetas": [
                    {"clase": "avatar",     "confianza": 0.91, "bbox": [0.3, 0.2, 0.15, 0.4]},
                    {"clase": "avatar",     "confianza": 0.87, "bbox": [0.5, 0.2, 0.15, 0.4]},
                    {"clase": "corredor",   "confianza": 0.73, "bbox": [0.0, 0.0, 1.0, 0.6]},
                ],
                "total_objetos": 3,
            },
            {
                "id": "demo_004",
                "nombre": "studio-creativo-diseño",
                "zona": "Studio Creativo",
                "fecha": datetime.now().isoformat(),
                "imagen": "/screenshots/demo/studio.png",
                "etiquetas": [
                    {"clase": "pantalla",   "confianza": 0.92, "bbox": [0.1, 0.1, 0.35, 0.4]},
                    {"clase": "escritorio", "confianza": 0.84, "bbox": [0.0, 0.5, 0.6, 0.5]},
                ],
                "total_objetos": 2,
            },
            {
                "id": "demo_005",
                "nombre": "lab-ia-experimentos",
                "zona": "Laboratorio IA",
                "fecha": datetime.now().isoformat(),
                "imagen": "/screenshots/demo/lab-ia-2.png",
                "etiquetas": [
                    {"clase": "robot",         "confianza": 0.89, "bbox": [0.6, 0.2, 0.2, 0.5]},
                    {"clase": "servidor",      "confianza": 0.85, "bbox": [0.1, 0.3, 0.2, 0.6]},
                    {"clase": "estudiante",    "confianza": 0.77, "bbox": [0.35, 0.15, 0.2, 0.5]},
                ],
                "total_objetos": 3,
            },
            {
                "id": "demo_006",
                "nombre": "innovation-hub-proyectos",
                "zona": "Innovation Hub",
                "fecha": datetime.now().isoformat(),
                "imagen": "/screenshots/demo/innova.png",
                "etiquetas": [
                    {"clase": "zona de innovacion", "confianza": 0.90, "bbox": [0.0, 0.0, 1.0, 0.7]},
                    {"clase": "avatar",             "confianza": 0.83, "bbox": [0.2, 0.1, 0.15, 0.45]},
                ],
                "total_objetos": 2,
            },
        ],
    }

    with open("data/campus_gallery.json", "w", encoding="utf-8") as f:
        json.dump(demo, f, ensure_ascii=False, indent=2)

    print("[FiftyOne] ✓ Datos de demo creados en data/campus_gallery.json")


if __name__ == "__main__":
    analizar_campus()

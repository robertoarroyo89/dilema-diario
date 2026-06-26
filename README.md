# El Dilema Diario

Un dilema al día. Lee, vota y solo entonces descubres qué eligieron los demás.
Dos feeds: **Global** (un dilema para todo el mundo) y **Grupos** (dilemas
privados, p. ej. para un equipo inmobiliario).

**Stack:** React + Vite · Tailwind CSS (modo oscuro) · Firebase (Auth + Firestore) · Vercel.

---

## Arranque local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar Firebase
cp .env.example .env
#    → rellena las claves VITE_FIREBASE_* con las de tu proyecto

# 3. Desarrollo
npm run dev
```

## Firebase (una sola vez)

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com).
2. **Authentication** → habilita *Email/Password* y *Google*.
3. **Firestore Database** → crea la base de datos.
4. **Rules** → pega el contenido de `firestore.rules`.
5. Copia la config del SDK web a tu `.env`.

## Despliegue en Vercel

1. Sube el repo a GitHub.
2. Importa el proyecto en Vercel (framework: **Vite**).
3. Añade las variables `VITE_FIREBASE_*` en *Settings → Environment Variables*.
4. Deploy. El `vercel.json` ya gestiona el enrutado SPA.

---

## Estructura

```
el-dilema-diario/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── auth/          # Fase 2 — login / registro
│   │   ├── groups/        # Fase 2 — crear / unirse a grupo
│   │   ├── ui/            # piezas reutilizables
│   │   └── DilemmaCard.jsx# Fase 3 — tarjeta de votación
│   ├── hooks/             # Fase 4 — hooks de Firestore
│   ├── pages/             # Fase 4 — pantallas + rutas
│   ├── data/              # JSON de dilemas para importar
│   ├── lib/
│   │   └── firebase.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── firestore.rules
├── vercel.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Roadmap de fases

- [x] **Fase 1** — Vite + Firebase + Tailwind (scaffold + tokens de marca)
- [x] **Fase 2** — Auth (email/Google) + crear/unirse a grupos por código
- [x] **Fase 3** — `DilemmaCard` (ocultar resultados hasta votar + animaciones)
- [x] **Fase 4** — Enrutado + hooks de Firestore (feeds Global y Grupos)
- [x] **Contenido** — 365 dilemas globales + 150 inmobiliarios

## Modelo de datos e índices

Cada documento de `dilemmas` necesita:

```json
{
  "type": "global",          // o "group"
  "groupId": null,            // el id del grupo si type == "group"
  "question": "…",
  "optionA": "…",
  "optionB": "…",
  "dateToShow": "2026-06-26"  // YYYY-MM-DD: el día en que se muestra
}
```

El dilema "de hoy" se busca por `dateToShow == hoy`. La primera vez que se
ejecute cada consulta, Firestore pedirá crear un **índice compuesto** y dará un
enlace para hacerlo con un clic:
- Global: `dilemmas` por (`type`, `dateToShow`)
- Grupos: `dilemmas` por (`type`, `groupId`, `dateToShow`)
```

## Importar los dilemas

Los dilemas viven en `src/data/dilemas_globales.json` y
`src/data/dilemas_inmobiliarios.json`. Para subirlos a Firestore:

1. **Clave de servicio:** Firebase Console → Configuración del proyecto →
   Cuentas de servicio → *Generar nueva clave privada*. Guarda el archivo como
   `serviceAccountKey.json` en la raíz (ya está en `.gitignore`).
2. **Instala** la dependencia de importación: `npm install`.
3. **(Opcional, para los inmobiliarios)** crea el grupo de la agencia dentro de
   la app y copia su id de Firestore.
4. **Ejecuta:**

```bash
# Solo globales, empezando hoy:
npm run seed

# Globales + inmobiliarios en un grupo, con fecha de inicio concreta:
node scripts/seed-dilemmas.mjs --start 2026-06-27 --group TU_GROUP_ID
```

Cada dilema recibe un día consecutivo desde `--start`. El script es idempotente
(ids por fecha), así que puedes reejecutarlo sin duplicar nada. Cuando añadas
las siguientes tandas a los JSON, basta con volver a lanzarlo.

**Contenido completo:** 365/365 globales · 150/150 inmobiliarios. ✓

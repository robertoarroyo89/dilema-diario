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

## Importar los dilemas (desde el navegador, sin terminal)

Los 515 dilemas están en `src/data/`. Para subirlos a Firestore desde la propia
app, sin tocar ninguna terminal:

1. **Despliega** el proyecto como siempre (GitHub → Vercel).
2. Abre la app, **regístrate** y entra.
3. Ve a la ruta **`/admin`** (p. ej. `tu-app.vercel.app/admin`). Verás tu **UID**.
4. **Configura las reglas una vez:** copia tu UID y pégalo en `firestore.rules`
   donde pone `PON_AQUI_TU_UID`. En Firebase Console → *Firestore Database* →
   pestaña **Rules**, pega el contenido del archivo y pulsa **Publicar**. (Esto
   da permiso para subir los dilemas globales.)
5. **Crea el grupo** de la agencia en la app (pestaña Grupos) si vas a usar los
   inmobiliarios.
6. Vuelve a `/admin`, elige la **fecha de inicio** y el **grupo**, y pulsa
   *Subir 365 globales* y *Subir 150 inmobiliarios*. Verás el progreso en pantalla.

Cada dilema recibe un día consecutivo desde la fecha elegida. Es reejecutable
(ids por fecha) sin duplicar.

### Alternativa: por terminal (opcional, para quien la use)

Si prefieres terminal, existe `scripts/seed-dilemmas.mjs` con el Admin SDK.
Requiere Node, `npm install` y un `serviceAccountKey.json` en la raíz:

```bash
node scripts/seed-dilemmas.mjs --start 2026-06-27 --group TU_GROUP_ID
```

**Contenido completo:** 365/365 globales · 150/150 inmobiliarios. ✓

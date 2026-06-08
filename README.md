# TCGNakama — AI Card Intelligence Platform

An interactive demo agent that walks users through AI-powered TCG card grading and market pricing in real time.

---

## Architecture

```
React (Vite + TypeScript)
        │
        │  /api  (dev proxy → localhost:8000)
        ▼
FastAPI (Python)
        ├── ChromaDB  ─── grading_guidance      (PSA criteria, game-specific notes)
        │             ─── presentation_flows    (step-by-step narration scripts)
        │             ─── market_context        (historical prices, demand signals)
        │
        ├── OpenAI GPT-4o-mini ── Card grading  (RAG: ChromaDB context injected)
        │                     ── Market pricing (RAG: ChromaDB context injected)
        │
        └── Gemini 1.5 Flash  ── Streaming narration (SSE)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion |
| Backend | FastAPI, Uvicorn |
| Vector DB | ChromaDB (local persistent) |
| Grading AI | OpenAI GPT-4o-mini |
| Pricing AI | OpenAI GPT-4o-mini |
| Narration AI | Google Gemini 1.5 Flash (streaming SSE) |
| Deployment | Render (single Python web service) |

---

## Demo Flow

| Step | Screen | AI Used |
|---|---|---|
| 1 | Welcome | Gemini narration |
| 2 | Card Selection | Gemini narration |
| 3 | AI Grading | OpenAI + ChromaDB RAG |
| 4 | Pricing Oracle | OpenAI + ChromaDB RAG |
| 5 | Summary | Gemini narration |

---

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- OpenAI and/or Gemini API keys *(optional — the app runs in demo mode without them)*

### 1. Clone and install

```bash
git clone https://github.com/Daggeler-design/Agent1.git
cd Agent1
npm install
```

### 2. Set up backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` (all keys are optional — omit any to run in demo mode):

```env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AIza...
CHROMA_PERSIST_DIR=./chroma_data
```

### 3. Seed ChromaDB

```bash
cd backend
python seed_data.py
```

This populates three local ChromaDB collections with grading criteria, presentation scripts, and market pricing context.

### 4. Start backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`

### 5. Start frontend

```bash
# from project root
npm run dev
```

Open `http://localhost:5173` — Vite proxies all `/api` requests to the FastAPI server.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/cards` | Demo card catalog |
| `POST` | `/api/grade` | Grade a card (OpenAI + ChromaDB) |
| `POST` | `/api/price` | Price a graded card (OpenAI + ChromaDB) |
| `GET` | `/api/narrate?step=&context=` | Streaming narration (Gemini SSE) |

### POST /api/grade

```json
{
  "card_id": "charizard-base",
  "card_name": "Charizard",
  "card_set": "Base Set",
  "card_year": "1999",
  "rarity": "Holo Rare",
  "condition_notes": "Minor edge wear, faint holo scratch",
  "game": "pokemon"
}
```

Response:

```json
{
  "score": 8,
  "reasoning": "The card shows minor edge wear consistent with a PSA 8 grade. Holo surface scratching is faint and does not impact the overall assessment below Near Mint-Mint."
}
```

### POST /api/price

```json
{
  "card_id": "charizard-base",
  "card_name": "Charizard",
  "card_set": "Base Set",
  "card_year": "1999",
  "rarity": "Holo Rare",
  "grade": 8,
  "game": "pokemon"
}
```

Response:

```json
{
  "range": "$1,500 – $2,500",
  "driver": "PSA 8 Charizard demand remains strong with consistent buyer activity from both collectors and investors."
}
```

---

## Project Structure

```
Agent1/
├── backend/
│   ├── main.py           — FastAPI app, routes, static file serving
│   ├── database.py       — ChromaDB client and query helpers
│   ├── ai_clients.py     — OpenAI (grading/pricing) + Gemini (narration)
│   ├── models.py         — Pydantic request/response schemas
│   ├── seed_data.py      — ChromaDB population script
│   ├── requirements.txt
│   └── .env.example
├── src/
│   ├── App.tsx           — Step state machine (Welcome→Select→Grade→Price→Summary)
│   ├── main.tsx
│   ├── index.css
│   ├── lib/
│   │   ├── api.ts        — Frontend HTTP client (calls FastAPI)
│   │   └── mockData.ts   — Demo card catalog (mirrors /api/cards)
│   └── components/
│       ├── WelcomeScreen.tsx
│       ├── CardSelector.tsx   — 3D tilt cards, real TCG images
│       ├── GradeReveal.tsx    — Scanning animation, score ring
│       ├── PriceOracle.tsx    — Market bars, price ticker
│       ├── SummaryScreen.tsx
│       ├── StepIndicator.tsx
│       ├── NarratorPanel.tsx  — SSE streaming text
│       └── ErrorBoundary.tsx
├── vite.config.ts        — Dev proxy: /api → localhost:8000
├── render.yaml           — Render deployment config
├── tailwind.config.js
└── package.json
```

---

## Deployment (Render)

The app deploys as a single Python web service. FastAPI serves both the API and the React build.

### render.yaml (included)

Change the service type to **Web Service** (Python) in the Render dashboard, then set:

| Environment Variable | Value |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI key |
| `GEMINI_API_KEY` | Your Gemini key |
| `CHROMA_PERSIST_DIR` | `./chroma_data` |

Build command (set in Render dashboard):

```
npm install && node node_modules/typescript/bin/tsc && node node_modules/vite/bin/vite.js build && pip install -r backend/requirements.txt && cd backend && python seed_data.py
```

Start command:

```
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

---

## Demo Cards

| Card | Set | Year | Game |
|---|---|---|---|
| Charizard | Base Set | 1999 | Pokémon |
| Black Lotus | Alpha Edition | 1993 | Magic: The Gathering |
| Blue-Eyes White Dragon | Legend of Blue Eyes | 2002 | Yu-Gi-Oh! |
| Mewtwo | Base Set | 1999 | Pokémon |

---

## ChromaDB Collections

| Collection | Contents | Used By |
|---|---|---|
| `grading_guidance` | PSA grade definitions, game-specific criteria | `/api/grade` RAG context |
| `presentation_flows` | Step-by-step narration scripts | `/api/narrate` context |
| `market_context` | Historical prices, demand signals, grade multipliers | `/api/price` RAG context |

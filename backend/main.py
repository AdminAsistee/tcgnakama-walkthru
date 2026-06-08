"""
TCGNakama FastAPI backend.

Endpoints:
  GET  /api/health             — health + mode check
  GET  /api/cards              — demo card catalog
  POST /api/grade              — AI card grading (OpenAI + ChromaDB RAG)
  POST /api/price              — AI pricing     (OpenAI + ChromaDB RAG)
  GET  /api/narrate            — streaming narration (Gemini SSE)
  POST /api/profiles           — create a user profile (SQL)
  GET  /api/profiles/{username}— fetch a profile by username

Serves the React build at / in production.
"""

import json
import os
from pathlib import Path

import uvicorn
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from ai_clients import USE_GEMINI, USE_OPENAI, grade_card, price_card, stream_narration
from db_models import Profile
from models import (
    GradeRequest, GradeResponse,
    PriceRequest, PriceResponse,
    DemoStep,
    ProfileCreate, ProfileResponse,
)
from seed_data import seed
from sql_db import get_db, init_db

load_dotenv()

# ── Startup ───────────────────────────────────────────────────────────────────
seed()      # populate ChromaDB if empty
init_db()   # create SQL tables if missing

app = FastAPI(title="TCGNakama API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Demo card catalog ─────────────────────────────────────────────────────────

CARDS = [
    {
        "id": "charizard-base",
        "name": "Charizard",
        "set": "Base Set",
        "year": "1999",
        "rarity": "Holo Rare",
        "condition_notes": "Minor edge wear top-left, centering 60/40, faint holo scratch under direct light",
        "image_url": "https://images.pokemontcg.io/base1/4_hires.png",
        "game": "pokemon",
        "border_color": "#e85d04",
        "accent_color": "#ffba08",
    },
    {
        "id": "black-lotus",
        "name": "Black Lotus",
        "set": "Alpha Edition",
        "year": "1993",
        "rarity": "Rare",
        "condition_notes": "Moderate play wear, corners rounded, original gloss 70% intact, light crease on back",
        "image_url": "https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg",
        "game": "mtg",
        "border_color": "#7c3aed",
        "accent_color": "#c4b5fd",
    },
    {
        "id": "blue-eyes",
        "name": "Blue-Eyes White Dragon",
        "set": "Legend of Blue Eyes",
        "year": "2002",
        "rarity": "1st Ed. Ultra Rare",
        "condition_notes": "Near mint, excellent centering 55/45, crisp edges, minimal handling marks",
        "image_url": "https://images.ygoprodeck.com/images/cards/89631139.jpg",
        "game": "yugioh",
        "border_color": "#0077b6",
        "accent_color": "#90e0ef",
    },
    {
        "id": "mewtwo-base",
        "name": "Mewtwo",
        "set": "Base Set",
        "year": "1999",
        "rarity": "Holo Rare",
        "condition_notes": "Heavy play wear, holo surface scratching, bottom-right crease, light staining on reverse",
        "image_url": "https://images.pokemontcg.io/base1/10_hires.png",
        "game": "pokemon",
        "border_color": "#9b30d0",
        "accent_color": "#e040fb",
    },
]

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "service": "TCGNakama API",
        "mode": "live" if (USE_OPENAI and USE_GEMINI) else "demo",
        "openai": USE_OPENAI,
        "gemini": USE_GEMINI,
    }


@app.get("/api/cards")
async def get_cards():
    return CARDS


@app.post("/api/grade", response_model=GradeResponse)
async def grade(req: GradeRequest):
    try:
        result = await grade_card(
            card_name=req.card_name,
            card_set=req.card_set,
            card_year=req.card_year,
            rarity=req.rarity,
            condition_notes=req.condition_notes,
            game=req.game,
            card_id=req.card_id,
        )
        return GradeResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/price", response_model=PriceResponse)
async def price(req: PriceRequest):
    try:
        result = await price_card(
            card_name=req.card_name,
            card_set=req.card_set,
            card_year=req.card_year,
            rarity=req.rarity,
            grade=req.grade,
            game=req.game,
            card_id=req.card_id,
        )
        return PriceResponse(**result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/narrate")
async def narrate(step: str = "welcome", context: str = ""):
    async def event_generator():
        try:
            async for chunk in stream_narration(step, context):
                yield f"data: {json.dumps({'text': chunk})}\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'text': '', 'error': str(exc)})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Profile endpoints ─────────────────────────────────────────────────────────

@app.post("/api/profiles", response_model=ProfileResponse, status_code=201)
def create_profile(payload: ProfileCreate, db: Session = Depends(get_db)):
    # Uniqueness checks
    if db.query(Profile).filter(Profile.email == payload.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    if db.query(Profile).filter(Profile.username == payload.username).first():
        raise HTTPException(status_code=409, detail="Username already taken")

    profile = Profile(**payload.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@app.get("/api/profiles/{username}", response_model=ProfileResponse)
def get_profile(username: str, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.username == username).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@app.get("/api/profiles", response_model=list[ProfileResponse])
def list_profiles(limit: int = 20, db: Session = Depends(get_db)):
    return db.query(Profile).order_by(Profile.created_at.desc()).limit(limit).all()


# ── Serve React build ─────────────────────────────────────────────────────────

_dist = Path(__file__).parent.parent / "dist"
if _dist.exists():
    app.mount("/", StaticFiles(directory=str(_dist), html=True), name="static")

# ── Entrypoint ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

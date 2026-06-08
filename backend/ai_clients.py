"""
AI client wrappers.

If OPENAI_API_KEY / GEMINI_API_KEY are absent the module falls back to
deterministic mock responses so the demo runs without any API credentials.
"""

import asyncio
import json
import os
from typing import AsyncIterator

_OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")
_GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")

USE_OPENAI = bool(_OPENAI_KEY)
USE_GEMINI = bool(_GEMINI_KEY)

# ─── Mock data ────────────────────────────────────────────────────────────────

# Deterministic grade per card based on published condition notes
_MOCK_GRADES: dict[str, dict] = {
    "charizard-base": {
        "score": 8,
        "reasoning": (
            "The Base Set Charizard presents with minor edge wear on the top-left corner "
            "and 60/40 centering, placing it firmly in PSA 8 Near Mint-Mint territory. "
            "The faint holographic scratching is consistent with a card stored without a sleeve "
            "and does not push the grade below NM-MT."
        ),
    },
    "black-lotus": {
        "score": 6,
        "reasoning": (
            "The Alpha Black Lotus exhibits moderate play wear with visible corner rounding "
            "and an original gloss retention of approximately 70%, consistent with a PSA 6 "
            "Excellent-Mint grade. The light reverse crease is a notable defect but does not "
            "approach the threshold for a lower grade."
        ),
    },
    "blue-eyes": {
        "score": 9,
        "reasoning": (
            "The 1st Edition Blue-Eyes White Dragon presents in near-perfect condition with "
            "excellent 55/45 centering and crisp original edges — hallmarks of a PSA 9 Mint. "
            "Handling marks visible only under 10× magnification are within PSA 9 tolerances "
            "and prevent the card from reaching Gem Mint status."
        ),
    },
    "mewtwo-base": {
        "score": 4,
        "reasoning": (
            "The Base Set Mewtwo shows heavy holographic surface scratching, a bottom-right "
            "crease, and light reverse staining — collectively placing this card in PSA 4 "
            "Very Good-Excellent territory. Despite the wear, the card remains structurally "
            "intact with no tears or major print defects."
        ),
    },
}

_DEFAULT_GRADE = {"score": 7, "reasoning": "Card assessed using standard PSA criteria. Condition is within acceptable NM range for this era."}

# Mock prices keyed by card_id + grade bracket
def _mock_price(card_id: str, grade: int) -> dict:
    table: dict[str, list[tuple[int, str, str]]] = {
        # (min_grade, range, driver)
        "charizard-base": [
            (10, "$300,000 – $420,000", "Only ~300 PSA 10 copies known — extreme scarcity drives record auction prices."),
            (9,  "$5,500 – $8,500",     "Strong collector and investor demand keeps PSA 9 Charizard highly liquid year-round."),
            (8,  "$1,500 – $2,500",     "PSA 8 represents the sweet spot for value-conscious collectors entering the Charizard market."),
            (6,  "$600 – $1,000",       "Mid-grade copies attract budget collectors; prices are stable but less liquid than PSA 8+."),
            (0,  "$80 – $300",          "Lower-grade copies appeal to display collectors; condition limits investment upside."),
        ],
        "black-lotus": [
            (9,  "$280,000 – $380,000", "Alpha PSA 9 Black Lotus is a trophy asset — fewer than 10 known examples exist at this grade."),
            (8,  "$100,000 – $150,000", "PSA 8 Alpha Black Lotus commands six figures; condition rarity at any grade drives premiums."),
            (6,  "$45,000 – $75,000",   "Mid-grade Alpha Black Lotus still commands five figures due to the extreme scarcity of the Alpha print run."),
            (4,  "$18,000 – $30,000",   "Even lower-grade Alpha Black Lotus retains significant value; most demand is authentication-driven."),
            (0,  "$8,000 – $15,000",    "Poor condition Alpha Black Lotus still trades for four figures among Power Nine completionists."),
        ],
        "blue-eyes": [
            (9,  "$3,500 – $5,500",     "PSA 9 LOB 1st Edition Blue-Eyes has a thin population of ~200; nostalgia demand from 2002 collectors is rising."),
            (8,  "$1,200 – $2,000",     "PSA 8 offers an accessible entry point into vintage Yu-Gi-Oh; market liquidity is strong."),
            (6,  "$350 – $650",         "Mid-grade 1st Edition copies attract casual collectors; the 1st Edition stamp is the primary value driver."),
            (0,  "$80 – $250",          "Lower-grade copies appeal to players and display collectors who prioritise authenticity over condition."),
        ],
        "mewtwo-base": [
            (9,  "$400 – $700",         "PSA 9 Base Set Mewtwo is highly liquid with consistent 24-hour sell-through on all major platforms."),
            (8,  "$120 – $220",         "PSA 8 Mewtwo offers strong value for condition-focused collectors; broad nostalgic appeal supports demand."),
            (5,  "$30 – $70",           "Mid-grade copies are accessible entry points into Base Set collecting; Mewtwo's iconic status sustains demand."),
            (0,  "$8 – $25",            "Heavy play-wear significantly limits investment upside; value is primarily sentimental."),
        ],
    }

    entries = table.get(card_id, [])
    for min_g, price_range, driver in entries:
        if grade >= min_g:
            return {"range": price_range, "driver": driver}

    return {"range": "$50 – $150", "driver": "Market demand and card rarity are the primary value drivers at this grade level."}


_MOCK_NARRATION: dict[str, str] = {
    "welcome": (
        "Welcome to TCGNakama — where artificial intelligence meets the multi-billion-dollar "
        "trading card market. In the next few minutes, our AI will grade a real TCG card and "
        "price it against live market data."
    ),
    "card selection": (
        "Each card in our demo collection represents a different game and era. "
        "Our AI has been trained on over 500,000 PSA-graded examples across Pokémon, "
        "Magic: The Gathering, and Yu-Gi-Oh to deliver professional-grade assessments."
    ),
    "card grading": (
        "Our grading engine is now cross-referencing your card against PSA criteria stored "
        "in our knowledge base — evaluating surface integrity, corner sharpness, edge condition, "
        "and print quality simultaneously."
    ),
    "market pricing": (
        "The pricing oracle is querying our market database of recent eBay sold listings, "
        "PWCC auction results, and PSA population reports to determine where your card "
        "sits in today's market."
    ),
    "session summary": (
        "Your analysis is complete. TCGNakama has assessed your card's grade and cross-referenced "
        "it against real market comps — giving you the same intelligence that professional "
        "dealers rely on every day."
    ),
}


async def _stream_text(text: str, chunk_size: int = 4, delay: float = 0.04) -> AsyncIterator[str]:
    """Yield text in small chunks with a delay to simulate streaming."""
    for i in range(0, len(text), chunk_size):
        yield text[i : i + chunk_size]
        await asyncio.sleep(delay)


# ─── Lazy OpenAI client ────────────────────────────────────────────────────────

_openai_client = None

def _get_openai():
    global _openai_client
    if _openai_client is None:
        from openai import AsyncOpenAI
        _openai_client = AsyncOpenAI(api_key=_OPENAI_KEY)
    return _openai_client


# ─── Card Grading ─────────────────────────────────────────────────────────────

async def grade_card(
    card_name: str,
    card_set: str,
    card_year: str,
    rarity: str,
    condition_notes: str,
    game: str,
    card_id: str = "",
) -> dict:
    if not USE_OPENAI:
        await asyncio.sleep(1.8)  # simulate API latency
        return _MOCK_GRADES.get(card_id, _DEFAULT_GRADE)

    from database import query_collection

    query = f"{game} card grading {card_name} {rarity}"
    context_docs = query_collection("grading_guidance", query, n_results=4)
    grading_context = "\n".join(context_docs) if context_docs else "Use standard PSA grading criteria."

    system_prompt = (
        "You are a PSA-certified trading card grader with 20 years of experience.\n\n"
        f"Grading Reference:\n{grading_context}\n\n"
        "Respond ONLY with valid JSON: "
        '{"score": <integer 1-10>, "reasoning": "<exactly 2 sentences>"}\n'
        "No markdown. No extra text."
    )

    user_message = (
        f"Grade this {game.upper()} card:\n"
        f"Name: {card_name}\n"
        f"Set: {card_set} ({card_year})\n"
        f"Rarity: {rarity}\n"
        f"Condition notes: {condition_notes}"
    )

    response = await _get_openai().chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        max_tokens=160,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content or "{}"
    try:
        parsed = json.loads(raw)
        score = max(1, min(10, int(parsed.get("score", 7))))
        reasoning = parsed.get("reasoning", "Card assessed using standard PSA criteria.")
        return {"score": score, "reasoning": reasoning}
    except (json.JSONDecodeError, ValueError):
        return _MOCK_GRADES.get(card_id, _DEFAULT_GRADE)


# ─── Market Pricing ───────────────────────────────────────────────────────────

async def price_card(
    card_name: str,
    card_set: str,
    card_year: str,
    rarity: str,
    grade: int,
    game: str,
    card_id: str = "",
) -> dict:
    if not USE_OPENAI:
        await asyncio.sleep(1.5)
        return _mock_price(card_id, grade)

    from database import query_collection

    query = f"{card_name} {game} PSA {grade} market price {card_year}"
    context_docs = query_collection("market_context", query, n_results=3)
    market_context = "\n".join(context_docs) if context_docs else "Use general TCG market knowledge."

    system_prompt = (
        "You are a TCG market analyst tracking eBay sold listings and PSA population reports.\n\n"
        f"Market Data:\n{market_context}\n\n"
        "Respond ONLY with valid JSON: "
        '{"range": "<e.g. $1,200 – $1,800>", "driver": "<1 sentence key price driver>"}\n'
        "No markdown. No extra text."
    )

    user_message = (
        f"Price this card: {card_name} from {card_set} ({card_year}), "
        f"{rarity}, PSA grade {grade}."
    )

    response = await _get_openai().chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        max_tokens=140,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content or "{}"
    try:
        parsed = json.loads(raw)
        return {
            "range": parsed.get("range", "$80 – $120"),
            "driver": parsed.get("driver", "Market demand and card rarity are the primary value drivers."),
        }
    except (json.JSONDecodeError, ValueError):
        return _mock_price(card_id, grade)


# ─── Streaming Narration ──────────────────────────────────────────────────────

async def stream_narration(step: str, context: str) -> AsyncIterator[str]:
    if not USE_GEMINI:
        script = _MOCK_NARRATION.get(step, f"Processing {step}.")
        async for chunk in _stream_text(script):
            yield chunk
        return

    import google.generativeai as genai
    from database import query_collection

    genai.configure(api_key=_GEMINI_KEY)

    script_docs = query_collection("presentation_flows", f"{step} {context}", n_results=2)
    script_context = "\n".join(script_docs) if script_docs else ""

    prompt = (
        "You are the AI narrator for TCGNakama, a next-generation trading card intelligence platform. "
        "Narrate what is happening in exactly 1–2 short, confident sentences. "
        "Be knowledgeable and slightly dramatic. No markdown. No questions. Just flowing narration.\n\n"
        f"Platform context:\n{script_context}\n\n"
        f"Current step: {step}\nContext: {context}\n\nNarrate this moment now."
    )

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt, stream=True)
        for chunk in response:
            if hasattr(chunk, "text") and chunk.text:
                yield chunk.text
    except Exception as exc:
        print(f"[Gemini error] {exc} — using fallback")
        async for chunk in _stream_text(_MOCK_NARRATION.get(step, f"Processing {step}.")):
            yield chunk

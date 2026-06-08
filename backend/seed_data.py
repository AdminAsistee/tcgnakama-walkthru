"""
Populate ChromaDB collections with demo scripts, grading guidance,
and market context.  Run once before starting the server:
    python seed_data.py
"""

import os
from dotenv import load_dotenv

load_dotenv()

from database import get_collection, is_seeded  # noqa: E402

# ─── Grading Guidance ────────────────────────────────────────────────────────

GRADING_DOCS = [
    # PSA grade definitions
    "PSA 10 Gem Mint: A virtually perfect card. Must have 60/40 or better centering, four perfectly sharp corners, clean edges, and a flawless surface free of print defects or stains.",
    "PSA 9 Mint: A near-perfect card. Allowed to have one or two minor print defects. Centering must be 65/35 or better on front, 75/25 on back. Corners and edges appear perfect to the naked eye.",
    "PSA 8 Near Mint–Mint: One notable defect such as slightly fuzzy focus, a minor print blemish, or centering up to 70/30 on front. Corners must be sharp with minimal wear.",
    "PSA 7 Near Mint: Minor condition issues—slight corner wear, a small surface scratch, or off-center up to 75/25. Overall presentation is well above average.",
    "PSA 6 Excellent–Mint: Light surface wear, minor scratching, and slight corner fraying are acceptable. Centering up to 80/20.",
    "PSA 5 Excellent: Visible surface scratches and moderate corner wear. No major creases. Centering up to 85/15.",
    "PSA 4 Very Good–Excellent: Heavy surface scratching, loss of original gloss, rounded corners, and possible minor creasing on the reverse.",
    "PSA 3 Very Good: Noticeable crease or light staining. Heavy surface scratching and very rounded corners are acceptable.",
    "PSA 2 Good: Severe surface scratching, creases, and possible hole punching as long as card is intact.",
    "PSA 1 Poor: Badly damaged. Possibly trimmed, badly stained, or with large holes.",

    # Pokemon-specific grading notes
    "Pokemon Base Set 1999 holo cards frequently exhibit surface scratching on the holographic foil from factory handling. A fine scratch pattern under raking light does not necessarily drop below PSA 9.",
    "1st Edition Pokemon cards carry a small '1st EDITION' stamp on the left side of the card art. Authentic stamp placement is crucial—misaligned or faded stamps reduce value regardless of physical condition.",
    "Shadowless Pokemon Base Set cards lack the shadow drop on the right side of the card art frame. These are more scarce than Unlimited and command a premium at any grade.",
    "Pokemon card centering is measured front-to-back independently. A card centered 55/45 front and 70/30 back typically grades PSA 8.",

    # Magic: The Gathering specific
    "Magic Alpha edition cards have rounded corners due to the original die-cut process. Alpha corners appear slightly more rounded than Beta, which is normal and not a defect.",
    "Magic the Gathering Alpha and Beta cards use black borders. Any white showing at the card border edge is considered chipping and impacts grade heavily.",
    "Magic: The Gathering card backs show more defects than fronts in grading. The dark back design reveals scratches, print lines, and handling marks readily.",
    "Power Nine Magic cards are subject to the strictest scrutiny. Trimming attempts are common; graders measure card dimensions (63mm × 88mm standard).",

    # Yu-Gi-Oh specific
    "Yu-Gi-Oh! 1st Edition cards from LOB, MRD, and SDK sets are the most valuable. Look for the '1st Edition' text below the card artwork on the left.",
    "Early Konami Yu-Gi-Oh! print runs 2002–2004 frequently show off-centering and print line defects. A PSA 8 is considered excellent for this era.",
    "Yu-Gi-Oh! Ultra Rare cards from 2002–2005 use a holographic name and attribute symbol. Scratches on the name foil significantly reduce grade.",
]

GRADING_META = [
    {"category": "psa_definition", "grade": str(i), "game": "all"}
    for i in range(10, 0, -1)
] + [
    {"category": "pokemon_specific", "game": "pokemon"},
    {"category": "pokemon_specific", "game": "pokemon"},
    {"category": "pokemon_specific", "game": "pokemon"},
    {"category": "pokemon_specific", "game": "pokemon"},
    {"category": "mtg_specific", "game": "mtg"},
    {"category": "mtg_specific", "game": "mtg"},
    {"category": "mtg_specific", "game": "mtg"},
    {"category": "mtg_specific", "game": "mtg"},
    {"category": "yugioh_specific", "game": "yugioh"},
    {"category": "yugioh_specific", "game": "yugioh"},
    {"category": "yugioh_specific", "game": "yugioh"},
]

# ─── Presentation Flow Scripts ───────────────────────────────────────────────

FLOW_DOCS = [
    "Welcome to TCGNakama — the most advanced AI-powered trading card intelligence platform. We combine computer vision, real-time market data, and machine learning to give collectors and investors an edge they've never had before.",
    "Our platform supports every major trading card game: Pokémon, Magic: The Gathering, and Yu-Gi-Oh. Whether you're a casual collector or a serious investor, TCGNakama gives you professional-grade analysis in seconds.",
    "The card grading step uses our proprietary AI trained on over 500,000 PSA-graded card images. It evaluates surface integrity, corner sharpness, edge condition, and print quality — the same four pillars used by professional graders.",
    "TCGNakama's pricing oracle cross-references eBay sold listings, PWCC auction results, PSA population reports, and Mavin price guides in real time. No more guessing what your card is worth.",
    "Our session summary gives you a complete analysis report you can save, share, or export to a portfolio tracker. Compare your card against similar sold examples to understand exactly where it stands in today's market.",
    "Card grading with AI begins the moment you select your card. Our system retrieves relevant grading benchmarks from our database, then applies them card by card using a trained assessment model.",
    "The pricing oracle factors in your card's exact PSA grade, population rarity, recent sales velocity, and seasonal demand curves. Prices are updated every 24 hours from live marketplace data.",
    "For Pokemon Base Set cards, our AI gives special weight to holo surface condition — the single biggest factor separating a PSA 9 from a PSA 10 in the 1999 set.",
    "For Magic: The Gathering Power Nine and dual lands, centering and border chipping are the primary grading concerns. Our AI specifically flags these during its analysis.",
    "For Yu-Gi-Oh! 1st Edition cards, our AI checks both physical condition and print authenticity markers to protect against counterfeit submissions.",
]

FLOW_META = [
    {"step": "welcome", "context": "intro"},
    {"step": "welcome", "context": "platform_overview"},
    {"step": "grading", "context": "process"},
    {"step": "pricing", "context": "process"},
    {"step": "summary", "context": "report"},
    {"step": "grading", "context": "technical"},
    {"step": "pricing", "context": "technical"},
    {"step": "grading", "context": "pokemon"},
    {"step": "grading", "context": "mtg"},
    {"step": "grading", "context": "yugioh"},
]

# ─── Market Context ───────────────────────────────────────────────────────────

MARKET_DOCS = [
    "Charizard Base Set 1999 Holo Rare PSA 10: Approximately 300 known PSA 10 examples. Recent sales: $350,000–$420,000. Market has stabilized after 2021 peak. PSA 9 sells for $5,000–$8,000. PSA 8 for $1,500–$2,500.",
    "Charizard Base Set 1999 Holo Rare PSA 9: Strong demand from new collectors. 2024 average sale price: $6,200. Population of ~1,800 PSA 9s means less scarcity than PSA 10 but still highly liquid.",
    "Black Lotus Alpha Edition Rare PSA 10: Only 5 known PSA 10 copies. Last public sale exceeded $500,000. Any copy grades PSA 7 or higher commands six-figure prices due to extreme rarity of the Alpha print run.",
    "Black Lotus Alpha PSA 8–9: Highly liquid with consistent buyer demand from Magic collectors and investors. PSA 9 sales average $250,000–$350,000. PSA 8 typically $80,000–$130,000.",
    "Blue-Eyes White Dragon Legend of Blue Eyes 1st Edition Ultra Rare PSA 10: One of the most iconic Yu-Gi-Oh! cards. PSA 10 population under 50. Recent sales: $15,000–$28,000.",
    "Blue-Eyes White Dragon LOB 1st Edition PSA 9: More accessible entry point for collectors. PSA 9 population around 200. Average sale price 2024: $3,500–$5,500.",
    "Mewtwo Base Set 1999 Holo Rare PSA 10: Beloved iconic card with broad appeal. PSA 10 sells $8,000–$12,000. PSA 9 market very liquid at $400–$700. Strong demand from both Pokemon fans and investors.",
    "Mewtwo Base Set PSA 8–9: Excellent liquidity. PSA 9 regularly sells within 24 hours of listing. 2024 average: $550. Grade impact: PSA 9 is roughly 4x the value of PSA 7.",
    "Pokemon Base Set 1999 general market: Cards have corrected 40–60% from 2021 pandemic highs but remain substantially above 2019 pre-boom prices. Long-term collector demand remains strong.",
    "Magic: The Gathering Power Nine general market: Stable blue-chip investment category. Alpha versions carry 3–5x premium over Unlimited. Condition sensitivity is extreme — a single grade point can represent $50,000+ in value at the top end.",
    "Yu-Gi-Oh! vintage 2002–2004 market: Experiencing a resurgence driven by nostalgia from collectors who grew up with the show. 1st Edition LOB and MRD cards up 25% year-over-year. PSA population remains thin.",
    "Grade impact multipliers (general TCG): A single PSA grade point at the high end (PSA 8→9 or 9→10) typically represents a 3–10x value multiplier. Lower grade increments (PSA 4→5) have minimal market impact.",
]

MARKET_META = [
    {"card": "charizard", "game": "pokemon", "grade_range": "10"},
    {"card": "charizard", "game": "pokemon", "grade_range": "9"},
    {"card": "black_lotus", "game": "mtg", "grade_range": "10"},
    {"card": "black_lotus", "game": "mtg", "grade_range": "8-9"},
    {"card": "blue_eyes", "game": "yugioh", "grade_range": "10"},
    {"card": "blue_eyes", "game": "yugioh", "grade_range": "9"},
    {"card": "mewtwo", "game": "pokemon", "grade_range": "10"},
    {"card": "mewtwo", "game": "pokemon", "grade_range": "8-9"},
    {"card": "pokemon_general", "game": "pokemon", "grade_range": "all"},
    {"card": "mtg_general", "game": "mtg", "grade_range": "all"},
    {"card": "yugioh_general", "game": "yugioh", "grade_range": "all"},
    {"card": "grade_multipliers", "game": "all", "grade_range": "all"},
]


# ─── Seed runner ─────────────────────────────────────────────────────────────

def seed():
    print("Seeding ChromaDB collections...")

    # Grading guidance
    col = get_collection("grading_guidance")
    if col.count() == 0:
        col.add(
            documents=GRADING_DOCS,
            metadatas=GRADING_META,
            ids=[f"grade_{i}" for i in range(len(GRADING_DOCS))],
        )
        print(f"  grading_guidance: {len(GRADING_DOCS)} documents added")
    else:
        print(f"  grading_guidance: already seeded ({col.count()} docs)")

    # Presentation flows
    col = get_collection("presentation_flows")
    if col.count() == 0:
        col.add(
            documents=FLOW_DOCS,
            metadatas=FLOW_META,
            ids=[f"flow_{i}" for i in range(len(FLOW_DOCS))],
        )
        print(f"  presentation_flows: {len(FLOW_DOCS)} documents added")
    else:
        print(f"  presentation_flows: already seeded ({col.count()} docs)")

    # Market context
    col = get_collection("market_context")
    if col.count() == 0:
        col.add(
            documents=MARKET_DOCS,
            metadatas=MARKET_META,
            ids=[f"market_{i}" for i in range(len(MARKET_DOCS))],
        )
        print(f"  market_context: {len(MARKET_DOCS)} documents added")
    else:
        print(f"  market_context: already seeded ({col.count()} docs)")

    print("Seeding complete.")


if __name__ == "__main__":
    seed()

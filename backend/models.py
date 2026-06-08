from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import re


class CardModel(BaseModel):
    id: str
    name: str
    set: str
    year: str
    rarity: str
    condition_notes: str
    image_url: str
    game: str
    border_color: str
    accent_color: str


class GradeRequest(BaseModel):
    card_id: str
    card_name: str
    card_set: str
    card_year: str
    rarity: str
    condition_notes: str
    game: str


class GradeResponse(BaseModel):
    score: int
    reasoning: str


class PriceRequest(BaseModel):
    card_id: str
    card_name: str
    card_set: str
    card_year: str
    rarity: str
    grade: int
    game: str


class PriceResponse(BaseModel):
    range: str
    driver: str


class DemoStep(BaseModel):
    step: str
    context: str


# ─── Profile schemas ──────────────────────────────────────────────────────────

class ProfileCreate(BaseModel):
    display_name:  str
    username:      str
    email:         str
    bio:           Optional[str] = None
    favorite_game: str = "all"
    avatar_color:  str = "#C9A84C"
    plan:          str = "free"

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(r"^[a-z0-9_]{3,30}$", v):
            raise ValueError("Username must be 3–30 chars: letters, numbers, underscores only")
        return v

    @field_validator("display_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Display name must be at least 2 characters")
        return v

    @field_validator("plan")
    @classmethod
    def plan_valid(cls, v: str) -> str:
        if v not in ("free", "pro", "enterprise"):
            raise ValueError("Invalid plan")
        return v


class ProfileResponse(BaseModel):
    id:            int
    display_name:  str
    username:      str
    email:         str
    bio:           Optional[str]
    favorite_game: str
    avatar_color:  str
    plan:          str
    cards_graded:  int
    created_at:    datetime

    model_config = {"from_attributes": True}

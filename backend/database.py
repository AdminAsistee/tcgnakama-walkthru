"""
ChromaDB local instance.
Holds three collections:
  - grading_guidance   : PSA criteria and game-specific grading notes
  - presentation_flows : step-by-step narration scripts
  - market_context     : historical pricing and demand signals
"""

import os
import chromadb

_client: chromadb.ClientAPI | None = None


def get_client() -> chromadb.ClientAPI:
    global _client
    if _client is None:
        persist_dir = os.getenv("CHROMA_PERSIST_DIR", "./chroma_data")
        _client = chromadb.PersistentClient(path=persist_dir)
    return _client


def get_collection(name: str):
    return get_client().get_or_create_collection(
        name=name,
        metadata={"hnsw:space": "cosine"},
    )


def query_collection(name: str, query: str, n_results: int = 3) -> list[str]:
    col = get_collection(name)
    if col.count() == 0:
        return []
    results = col.query(query_texts=[query], n_results=min(n_results, col.count()))
    return results["documents"][0] if results["documents"] else []


def is_seeded(collection_name: str) -> bool:
    return get_collection(collection_name).count() > 0

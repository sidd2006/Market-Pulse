"""Text -> vector for semantic news search.

Uses sentence-transformers (all-MiniLM-L6-v2, 384-dim) if installed. If not, falls back to a hashed
bag-of-words embedder so the app still runs (keyword-ish matching only, not truly semantic).
Vectors are L2-normalised, so cosine similarity == dot product.
"""
import hashlib
import re
from functools import lru_cache

import numpy as np

from ..config import EMBEDDING_MODEL

DIM = 384


@lru_cache(maxsize=1)
def _model():
    try:
        from sentence_transformers import SentenceTransformer
        # Try local cache first to avoid hanging on network retries
        try:
            return SentenceTransformer(EMBEDDING_MODEL, local_files_only=True)
        except Exception:
            import os
            # If offline mode or not explicitly enabled, fall back to hashed bag-of-words
            if os.getenv("HF_HUB_OFFLINE", "1") == "1":
                return None
            return SentenceTransformer(EMBEDDING_MODEL)
    except Exception:
        return None


def backend_name() -> str:
    return "sentence-transformers" if _model() is not None else "hashed-bow-fallback"


def _hash_embed(text: str) -> np.ndarray:
    vec = np.zeros(DIM, dtype=np.float32)
    for tok in re.findall(r"[a-z0-9]+", text.lower()):
        h = int(hashlib.md5(tok.encode()).hexdigest(), 16)
        vec[h % DIM] += 1.0 if (h >> 64) & 1 else -1.0
    return vec


def embed(text: str) -> list[float]:
    m = _model()
    vec = np.asarray(m.encode(text), dtype=np.float32) if m is not None else _hash_embed(text)
    n = np.linalg.norm(vec)
    if n > 0:
        vec = vec / n
    return vec.tolist()


def article_text(title: str, content: str) -> str:
    return f"{title}. {content}"


def rank(query: str, items: list[tuple[int, list[float]]], top_k: int) -> list[tuple[int, float]]:
    """items = [(article_id, embedding)] -> [(article_id, cosine_score)] best first."""
    valid = [(i, e) for i, e in items if e and len(e) == DIM]
    if not valid:
        return []
    q = np.asarray(embed(query), dtype=np.float32)
    mat = np.asarray([e for _, e in valid], dtype=np.float32)
    scores = mat @ q
    order = np.argsort(-scores)[:top_k]
    return [(valid[i][0], float(scores[i])) for i in order]

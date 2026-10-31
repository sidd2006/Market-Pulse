from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import CORS_ORIGINS
from .database import Base, engine
from .routers import alerts, auth, news, stocks, trading, watchlists


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup (safe no-op if they already exist)
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="MarketPulse API", version="1.0.0", lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS, allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

for r in (auth.router, stocks.router, trading.router, watchlists.router, alerts.router, news.router):
    app.include_router(r)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}


# Mount frontend single page application
_static_dir = Path(__file__).resolve().parent / "static"
if _static_dir.exists():
    app.mount("/", StaticFiles(directory=str(_static_dir), html=True), name="static")


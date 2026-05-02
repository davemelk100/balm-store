from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.api.routes.auth import router as auth_router
from app.api.routes.checkout import router as checkout_router
from app.api.routes.products import router as products_router
from app.api.routes.stripe_webhook import router as stripe_webhook_router
from app.db.database import engine, Base
from app.core.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BALM Store API", version="1.0.0")

# CORS - Use settings from config
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the legacy backend public/ assets (kept for any backend-served images)
public_dir = Path(__file__).parent.parent / "public"
if public_dir.exists():
    app.mount("/static", StaticFiles(directory=str(public_dir)), name="static")

# API routers
app.include_router(auth_router)
app.include_router(checkout_router)
app.include_router(products_router)
app.include_router(stripe_webhook_router)

# Serve the built frontend (Vite output). When the build is missing (e.g. dev
# where Vite serves the SPA itself), fall back to a JSON root so the API still
# responds.
frontend_dist = Path(__file__).parent.parent.parent / "frontend" / "dist"

if frontend_dist.exists():
    assets_dir = frontend_dist / "assets"
    if assets_dir.exists():
        app.mount(
            "/assets",
            StaticFiles(directory=str(assets_dir)),
            name="frontend-assets",
        )

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Don't let the SPA shell mask 404s on API consumers.
        if full_path.startswith("api/"):
            return JSONResponse({"detail": "Not Found"}, status_code=404)
        # Real files in dist (favicon, /img/..., etc.) win over the shell.
        candidate = frontend_dist / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(frontend_dist / "index.html")
else:
    @app.get("/")
    def root():
        return {"message": "BALM Store API", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

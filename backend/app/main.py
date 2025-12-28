from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.api.routes.products import router as products_router
from app.api.routes.auth import router as auth_router
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

# Mount static files directory
public_dir = Path(__file__).parent.parent / "public"
if public_dir.exists():
    app.mount("/static", StaticFiles(directory=str(public_dir)), name="static")

# Include routers
app.include_router(products_router)
app.include_router(auth_router)

@app.get("/")
def root():
    return {"message": "BALM Store API", "version": "1.0.0"}

@app.get("/admin/store", response_class=HTMLResponse)
async def serve_store_admin():
    """Serve the store admin panel"""
    admin_file = Path(__file__).parent.parent / "store_admin.html"
    if admin_file.exists():
        return HTMLResponse(content=admin_file.read_text())
    return HTMLResponse(content="<h1>Admin panel not found</h1>", status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

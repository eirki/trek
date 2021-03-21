import sys

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from . import api, dev, version

# from .submodule import module

DEBUG_MODE = "--reload" in sys.argv

app = FastAPI()
app.mount("/dist", StaticFiles(directory="frontend/dist"), name="dist")
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")
templates = Jinja2Templates(directory="frontend/templates")

app.include_router(api.router)

if DEBUG_MODE:
    app.mount("/src", StaticFiles(directory="frontend/src"), name="src")
    app.include_router(dev.router(templates))


@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": "Title here",
            "source": "dist",
            "importmap": None,
        },
    )


@app.get("/version")
async def version_page() -> str:
    return version.version

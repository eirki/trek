import json
from pathlib import Path

from fastapi import APIRouter, Request

build_folder = "dist/_snowpack/pkg"


def fix_path(path: str) -> str:  # no test coverage
    path = path[1:]
    path = "/" + build_folder + path
    if not path.endswith(".js"):
        path += ".proxy.js"
    return path


def load_importmap() -> str:  # no test coverage
    with open(f"frontend/{build_folder}/import-map.json") as file_:
        importmap = json.load(file_)
    importmap["imports"] = {
        key: fix_path(val) for key, val in importmap["imports"].items()
    }
    return json.dumps(importmap)


def router(templates):  # no test coverage
    dev_router = APIRouter()

    importmap = load_importmap()

    @dev_router.get("/src")
    async def root(request: Request):
        return templates.TemplateResponse(
            "index.html",
            {
                "request": request,
                "importmap": importmap,
                "source": "src",
            },
        )

    @dev_router.get("/devcards/")
    async def serve_devcard_list(request: Request):
        devcards = [
            path.stem
            for path in Path("frontend/src/devcards").glob("*.js")
            if not path.stem.startswith("_")
        ]
        return templates.TemplateResponse(
            "devcard-list.html",
            {
                "request": request,
                "source": "src",
                "devcards": devcards,
                "importmap": importmap,
            },
        )

    @dev_router.get("/devcards/{devcard}")
    async def serve_devcard(request: Request, devcard: str):
        return templates.TemplateResponse(
            "devcard.html",
            {
                "request": request,
                "source": "src",
                "devcard": devcard,
                "importmap": importmap,
            },
        )

    return dev_router

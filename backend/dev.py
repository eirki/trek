import json

from fastapi import APIRouter, Request

build_folder = "dist/_snowpack/pkg"


def fix_path(path: str) -> str:
    path = path[1:]
    path = "/" + build_folder + path
    if not path.endswith(".js"):
        path += ".proxy.js"
    return path


def load_importmap() -> str:
    with open(f"frontend/{build_folder}/import-map.json") as file_:
        importmap = json.load(file_)
    importmap["imports"] = {
        key: fix_path(val) for key, val in importmap["imports"].items()
    }
    return json.dumps(importmap)


def router(templates):
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

    return dev_router

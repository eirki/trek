from __future__ import annotations

import typing as t

from fastapi import APIRouter, Depends, Query, Request
import geopy
from geopy.geocoders import Nominatim
import httpx

from . import env

router = APIRouter(
    prefix="/api",
)
geolocator = Nominatim(user_agent="trek")


def point_dict(location: geopy.Location) -> dict:
    return {
        "address": location.address,
        "latitude": location.latitude,
        "longitude": location.longitude,
        "altitude": location.altitude,
    }


def location_query(query: str) -> t.Optional[list[geopy.Location]]:  # no test coverage
    try:
        return geolocator.geocode(query, exactly_one=False, language="en")
    except geopy.exc.GeocoderUnavailable:
        return None


@router.get("/locations")
async def data(request: Request, query: str):
    query = query.lower()
    locations = location_query(query)
    return {
        "result": [point_dict(loc) for loc in locations]
        if locations is not None
        else []
    }


class CoordinatesElevation(t.TypedDict):
    lat: float
    lon: float
    elevation: float


class GraphhopperRoute(t.TypedDict):
    time: int
    bbox: tuple[float, float, float, float]  # actually list
    distance: float
    weight: float
    transfers: int
    points_encoded: bool
    coordinates: list[CoordinatesElevation]


@router.get("/items/")
async def read_item(points: t.List[int] = Query(None)):
    return {"ok": True}


def split_coord(point: str) -> tuple[float, float]:
    lat, lon = point.split(",")
    return float(lat), float(lon)


def parse_coord_list(point: list[str] = Query(None)) -> list[tuple[float, float]]:
    return [split_coord(p) for p in point]


@router.get("/route")
async def route(point: list[tuple[float, float]] = Depends(parse_coord_list)):
    res = httpx.get(
        env.graphopper_url,
        params={
            "point": [f"{lat},{lon}" for lat, lon in point],
            "elevation": True,
            "key": env.graphhopper_api_key,
            "type": "json",
            "points_encoded": False,
            "instructions": False,
            "avoid": "motorway",
        },
    )
    res.raise_for_status()
    data = res.json()
    route: GraphhopperRoute = data["paths"][0]
    return route

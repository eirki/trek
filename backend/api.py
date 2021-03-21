from fastapi import APIRouter, Request
import geopy
from geopy.geocoders import Nominatim

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


@router.get("/locations")
async def data(request: Request, query: str):
    query = query.lower()
    locations = geolocator.geocode(query, exactly_one=False, language="en")
    return {
        "result": [point_dict(loc) for loc in locations]
        if locations is not None
        else []
    }

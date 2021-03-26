import re
from unittest.mock import patch

from fastapi.testclient import TestClient
from geopy import Location, Point
import httpx
import pytest

from . import conftest
from .. import api, env

client = TestClient(api.router)


def test_version():
    with patch("backend.api.location_query") as mock:
        mock.return_value = [
            Location(
                address="test_adress",
                point=Point(latitude=41.5, longitude=-81),
                raw="abc",
            )
        ]
        response = client.get("/api/locations", params={"query": "testing"})
        assert response.json() == {
            "result": [
                {
                    "address": "test_adress",
                    "latitude": 41.5,
                    "longitude": -81.0,
                    "altitude": 0.0,
                }
            ]
        }


def url_params():
    points = [(60.1802571, 0.3421891), (59.287426, 7.8192812)]
    return [
        ("/api/route?point=60.1802571%2C10.3421891&point=59.287426%2C17.8192812", {}),
        (
            "/api/route",
            {"point": [f"{lat},{lon}" for lat, lon in points]},
        ),
    ]


@pytest.mark.parametrize("url_params", url_params())
@pytest.mark.asyncio
async def test_route(url_params, httpx_mock):
    api_res = {
        "hints": {"visited_nodes.sum": 10, "visited_nodes.average": 10.0},
        "info": {
            "copyrights": ["GraphHopper", "OpenStreetMap contributors"],
            "took": 0,
        },
        "paths": [
            {
                "distance": 60.029,
                "weight": 14.406938,
                "time": 13505,
                "transfers": 0,
                "points_encoded": False,
                "bbox": [5.327009, 60.377041, 5.327668, 60.377279],
                "points": {
                    "type": "LineString",
                    "coordinates": [
                        [5.327668, 60.377041, 48.05],
                        [5.327178, 60.377279, 46.65],
                        [5.327009, 60.377161, 59.75],
                    ],
                },
                "legs": [],
                "details": {},
                "ascend": 13.104000091552734,
                "descend": 1.4039993286132812,
                "snapped_waypoints": {
                    "type": "LineString",
                    "coordinates": [
                        [5.327668, 60.377041, 48.05],
                        [5.327009, 60.377161, 59.75],
                    ],
                },
            }
        ],
    }
    httpx_mock.add_response(
        url=re.compile(env.graphopper_url + r".*"),
        json=api_res,
    )
    url, params = url_params
    async with httpx.AsyncClient(
        app=api.router, base_url=f"http://{conftest.testurl}"
    ) as a_client:
        res = await a_client.get(url, params=params)
    assert res.status_code == 200
    assert isinstance(api_res["paths"], list)
    assert res.json() == api_res["paths"][0]

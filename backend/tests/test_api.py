from unittest.mock import patch

from fastapi.testclient import TestClient
from geopy import Location, Point

from .. import api

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

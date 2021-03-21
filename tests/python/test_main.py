from fastapi.testclient import TestClient

from backend import main

client = TestClient(main.app)


def test_home():
    response = client.get("/")
    assert response.status_code == 200


def uncovered():
    ...

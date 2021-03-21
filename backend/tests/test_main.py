from fastapi.testclient import TestClient

from .. import main, version

client = TestClient(main.app)


def test_home():
    response = client.get("/")
    assert response.status_code == 200


def test_version():
    response = client.get("/version")
    assert response.status_code == 200
    assert response.json() == version.version

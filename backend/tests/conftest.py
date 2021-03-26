import pytest
from urllib3.connectionpool import HTTPConnectionPool

testurl = "testurl"


@pytest.fixture(autouse=True)
def no_http_requests(monkeypatch):  # no test coverage
    """https://blog.jerrycodes.com/no-http-requests/"""
    allowed_hosts = {"localhost"}
    original_urlopen = HTTPConnectionPool.urlopen

    def urlopen_mock(self, method, url, *args, **kwargs):
        if self.host in allowed_hosts:
            return original_urlopen(self, method, url, *args, **kwargs)

        raise RuntimeError(
            f"The test was about to {method} {self.scheme}://{self.host}{url}"
        )

    monkeypatch.setattr(
        "urllib3.connectionpool.HTTPConnectionPool.urlopen", urlopen_mock
    )


@pytest.fixture
def non_mocked_hosts() -> list:
    return [testurl]

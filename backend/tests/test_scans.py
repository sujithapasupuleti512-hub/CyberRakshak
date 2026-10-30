"""Scan history and dashboard endpoint tests."""


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_anonymous_scan_is_analysed_but_not_stored(client):
    response = client.post("/api/scan/url", json={"target": "https://example.com"})
    assert response.status_code == 200
    assert response.json()["risk"] == "Low Risk"


def test_scan_requires_correct_payload(client):
    response = client.post("/api/scan/url", json={"target": "not a url"})
    assert response.status_code == 422


def test_authenticated_scan_is_persisted(client, registered_user):
    headers, _ = registered_user
    response = client.post(
        "/api/scan/url",
        json={"target": "http://paypa1-secure-login.com/verify"},
        headers=headers,
    )
    assert response.status_code == 200
    assert response.json()["risk"] == "High Risk"

    history = client.get("/api/scans", headers=headers)
    assert history.status_code == 200
    assert len(history.json()) == 1
    assert history.json()[0]["risk"] == "High Risk"


def test_scans_require_authentication(client):
    assert client.get("/api/scans").status_code == 401


def test_dashboard_stats_aggregation(client, registered_user):
    headers, _ = registered_user
    client.post("/api/scan/url", json={"target": "https://example.com"}, headers=headers)
    client.post("/api/scan/url", json={"target": "http://paypa1-secure-login.com/verify"}, headers=headers)

    stats = client.get("/api/dashboard/stats", headers=headers)
    assert stats.status_code == 200
    body = stats.json()
    assert body["total"] == 2
    assert body["low"] == 1
    assert body["high"] == 1
    assert len(body["recent"]) == 2


def test_clear_scans(client, registered_user):
    headers, _ = registered_user
    client.post("/api/scan/domain", json={"target": "example.com"}, headers=headers)
    assert client.delete("/api/scans", headers=headers).status_code == 204
    assert client.get("/api/scans", headers=headers).json() == []

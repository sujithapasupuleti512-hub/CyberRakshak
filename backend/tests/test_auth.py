"""Authentication endpoint tests."""


def test_register_returns_token_and_user(client):
    response = client.post(
        "/api/auth/register",
        json={"name": "Alice", "email": "alice@example.com", "password": "password123"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["user"]["email"] == "alice@example.com"
    assert "hashed_password" not in body["user"]


def test_register_rejects_duplicate_email(client):
    payload = {"name": "Bob", "email": "bob@example.com", "password": "password123"}
    assert client.post("/api/auth/register", json=payload).status_code == 201
    assert client.post("/api/auth/register", json=payload).status_code == 409


def test_register_rejects_short_password(client):
    response = client.post(
        "/api/auth/register",
        json={"name": "Bob", "email": "bob@example.com", "password": "short"},
    )
    assert response.status_code == 422


def test_login_with_valid_credentials(client):
    client.post(
        "/api/auth/register",
        json={"name": "Carol", "email": "carol@example.com", "password": "password123"},
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "carol@example.com", "password": "password123"},
    )
    assert response.status_code == 200
    assert response.json()["access_token"]


def test_login_with_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={"name": "Dave", "email": "dave@example.com", "password": "password123"},
    )
    response = client.post(
        "/api/auth/login",
        json={"email": "dave@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_me_requires_authentication(client):
    assert client.get("/api/auth/me").status_code == 401


def test_me_returns_current_user(client, registered_user):
    headers, user = registered_user
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == user["email"]

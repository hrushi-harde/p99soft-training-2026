from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_signup_and_login_flow():
  # Signup
  email = "test@example.com"
  password = "strongpassword"

  resp = client.post("/auth/signup", json={"email": email, "password": password})
  assert resp.status_code == 201
  data = resp.json()
  assert data["email"] == email

  # Login
  resp = client.post("/auth/login", json={"email": email, "password": password})
  assert resp.status_code == 200
  tokens = resp.json()
  assert "access_token" in tokens

  # Access protected route
  headers = {"Authorization": f"Bearer {tokens['access_token']}"}
  resp = client.get("/protected", headers=headers)
  assert resp.status_code == 200
  assert "message" in resp.json()

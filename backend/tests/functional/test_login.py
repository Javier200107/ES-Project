from backend.data import data_accounts


def test_login_action(client):
    account = data_accounts[0]
    client.post("/account", json=account)

    response = client.post(
        "/login", json={"username": "User1", "password": account["password"]}
    )
    assert response.status_code == 404
    assert "Login failed!" in response.json["message"]

    response = client.post(
        "/login", json={"username": account["username"], "password": "Pwd1"}
    )
    assert response.status_code == 404
    assert "Invalid password!" in response.json["message"]

    response = client.post(
        "/login",
        json={"username": account["username"], "password": account["password"]},
    )
    assert response.status_code == 200
    assert len(response.json["token"]) > 0

    client.loginAs(account)
    assert len(client.accountToken) > 0


def test_login_status(client):
    account = data_accounts[0]
    client.post("/account", json=account)

    assert client.get("/login").status_code == 401

    client.loginAs(account)
    response = client.get("/login")
    assert response.status_code == 200
    assert response.json["message"] == f"Authorized! ({account['username']})"

    token = client.accountToken + "bad"
    client.logOut()
    response = client.get("/login", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401

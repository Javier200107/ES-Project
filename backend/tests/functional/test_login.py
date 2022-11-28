def test_login_bad_user(app_with_data):
    login = {"username": "User2", "password": "xd"}

    response = app_with_data.post("/login", json=login)
    assert response.status_code == 404 and "Login failed!" in response.json["message"]


def test_login_bad_password(app_with_data):
    login = {"username": "fernandito1", "password": "xd"}

    response = app_with_data.post("/login", json=login)
    assert (
        response.status_code == 404 and "Invalid password!" in response.json["message"]
    )


def test_login_ok(app_with_data):
    login = {"username": "fernandito1", "password": "alonsete2042343"}

    response = app_with_data.post("/login", json=login)
    status_code, token = response.status_code, response.json["token"]
    assert status_code == 200 and len(token) > 0

    response = app_with_data.get("/login", headers={"Authorization": f"Bearer {token}"})
    assert (
        response.status_code == 200
        and response.json["message"] == "Authorized! (fernandito1)"
    )


def test_login_no_auth(app_with_data):
    response = app_with_data.get("/login")
    assert response.status_code == 401

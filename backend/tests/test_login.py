login0 = {'username': "User1", 'password': "akF3#7cM"}
login1 = {'username': "User1", 'password': "xd"}
login2 = {'username': "User2", 'password': "xd"}


def test_login(client):
    response = client.post("/api/login", json=login2)
    assert response.status_code == 404 and "Login failed!" in response.json['message']

    response = client.post("/api/login", json=login1)
    assert response.status_code == 404 and "Invalid password!" in response.json['message']

    response = client.post("/api/login", json=login0)
    status_code, token = response.status_code, response.json['token']
    assert status_code == 200 and len(token) > 0

    response = client.get("/api/login", auth=(token, ''))
    assert response.status_code == 200 and response.json['message'] == "Authorized! (User1)"

    response = client.get("/api/login")
    assert response.status_code == 401

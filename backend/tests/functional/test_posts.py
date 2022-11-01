def _getUserToken(api):
    login = {"username": "fernandito1", "password": "alonsete2042343"}

    response = api.post("/login", json=login)
    return response.json["token"]


def test_getPosts(app_with_data):
    token = _getUserToken(app_with_data)
    data = {"limit": 10, "offset": 0}

    response = app_with_data.get("/posts", json=data, auth=(token, ""))
    assert response.status_code == 200 and len(response.json["posts"]) == 2


def test_createPost(app_with_data):
    token = _getUserToken(app_with_data)
    data = {"text": "New cool post", "parent_id": None}

    response = app_with_data.post("/posts", json=data, auth=(token, ""))
    assert response.status_code == 201

def _getUserToken(api):
    login = {"username": "fernandito1", "password": "alonsete2042343"}

    response = api.post("/login", json=login)
    return response.json["token"]


def test_getuserPosts(app_with_data):
    token = _getUserToken(app_with_data)
    response = app_with_data.get("/uposts/fernandito1?limit=10&offset=0", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200 and len(response.json["posts"]) == 6


def test_getPosts(app_with_data):
    token = _getUserToken(app_with_data)
    response = app_with_data.get("/posts?limit=10&offset=0", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200 and len(response.json["posts"]) == 6


def test_createPost(app_with_data):
    token = _getUserToken(app_with_data)
    data = {"text": "New cool post", "parent_id": None}

    response = app_with_data.post("/posts", json=data, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201

def _getUserToken(api):
    login = {"username": "fernandito1", "password": "alonsete2042343"}

    response = api.post("/login", json=login)
    return response.json["token"]


def test_postLike(app_with_data):
    token = _getUserToken(app_with_data)
    data = {"text": "New cool post", "parent_id": None}
    response= app_with_data.post("/posts", json=data, auth=(token, ""))
    post= response.json["post"]
    id=post["id"]
    l= app_with_data.post("/likes/"+str(id), auth=(token, ""))
    a=l.json["Post"]
    assert len(a["accounts_like"])!=0



def test_deleteLike(app_with_data):
    token = _getUserToken(app_with_data)
    data = {"text": "New cool post", "parent_id": None}
    response = app_with_data.post("/posts", json=data, auth=(token, ""))

    post = response.json["post"]
    id = post["id"]
    app_with_data.post("/likes/" + str(id), auth=(token, ""))
    response= app_with_data.delete("/likes/" + str(id), auth=(token, ""))
    assert response.status_code == 200

def test_getLike(app_with_data):
    token = _getUserToken(app_with_data)
    data = {"text": "New cool post", "parent_id": None}
    response = app_with_data.post("/posts", json=data, auth=(token, ""))
    post = response.json["post"]
    id = post["id"]
    app_with_data.get("/likes/fernandito1," + str(id), auth=(token, ""))
    assert response.status_code == 201


def test_getListPostLikes(app_with_data):
    token = _getUserToken(app_with_data)
    data = {"text": "New cool post", "parent_id": None}
    response = app_with_data.post("/posts", json=data, auth=(token, ""))
    post = response.json["post"]
    id = post["id"]
    app_with_data.post("/likes/"+str(id), auth=(token, ""))
    list = app_with_data.get("/likePlist/" + str(id), auth=(token, "")).json["ListPostLikes"]
    assert len(list) == 1

def test_getListUserLikes(app_with_data):
    token = _getUserToken(app_with_data)
    data = {"text": "New cool post", "parent_id": None}
    response = app_with_data.post("/posts", json=data, auth=(token, ""))
    post = response.json["post"]
    list1 = app_with_data.get("/likeUlist/", auth=(token, "")).json["ListUserLikes"]
    id = post["id"]
    app_with_data.post("/likes/"+str(id), auth=(token, ""))
    list = app_with_data.get("/likeUlist/", auth=(token, "")).json["ListUserLikes"]
    assert len(list1) +1 == len(list)

def test_DoubleLike(app_with_data):
    token = _getUserToken(app_with_data)
    data = {"text": "New cool post", "parent_id": None}
    response = app_with_data.post("/posts", json=data, auth=(token, ""))
    post = response.json["post"]
    id = post["id"]
    app_with_data.post("/likes/" + str(id), auth=(token, ""))
    response= app_with_data.post("/likes/" + str(id), auth=(token, ""))
    assert response.status_code==404

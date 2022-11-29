def _getUserToken(api):
    login = {"username": "fernandito1", "password": "alonsete2042343"}
    response = api.post("/login", json=login)
    return response.json["token"]


# He afegit delete al final dels mètodes ja que si no hi ha conflictes al executar tots els tests seguits
def test_post_follow(app_with_data):
    token = _getUserToken(app_with_data)
    response = app_with_data.post(
        "/account",
        json={
            "username": "postfollow",
            "password": "postfollow",
            "nom": "postfollow",
            "email": "postfollow@gmail.com",
            "cognom": "postfollow",
            "birthdate": "2002-01-10",
            "is_admin": 0,
        },
    )
    acc1 = response.json["account"]
    user = acc1["username"]
    length = len(acc1["followers"])
    response = app_with_data.post(
        "/follow/" + user, headers={"Authorization": f"Bearer {token}"}
    ).json["Account"]
    app_with_data.delete(
        "/follow/" + user, headers={"Authorization": f"Bearer {token}"}
    ).json["Account"]
    assert len(response["followers"]) == length + 1


def test_getFollow(app_with_data):
    token = _getUserToken(app_with_data)
    response = app_with_data.post(
        "/account",
        json={
            "username": "Get",
            "password": "get",
            "nom": "Get",
            "email": "get",
            "cognom": "Get",
            "birthdate": "2000-01-10",
            "is_admin": 0,
        },
    )
    acc = response.json["account"]
    user = acc["username"]

    app_with_data.post(
        "/follow/" + user, headers={"Authorization": f"Bearer {token}"}
    ).json["Account"]
    response = app_with_data.get(
        "/follow/" + user, headers={"Authorization": f"Bearer {token}"}
    )
    app_with_data.delete(
        "/follow/" + user, headers={"Authorization": f"Bearer {token}"}
    ).json["Account"]
    assert response.status_code == 200


def test_deleteFollow(app_with_data):
    token = _getUserToken(app_with_data)
    response1 = app_with_data.post(
        "/account",
        json={
            "username": "Delete1",
            "password": "1234",
            "nom": "Delete",
            "email": "delete@gmail.com",
            "cognom": "delete",
            "birthdate": "2001-01-10",
            "is_admin": 0,
        },
    )

    acc = response1.json["account"]
    user = acc["username"]
    length = len(acc["followers"])
    response1 = app_with_data.post(
        "/follow/" + user, headers={"Authorization": f"Bearer {token}"}
    ).json["Account"]
    response2 = app_with_data.delete(
        "/follow/" + user, headers={"Authorization": f"Bearer {token}"}
    ).json["Account"]
    assert len(response1["followers"]) - 1 == length == len(response2["followers"])


def test_getListFollow(app_with_data):
    token = _getUserToken(app_with_data)
    responselistf = app_with_data.post(
        "/account",
        json={
            "username": "listfollow",
            "password": "listfollow",
            "nom": "listfollow",
            "email": "listfollow@gmail.com",
            "cognom": "listfollow",
            "birthdate": "2002-01-10",
            "is_admin": 0,
        },
    )
    acc = responselistf.json["account"]
    user = acc["username"]
    length = len(acc["followers"])
    app_with_data.post("/follow/" + user, headers={"Authorization": f"Bearer {token}"})
    responselistf = app_with_data.get(
        "/followList/" + user, headers={"Authorization": f"Bearer {token}"}
    ).json["ListFollows"]
    assert len(responselistf) == length + 1


def test_getListFollowing(app_with_data):
    token = _getUserToken(app_with_data)
    response = app_with_data.post(
        "/account",
        json={
            "username": "Alejandro19",
            "password": "_mypass1293_",
            "nom": "Alejandro",
            "email": "alex19@gmail.com",
            "cognom": "Torso",
            "birthdate": "2002-01-10",
            "is_admin": 0,
        },
    )
    acc = response.json["account"]
    username = acc["username"]
    app_with_data.post(
        "/follow/" + username, headers={"Authorization": f"Bearer {token}"}
    )
    response = app_with_data.get(
        "/followingList/", headers={"Authorization": f"Bearer {token}"}
    ).json["ListFollowing"]
    assert len(response) != 0

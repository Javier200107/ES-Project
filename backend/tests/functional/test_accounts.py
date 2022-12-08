from backend.data import data_accounts, data_posts


def test_create_user(client):
    account = data_accounts[0]

    assert client.post("/account", json=account).status_code == 201
    assert client.post("/account", json=account).status_code == 409


def test_get_user(client):
    account = data_accounts[0]
    username = account["username"]

    client.post("/account", json=data_accounts[1])
    client.loginAs(data_accounts[1])

    assert client.get(f"/account/{username}").status_code == 404

    client.post("/account", json=account)

    response = client.get(f"/account/{username}")
    assert response.status_code == 200
    assert response.json["account"]["username"] == username


def test_delete_user(client):
    account = data_accounts[0]
    username = account["username"]

    client.post("/account", json=account)
    client.loginAs(account)

    assert client.delete(f"/account/{username}").status_code == 200
    assert client.delete(f"/account/{username}").status_code == 401


def test_find_user(client):
    account = data_accounts[0].copy()
    usernames = ["Clex", "Alex", "Blex", "blex", "ferr", "124jt"]

    for user in usernames:
        account["username"], account["email"] = user, user
        client.post("/account", json=account)

    client.loginAs(account)
    assert client.get("/accounts/search/LeX").json["accounts"] == [
        "Alex",
        "Blex",
        "blex",
        "Clex",
    ]

def test_delete_user_delete_all(client):
    account = data_accounts[0]
    username = account["username"]
    client.post("/account", json=account)
    client.loginAs(account)
    post2 = data_posts[1]
    response =client.post("/posts", json=post2)
    postuser1 = response.json["post"]
    # Afegim un post
    assert response.status_code == 201

    # Afegim un follow

    account2 = data_accounts[1]
    client.post("/account", json=account2)
    response = client.post("/follow/" + account2["username"]).json["Account"]
    assert len(response["followers"]) ==1

    # Creem post de l'altre usuari
    client.loginAs(account2)
    response =client.post("/posts", json=post2)
    postuser2= response.json["post"]
    assert response.status_code == 201

    # afegim un comentari al post de l'usuari que eliminarem
    post3 = data_posts[0].copy()
    post3.update({"parent_id": str(postuser1["id"])})
    response = client.post("/posts", json=post3)
    assert response.json["post"]["parent_id"] == postuser1["id"]

    client.loginAs(account)
    # Afegim like fet per l'usuari a eliminar
    response = client.post("/likes/" + str(postuser2["id"]))
    assert response.json["Post"]["num_likes"] == 1

    # Afegim comentari fet per l'usuari a eliminar en un altre post

    post3 = data_posts[0].copy()
    post3.update({"parent_id": str(postuser2["id"])})
    response =client.post("/posts", json=post3)
    assert response.json["post"]["parent_id"] == postuser2["id"]

    #Eliminem l'usuari

    assert client.delete(f"/account/{username}").status_code == 200

    client.loginAs(account2)
    # S'eliminen els follows
    assert len(client.get("/followList/").json["ListFollows"]) == 0
    # S'eliminen els posts
    posts = client.get("/posts?limit=10&offset=0").json["posts"]
    assert len(posts) == 1
    # s'eliminen els likes
    assert posts[0]["num_likes"] == 0

    # s'eliminen els comentaris fets per l'usuari
    assert posts[0]["num_comments"] == 0
    # s'elimnen els comentaris fets al post de l'usuari eliminat
    message = client.get("/comments/1?limit=10&offset=0").json["message"]
    assert message == "No comments were found"




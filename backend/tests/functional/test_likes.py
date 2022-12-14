from backend.data import data_accounts, data_posts


def test_postLike(client):
    client.post("/account", json=data_accounts[0])
    client.loginAs(data_accounts[0])

    post = client.post("/posts", json=data_posts[0]).json["post"]

    response = client.post("/likes/" + str(post["id"]))
    assert len(response.json["Post"]["accounts_like"]) == 1


def test_deleteLike(client):
    client.post("/account", json=data_accounts[0])
    client.loginAs(data_accounts[0])

    post = client.post("/posts", json=data_posts[0]).json["post"]
    client.post("/likes/" + str(post["id"]))

    response = client.delete("/likes/" + str(post["id"]))
    assert response.status_code == 200


def test_getLike(client):
    client.post("/account", json=data_accounts[0])
    client.loginAs(data_accounts[0])
    username = data_accounts[0]

    post = client.post("/posts", json=data_posts[0]).json["post"]

    response = client.get(f"/likes/{username}/" + str(post["id"]))
    assert response.status_code == 404


def test_getListPostLikes(client):
    client.post("/account", json=data_accounts[0])
    client.loginAs(data_accounts[0])

    post = client.post("/posts", json=data_posts[0]).json["post"]
    client.post("/likes/" + str(post["id"]))

    response = client.get("/likePlist/" + str(post["id"]))
    assert len(response.json["ListPostLikes"]) == 1


def test_getListUserLikes(client):
    client.post("/account", json=data_accounts[0])
    client.loginAs(data_accounts[0])

    post = client.post("/posts", json=data_posts[0]).json["post"]

    list1 = client.get("/likeUlist").json["ListUserLikes"]
    client.post("/likes/" + str(post["id"]))
    list2 = client.get("/likeUlist").json["ListUserLikes"]
    assert len(list1) + 1 == len(list2)
    response = client.put(f"/posts/{post['id']}", json={"archived": 1})
    assert response.status_code == 200
    list3 = client.get("/likeUlist").json["ListUserLikes"]
    assert len(list3)  == len(list2) -1


def test_DoubleLike(client):
    client.post("/account", json=data_accounts[0])
    client.loginAs(data_accounts[0])

    post = client.post("/posts", json=data_posts[0]).json["post"]

    client.post("/likes/" + str(post["id"]))
    response = client.post("/likes/" + str(post["id"]))
    assert response.status_code == 404

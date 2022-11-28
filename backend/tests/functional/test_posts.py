from backend.data import data_accounts, data_posts


def createPosts(client):
    account1, account2 = data_accounts[0], data_accounts[1]
    client.post("/account", json=account1)
    client.post("/account", json=account2)

    client.loginAs(account1)
    post = client.post("/posts", json=data_posts[0]).json["post"]

    client.loginAs(account2)
    post2 = data_posts[1]
    post2.update({"parent_id": post["id"]})
    assert client.post("/posts", json=post2).status_code == 201


def test_getUserPosts(client):
    createPosts(client)
    client.loginAs(data_accounts[0])
    username = data_accounts[0]["username"]

    response = client.get(f"/uposts/{username}?limit=10&offset=0")
    assert response.status_code == 200
    assert len(response.json["posts"]) == 1


def test_getPosts(client):
    createPosts(client)
    client.loginAs(data_accounts[0])

    response = client.get("/posts?limit=10&offset=0")
    assert response.status_code == 200
    assert len(response.json["posts"]) == 2


def test_createPost(client):
    createPosts(client)

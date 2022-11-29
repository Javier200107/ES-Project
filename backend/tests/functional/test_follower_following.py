from backend.data import data_accounts, data_posts


def test_postFollow(client):
    client.post("/account", json=data_accounts[0]).json["account"]
    account = client.post("/account", json=data_accounts[1]).json["account"]

    client.loginAs(data_accounts[0])

    response = client.post("/follow/" + account["username"]).json["Account"]
    assert len(response["followers"]) == len(account["followers"]) + 1


def test_getFollow(client):
    client.post("/account", json=data_accounts[0]).json["account"]
    account = client.post("/account", json=data_accounts[1]).json["account"]

    client.loginAs(data_accounts[0])

    response = client.post("/follow/" + account["username"]).json["Account"]

    response = client.get("/follow/" + account["username"])
    assert response.status_code == 200


def test_deleteFollow(client):
    client.post("/account", json=data_accounts[0]).json["account"]
    account = client.post("/account", json=data_accounts[1]).json["account"]

    client.loginAs(data_accounts[0])

    user = account["username"]
    length = len(account["followers"])

    response1 = client.post("/follow/" + user).json["Account"]
    response2 = client.delete("/follow/" + user).json["Account"]
    assert len(response1["followers"]) - 1 == length == len(response2["followers"])


def test_getListFollow(client):
    client.post("/account", json=data_accounts[0]).json["account"]
    account = client.post("/account", json=data_accounts[1]).json["account"]

    client.loginAs(data_accounts[0])

    response = client.post("/follow/" + account["username"]).json["Account"]

    response = client.get("/followList/" + account["username"])
    assert len(response.json["ListFollows"]) == len(account["followers"]) + 1


def test_getListFollowing(client):
    client.post("/account", json=data_accounts[0]).json["account"]
    account = client.post("/account", json=data_accounts[1]).json["account"]

    client.loginAs(data_accounts[0])

    response = client.post("/follow/" + account["username"]).json["Account"]

    response = client.get("/followingList/")
    assert len(response.json["ListFollowing"]) != 0


def test_getPostFollowing(client):
    acc1 = client.post("/account", json=data_accounts[0]).json["account"]
    acc2 = client.post("/account", json=data_accounts[1]).json["account"]

    client.loginAs(data_accounts[0])
    response = client.post("/follow/" + acc2["username"]).json["Account"]

    client.loginAs(data_accounts[1])
    post = client.post("/posts", json=data_posts[0]).json["post"]

    response2 = client.get("/followingPosts/" + acc1["username"] + "?limit=10&offset=0")
    response3 = client.get("/uposts/" + acc2["username"] + "?limit=10&offset=0")

    assert response2.status_code == 200 and len(response2.json["posts"]) == len(
        response3.json["posts"]
    )

from backend.data import data_accounts


def test_postFollow(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    response = client.post("/follow/" + account["username"]).json["Account"]
    assert len(response["followers"]) == len(account["followers"]) + 1


def test_getFollow(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    client.post("/follow/" + account["username"])

    response = client.get("/follow/" + account["username"])
    assert response.status_code == 200


def test_deleteFollow(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    user = account["username"]
    length = len(account["followers"])

    response1 = client.post("/follow/" + user).json["Account"]
    response2 = client.delete("/follow/" + user).json["Account"]
    assert len(response1["followers"]) - 1 == length == len(response2["followers"])


def test_getListFollow(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    client.post("/follow/" + account["username"])

    response = client.get("/followList/" + account["username"])
    assert len(response.json['ListFollows']) == len(account["followers"]) + 1


def test_getListFollowing(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    client.post("/follow/" + account["username"])

    response = client.get("/followingList/")
    assert len(response.json['ListFollowing']) != 0

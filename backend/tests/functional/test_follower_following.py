from backend.data import data_accounts


def test_post_follow(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    response = client.post("/follow/" + str(account["id"])).json["Account"]
    assert len(response["followers"]) == len(account["followers"]) + 1


def test_getFollow(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    client.post("/follow/" + str(account["id"]))

    response = client.get("/follow/" + str(account["id"]))
    assert response.status_code == 200


def test_deleteFollow(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    id = account["id"]
    length = len(account["followers"])

    response1 = client.post("/follow/" + str(id)).json["Account"]
    response2 = client.delete("/follow/" + str(id)).json["Account"]
    assert len(response1["followers"]) - 1 == length == len(response2["followers"])


def test_getListFollow(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    client.post("/follow/" + str(account["id"]))

    response = client.get("/followList/" + str(account["id"]))
    assert len(response.json['ListFollows']) == len(account["followers"]) + 1


def test_getListFollowing(client):
    account = client.post("/account", json=data_accounts[0]).json["account"]
    client.loginAs(data_accounts[0])

    client.post("/follow/" + str(account["id"]))

    response = client.get("/followingList/")
    assert len(response.json['ListFollowing']) != 0

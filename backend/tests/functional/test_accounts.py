from backend.data import data_accounts


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
    assert client.get("/accounts/search/LeX").json["accounts"] == ["Alex", "Blex", "blex", "Clex"]

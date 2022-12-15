from backend.data import data_accounts, data_posts


def test_getNotification(client):
    account_reciver = data_accounts[1]
    account_sender = data_accounts[0]
    client.post("/account", json=account_sender)
    ac_r = client.post("/account", json=account_reciver).json["account"]

    client.loginAs(account_reciver)
    # usuari 1 crea post
    post = client.post("/posts", json=data_posts[0]).json["post"]

    client.loginAs(account_sender)
    # usuari0 comenta el post
    post3 = data_posts[0].copy()
    post3.update({"parent_id": str(post["id"])})
    response = client.post("/posts", json=post3)
    assert response.json["post"]["parent_id"] == post["id"]

    # Afegim like al post
    response = client.post("/likes/" + str(post["id"]))
    assert response.json["Post"]["num_likes"] == 1

    # AFEGIM Follow
    response = client.post("/follow/" + account_reciver["username"]).json["Account"]
    assert len(response["followers"]) == len(ac_r["followers"]) + 1

    response = client.get("/notificationList/")
    assert response.status_code == 404

    client.loginAs(account_reciver)

    notis = client.get("/notificationList/").json["notifications"]

    assert len(notis) == 3

    # Afegim like i comentari per part del mateix usuari
    notis = client.get("/notificationList/").json["notifications"]

    post3 = data_posts[0].copy()
    post3.update({"parent_id": str(post["id"])})
    response = client.post("/posts", json=post3)
    assert response.json["post"]["parent_id"] == post["id"]

    response = client.post("/likes/" + str(post["id"]))
    assert response.json["Post"]["num_likes"] == 2

    assert len(notis) == 3  # no reps  notificacions pròpies


def test_deleteNotification(client):
    account_reciver = data_accounts[1]
    account_sender = data_accounts[0]
    client.post("/account", json=account_sender)
    ac_r = client.post("/account", json=account_reciver).json["account"]

    client.loginAs(account_reciver)
    # usuari 1 crea post
    post = client.post("/posts", json=data_posts[0]).json["post"]

    client.loginAs(account_sender)
    # usuari0 comenta el post
    post3 = data_posts[0].copy()
    post3.update({"parent_id": str(post["id"])})
    response = client.post("/posts", json=post3)
    assert response.json["post"]["parent_id"] == post["id"]

    # Afegim like al post
    response = client.post("/likes/" + str(post["id"]))
    assert response.json["Post"]["num_likes"] == 1

    # AFEGIM Follow
    response = client.post("/follow/" + account_reciver["username"]).json["Account"]
    assert len(response["followers"]) == len(ac_r["followers"]) + 1

    response = client.get("/notificationList/")
    assert response.status_code == 404

    client.loginAs(account_reciver)

    notis = client.get("/notificationList/").json["notifications"]
    assert len(notis) == 3
    # eliminem 1

    response = client.delete("/notification/1")
    notis = client.get("/notificationList/").json["notifications"]
    assert len(notis) == 2 and response.status_code == 200

    # eliminem totes les del usuari
    response = client.delete("/notificationList/")
    assert response.status_code == 200
    deleted_n = client.get("/notificationList/")
    assert deleted_n.json["message"] == "No notifications were found" and deleted_n.status_code == 404

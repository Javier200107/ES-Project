from backend.data import data_accounts, data_posts


def createPosts(client):
    account1, account2 = data_accounts[0], data_accounts[1]
    client.post("/account", json=account1)
    client.post("/account", json=account2)
    client.loginAs(account1)
    post = client.post("/posts", json=data_posts[0]).json["post"]
    client.loginAs(account2)
    post2 = data_posts[2]
    assert client.post("/posts", json=post2).status_code == 201


def test_createComment(client):
    createPosts(client)
    client.loginAs(data_accounts[0])
    numcomments = client.get("/uposts?limit=10&offset=0").json["posts"][0]['num_comments']
    assert numcomments == 1

def test_getComments(client):
    createPosts(client)
    client.loginAs(data_accounts[0])
    comments = client.get("/comments/1?limit=10&offset=0").json["comments"]
    assert len(comments) == 1

def test_deletePostPrincipal_delete_comment(client):
    createPosts(client)
    client.loginAs(data_accounts[0])
    comments = client.get("/comments/1?limit=10&offset=0").json["comments"]
    assert len(comments) == 1
    post3 = data_posts[0].copy()
    post3.update({"parent_id": 2})
    post=data_posts[0]
    client.post("/posts", json=post3)
    comments2 = client.get("/comments/2?limit=10&offset=0").json["comments"]
    assert len(comments2) == 1
    client.delete(f"/posts/1")
    response = client.get("/comments/1?limit=10&offset=0")
    response2 = client.get("/comments/2?limit=10&offset=0")
    assert response2.json["message"] == response.json["message"] == "No comments were found"

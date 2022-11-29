from backend.data import data_accounts
from backend.models.accounts import AccountsModel
from backend.models.posts import PostsModel


def test_posts(client):
    post1 = PostsModel("Post 1")
    post2 = PostsModel("Post 2")

    client.post("/account", json=data_accounts[0])
    username = data_accounts[0]["username"]

    account = AccountsModel.get_by_username(username)
    post1.account = account
    post2.account = account
    post2.parent = post1

    post1.save_to_db()
    post2.save_to_db()

    assert post1.account.username == username
    assert account.posts[0].text == "Post 1"
    assert account.posts[1].text == "Post 2"
    assert post1.comments[0].text == "Post 2"

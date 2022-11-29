from backend.models.accounts import AccountsModel
from backend.models.TextPostModel import TextPostModel


def test_posts(app_with_data):
    post1 = TextPostModel("Post 1")
    post2 = TextPostModel("Post 2")

    account = AccountsModel.get_by_username("fernandito1")
    post1.account = account
    post2.account = account
    post2.parent = post1

    post1.save_to_db()
    post2.save_to_db()

    assert post1.account.username == "fernandito1"
    assert account.textposts[0].text == "Post 1"
    assert post1.comments[0].text == "Post 2"

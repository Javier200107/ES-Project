import pytest


@pytest.fixture()
def app():
    from backend.api.app import app
    from backend.api.db import db
    from backend.api.models.accounts import AccountsModel
    from datetime import datetime

    # do some setup
    with app.app_context():
        db.create_all()
        account = AccountsModel("User1", "email", "name", "surname", datetime.fromisoformat('2022-01-01'), 0)
        account.hash_password("akF3#7cM")
        account.save_to_db()

    yield app

    # do some cleanup
    with app.app_context():
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()

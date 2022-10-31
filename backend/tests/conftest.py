from datetime import datetime

import pytest
from app import app
from backend.db import db
from backend.models.accounts import AccountsModel
from sqlalchemy import delete


@pytest.fixture(scope="session")
def flask_app():
    my_app = app
    my_app.config.update(
        {
            "TESTING": True,
        }
    )
    client = my_app.test_client()
    ctx = my_app.test_request_context()

    ctx.push()

    yield client

    ctx.pop()


@pytest.fixture(scope="session")
def app_with_db(flask_app):
    db.create_all()

    yield flask_app

    db.session.close()
    db.drop_all()


@pytest.fixture
def app_with_data(app_with_db):
    account = AccountsModel(
        nom="Fernand",
        cognom="Alonso",
        email="fernandete@gmail.com",
        username="fernandito1",
        datan=datetime.strptime("1980-12-12", "%Y-%m-%d"),
        is_admin=0,
    )
    account.hash_password("alonsete2042343")
    db.session.add(account)

    db.session.commit()

    yield app_with_db

    db.session.execute(delete(AccountsModel))
    db.session.commit()

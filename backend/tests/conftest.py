import pytest
from app import app as my_app
from backend.db import db
from flask.testing import FlaskClient


class CustomClient(FlaskClient):
    def __init__(self, *args, **kwargs):
        super(CustomClient, self).__init__(*args, **kwargs)
        self.account = {}
        self.accountToken = ""

    def _setAuthHeader(self, kwargs):
        if self.accountToken:
            kwargs.setdefault("headers", {})
            kwargs["headers"].update({"Authorization": f"Bearer {self.accountToken}"})

    def open(self, *args, **kwargs):
        if "method" in kwargs and kwargs["method"] in ("GET", "POST", "PUT", "DELETE"):
            self._setAuthHeader(kwargs)
        return super().open(*args, **kwargs)

    def loginAs(self, account):
        self.account = account.copy()
        login = {
            "username": self.account["username"],
            "password": self.account["password"],
        }

        response = super().post("/login", json=login)
        if response.json and "token" in response.json:
            self.accountToken = response.json["token"]

    def logOut(self):
        self.accountToken = ""


@pytest.fixture()
def flask_app():
    app = my_app
    app.config.update({"TESTING": True})

    if app.config["PRODUCTION"]:
        raise AssertionError(
            "Running the tests using the production PostgresSQL DB on Azure it's not recommended, "
            "because it's slow and the available number of queries is limited."
        )

    # Setup
    with app.app_context():
        db.drop_all()
        db.create_all()

    with app.app_context():
        yield app

    # Cleanup
    with app.app_context():
        db.drop_all()


@pytest.fixture()
def client(flask_app):
    flask_app.test_client_class = CustomClient
    return flask_app.test_client()

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api

from backend.db import db
from backend.resources.accounts import Accounts
from backend.resources.login import Login

app = Flask(__name__)

# De moment es guardarà a local
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "p2r5u8x/A?D(G+KbPeShVmYq3t6v9y$B"

Migrate(app, db)
db.init_app(app)

api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})

api.add_resource(Accounts, "/account/<string:username>", "/account")
api.add_resource(Login, "/login")


@app.route("/")
def index():
    return "Hello World!"


if __name__ == "__main__":
    app.run()

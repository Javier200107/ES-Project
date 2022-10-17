from backend.db import db
from backend.resources.accounts import Accounts
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api


app = Flask(__name__)

# De moment es guardarà a local

app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///data.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)
db.init_app(app)

api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})

api.add_resource(Accounts, "/account/<string:username>", "/account")


@app.route("/")
def hello_world():  # put application's code here
    return "Hello World!"


if __name__ == "__main__":
    app.run()

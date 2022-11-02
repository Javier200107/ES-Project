from backend.db import db
from backend.resources.accounts import Accounts
from backend.resources.posts import Posts, UserPosts
from backend.resources.login import Login
from flask import Flask, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
import psycopg2


app = Flask(
    __name__,
    static_folder="backend/dist/static",
    template_folder="backend/dist/templates",
)

# De moment es guardarà a local
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://Javier@enginyeriadelsoftware-server:EnginyeriaDelSoftware2022@enginyeriadelsoftware-server.postgres.database.azure.com:5432/postgres"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = "p2r5u8x/A?D(G+KbPeShVmYq3t6v9y$B"

Migrate(app, db)
db.init_app(app)

api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})

api.add_resource(Accounts, "/account/<string:username>", "/account")
api.add_resource(Login, "/login")
api.add_resource(Posts, "/posts/<int:id>", "/posts")
api.add_resource(UserPosts, "/uposts/<string:user>", "/uposts")


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run()

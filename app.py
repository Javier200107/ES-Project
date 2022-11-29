from backend.db import db
from backend.resources.accounts import Accounts
from backend.resources.login import Login
from backend.resources.posts import Posts, UserPosts
from backend.resources.like import Like, ListPostLikes, ListUserLikes
from decouple import config as config_decouple
from backend.resources.follow import Follow, ListFollows, ListFollowing
from flask import Flask, render_template
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://Javier@enginyeriadelsoftware-server:"
    "EnginyeriaDelSoftware2022@enginyeriadelsoftware-server."
    "postgres.database.azure.com:5432/postgres"
)
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
api.add_resource(Like, "/likes/<string:account>,<int:post>", "/likes/<int:post>")
api.add_resource(ListPostLikes, "/likePlist/<int:postid>")
api.add_resource(ListUserLikes, "/likeUlist/<int:userid>", "/likeUlist/")

api.add_resource(Follow, "/follow/<string:account1>/<string:account2>","/follow/<string:account1>")
api.add_resource(ListFollows, "/followList/<string:account>","/followList/")
api.add_resource(ListFollowing, "/followingList/<string:account>","/followingList/")


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.run()
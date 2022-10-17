from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api

from backend.api.db import db
from backend.api.resources.login import Login

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "p2r5u8x/A?D(G+KbPeShVmYq3t6v9y$B"

CORS(app, resources={r'/*': {'origins': '*'}})
Migrate(app, db)
db.init_app(app)

with app.app_context():
    db.create_all()

api = Api(app)
api.add_resource(Login, '/api/login')


@app.route('/')
def index():
    return 'Hello World!'


if __name__ == '__main__':
    app.run(port=5000, debug=True)

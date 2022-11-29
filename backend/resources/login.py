from backend.lock import lock
from backend.models.accounts import AccountsModel, auth, g
from flask_restful import Resource, reqparse


class Login(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument(
        "username",
        type=str,
        required=True,
        nullable=False,
        help={"A username is required"},
    )
    parser.add_argument(
        "password",
        type=str,
        required=True,
        nullable=False,
        help={"A password is required"},
    )

    @auth.login_required()
    def get(self):
        return {"message": f"Authorized! ({g.user.username})"}, 200

    def post(self):
        data = self.parser.parse_args()
        username = data["username"]
        password = data["password"]

        account = AccountsModel.get_by_username(username)
        if not account:
            return {
                "message": f"Login failed! No account was found with username: {username}"
            }, 404

        if not account.verify_password(password):
            return {"message": "Invalid password!"}, 404

        with lock.lock:
            token = account.generate_auth_token()
            return {"token": token}, 200

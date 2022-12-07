from datetime import datetime

from backend.lock import lock
from backend.models.accounts import AccountsModel, auth, g
from flask_restful import Resource, reqparse


class Accounts(Resource):
    @auth.login_required()
    def get(self, username):
        account = AccountsModel.get_by_username(username)
        if account:
            return {"account": account.json()}, 200
        return {"message": f"Could not find an account with username [{username}]"}, 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument(
            "username", type=str, required=True, nullable=False, help="nom d'usuari"
        )
        parser.add_argument(
            "password", type=str, required=True, nullable=False, help="contrasenya"
        )
        parser.add_argument(
            "email", type=str, required=True, nullable=False, help="correu electrònic"
        )
        parser.add_argument("nom", type=str, required=True, nullable=False, help="nom")
        parser.add_argument(
            "cognom", type=str, required=True, nullable=False, help="cognom"
        )
        parser.add_argument(
            "birthdate",
            type=str,
            required=True,
            nullable=False,
            help="data de naixement",
        )
        parser.add_argument(
            "is_admin",
            type=int,
            required=False,
            nullable=False,
            default=0,
            help="admin",
        )
        parser.add_argument(
            "description",
            type=str,
            required=False,
            nullable=False,
            default="",
            help="Profile bio"
        )
        data = parser.parse_args()

        with lock.lock:
            if AccountsModel.get_by_username(data["username"]):
                return {"message": "An account with this username already exists!"}, 409
            if AccountsModel.get_by_email(data["email"]):
                return {"message": "An account with this email already exists!"}, 409
            try:
                new_account = AccountsModel(
                    data["username"],
                    data["email"],
                    data["nom"],
                    data["cognom"],
                    datetime.strptime(data["birthdate"], "%Y-%m-%d"),
                    data["is_admin"],
                    data["description"]
                )
                new_account.hash_password(data["password"])
                new_account.save_to_db()
            except Exception:
                return {"message": "An error occurred creating the account."}, 500
            return {"account": new_account.json()}, 201

    @auth.login_required()
    def delete(self, username):
        if username is None:
            return {"message": "No username specified."}, 400
        if username != g.user.username:
            return {"message": "You can't delete someone else's account."}, 403
        account = AccountsModel.get_by_username(username)
        if account is None:
            return {"message": "Could not find an account with that username."}, 404
        try:
            account.delete_from_db()
        except Exception:
            return {"message": "An error occurred deleting the account."}, 500
        return {"message": "Account deleted successfully!"}, 200


class AccountsList(Resource):
    @auth.login_required()
    def get(self, username):
        parser = reqparse.RequestParser()
        parser.add_argument(
            "limit",
            type=int,
            required=False,
            nullable=False,
            default=100,
            location="args",
        )
        parser.add_argument(
            "offset",
            type=int,
            required=False,
            nullable=False,
            default=0,
            location="args",
        )
        data = parser.parse_args()

        accounts = AccountsModel.get_like_username(
            username, data["limit"], data["offset"]
        )
        if accounts:
            return {"accounts": [account.json2() for account in accounts]}, 200
        return {
            "message": f"Could not find any account username matching [{username}]"
        }, 404

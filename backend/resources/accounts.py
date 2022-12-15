from datetime import datetime

from backend.models.accounts import AccountsModel, auth, g
from backend.utils import CustomException, lock
from flask_restful import Resource, reqparse
from werkzeug.datastructures import FileStorage


class Accounts(Resource):
    @auth.login_required()
    def get(self, username=None):
        if not username:
            account = g.user
        else:
            account = AccountsModel.get_by_username(username)
        if account:
            return {"account": account.json()}, 200
        return {"message": f"Could not find an account with username [{username}]"}, 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument("username", type=str, required=True, nullable=False, help="nom d'usuari")
        parser.add_argument("password", type=str, required=True, nullable=False, help="contrasenya")
        parser.add_argument("email", type=str, required=True, nullable=False, help="correu electrònic")
        parser.add_argument("nom", type=str, required=True, nullable=False, help="nom")
        parser.add_argument("cognom", type=str, required=True, nullable=False, help="cognom")
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
            help="Profile bio",
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
                    data["description"],
                )
                new_account.hash_password(data["password"])
                new_account.save_to_db()
            except Exception:
                return {"message": "An error occurred creating the account."}, 500
            return {"account": new_account.json()}, 201

    @auth.login_required()
    def put(self):
        account = g.user
        parser = reqparse.RequestParser()
        parser.add_argument(
            "username",
            type=str,
            required=False,
            nullable=False,
            default=account.username,
        )
        parser.add_argument("password", type=str, required=False, nullable=False, default=None)
        parser.add_argument("email", type=str, required=False, nullable=False, default=account.email)
        parser.add_argument("nom", type=str, required=False, nullable=False, default=account.nom)
        parser.add_argument("cognom", type=str, required=False, nullable=False, default=account.cognom)
        parser.add_argument("birthdate", type=str, required=False, nullable=False, default=None)
        parser.add_argument(
            "is_admin",
            type=int,
            required=False,
            nullable=False,
            default=account.is_admin,
        )
        parser.add_argument(
            "description",
            type=str,
            required=False,
            nullable=False,
            default=account.description,
        )
        data = parser.parse_args()

        with lock.lock:
            try:
                if data["username"] != account.username:
                    if AccountsModel.get_by_username(data["username"]):
                        return {"message": "An account with this username already exists!"}, 409
                    account.username = data["username"]
                if data["password"] is not None:
                    account.hash_password(data["password"])
                if data["email"] != account.email:
                    if AccountsModel.get_by_email(data["email"]):
                        return {"message": "An account with this email already exists!"}, 409
                    account.email = data["email"]
                if data["birthdate"] is not None:
                    account.birth = datetime.strptime(data["birthdate"], "%Y-%m-%d")
                account.nom = data["nom"]
                account.cognom = data["cognom"]
                account.is_admin = data["is_admin"]
                account.description = data["description"]
                account.save_to_db()
            except Exception:
                return {"message": "An error occurred updating the account."}, 500
        return {"account": account.json()}, 200

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
            account.deleteFilesFolder()
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

        accounts = AccountsModel.get_like_username(username, data["limit"], data["offset"])
        if accounts:
            return {"accounts": [account.json2() for account in accounts]}, 200
        return {"message": f"Could not find any account username matching [{username}]"}, 404


class AccountsFiles(Resource):
    allowed_extensions = ["png", "jpg", "jpeg", "gif"]

    @classmethod
    def get_allowed_extension(cls, filename):
        ext = filename.rsplit(".", 1)[1].lower() if "." in filename else ""
        if ext in cls.allowed_extensions:
            return ext
        raise CustomException("Invalid file extension.")

    def save_file(self, account, file):
        extension = self.get_allowed_extension(file.filename)
        unique_file_path = account.getUniqueFilePath(extension)
        file.save(unique_file_path)
        return unique_file_path

    def update_account_file(self, account, file, account_file):
        f = self.save_file(account, file)
        account.deleteFile(getattr(account, account_file))
        setattr(account, account_file, f)
        account.save_to_db()

    @auth.login_required()
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument("avatar", type=FileStorage, location="files", required=False, default=None)
        parser.add_argument("banner", type=FileStorage, location="files", required=False, default=None)
        data = parser.parse_args()

        account = g.user
        avatar = data["avatar"]
        banner = data["banner"]

        with lock.lock:
            try:
                if avatar and avatar.filename:
                    self.update_account_file(account, avatar, "avatar")
                if banner and banner.filename:
                    self.update_account_file(account, banner, "banner")
            except CustomException as e:
                return {"message": str(e)}, 400
            except Exception:
                return {"message": "Failed to update the account."}, 500

        return {"account": account.json2()}, 200

    @auth.login_required()
    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument(
            "avatar",
            type=int,
            required=False,
            nullable=False,
            default=0,
            location="args",
        )
        parser.add_argument(
            "banner",
            type=int,
            required=False,
            nullable=False,
            default=0,
            location="args",
        )
        data = parser.parse_args()
        account = g.user

        with lock.lock:
            try:
                if data["avatar"]:
                    account.deleteFile(account.avatar)
                    account.avatar = ""
                if data["banner"]:
                    account.deleteFile(account.banner)
                    account.banner = ""
                account.save_to_db()
            except Exception:
                return {"message": "Failed to update the account."}, 500

        return {"account": account.json2()}, 200

from datetime import datetime

from flask_restful import Resource, reqparse
from models.accounts import AccountsModel
from lock import lock


class Accounts(Resource):

    def get(self, username):
        account = AccountsModel.get_by_username(username)
        return {'account': account.json()}, 200 if account else 404

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username', type=str, required=True, help="nom d'usuari")
        parser.add_argument('password', type=str, required=True, help="contrasenya")
        parser.add_argument('email', type=str, required=True, help="correu electrònic")
        parser.add_argument('nom', type=str, required=True, help="nom")
        parser.add_argument('cognom', type=str, help="cognom")
        parser.add_argument('birthdate', type=str, required=True, help="data de naixement")
        parser.add_argument('is_admin', type=int, help="admin")
        data = parser.parse_args()
        print(data['nom'])
        with lock.lock:
            if data['cognom'] is None and data['is_admin'] is None:
                new_account = AccountsModel(data['username'], data['email'], data['nom'],
                                            datetime.strptime(data["birthdate"], "%Y-%m-%d"))
            elif data['cognom'] is None:
                new_account = AccountsModel(data['username'], data['email'], data['nom'],
                                            datetime.strptime(data["birthdate"], "%Y-%m-%d"), None, data['is_admin'])
            elif data['is_admin'] is None:
                new_account = AccountsModel(data['username'], data['email'], data['nom'],
                                            datetime.strptime(data["birthdate"], "%Y-%m-%d"), data['cognom'], None)
            else:
                new_account = AccountsModel(data['username'], data['email'], data['nom'],
                                            datetime.strptime(data["birthdate"], "%Y-%m-%d"), data['cognom'],
                                            data['is_admin'])
            new_account.hash_password(data['password'])
            try:
                new_account.save_to_db()
            except Exception as e:
                print(e)
                return {"message": "An error occurred inserting the account."}, 500
            return {'account': new_account.json()}, 201 if new_account else 400

    def delete(self, username):
        if username is None:
            return {"message": "No username specified."}, 400
        account = AccountsModel.get_by_username(username)
        if account is None:
            return {'Error': "No accounts contains that username"}, 404
        try:
            account.delete_from_bd()
        except Exception as e:
            print(e)
            return {"message": "An error occurred deleting the account."}, 500
        return {'Error': "No account contains that username"}, 404

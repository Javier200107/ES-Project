import time

from backend.db import db
from flask import current_app, g
from flask_httpauth import HTTPBasicAuth
from jwt import ExpiredSignatureError, InvalidSignatureError, decode, encode
from passlib.apps import custom_app_context as pwd_context

auth = HTTPBasicAuth(scheme="Bearer")


class AccountsModel(db.Model):
    __tablename__ = "accounts"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    email = db.Column(db.String(30), unique=True, nullable=False)
    nom = db.Column(db.String(30), nullable=False)
    cognom = db.Column(db.String(30), nullable=False)
    birth = db.Column(db.DateTime, nullable=False)
    password = db.Column(db.String(), nullable=False)
    is_admin = db.Column(db.Integer, nullable=False)

    textposts = db.relationship("TextPostModel", back_populates="account")

    def __init__(self, username, email, nom, datan, cognom, is_admin=0):
        self.username = username
        self.email = email
        self.nom = nom
        self.cognom = cognom
        self.birth = datan
        self.is_admin = is_admin

    def json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "nom": self.nom,
            "cognom": self.cognom,
            "birth": self.birth.isoformat(),
            "is_admin": self.is_admin,
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_by_username(cls, username):
        return AccountsModel.query.filter_by(username=username).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    def hash_password(self, password):
        self.password = pwd_context.hash(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password)

    def generate_auth_token(self, expiration=600):
        return encode(
            {"username": self.username, "exp": int(time.time()) + expiration},
            current_app.secret_key,
            algorithm="HS256",
        )

    @classmethod
    def verify_auth_token(cls, token):
        try:
            data = decode(token, current_app.secret_key, algorithms=["HS256"])
        except ExpiredSignatureError:
            return None  # expired token
        except InvalidSignatureError:
            return None  # invalid token
        except Exception:
            return None  # bad token (e.g. DecodeError)

        user = cls.query.filter_by(username=data["username"]).first()
        return user


@auth.verify_password
def verify_password(token, password):
    account = AccountsModel.verify_auth_token(token)
    if account is not None:
        g.user = account
    else:
        g.user = None
    return account


@auth.get_user_roles
def get_user_roles(user):
    roles = ["user"]
    if user.is_admin:
        roles.append("admin")
    return roles

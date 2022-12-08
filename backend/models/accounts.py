import time

from backend.db import db
from backend.models.posts import PostsModel
from flask import current_app, g
from flask_httpauth import HTTPTokenAuth
from jwt import ExpiredSignatureError, InvalidSignatureError, decode, encode
from passlib.apps import custom_app_context as pwd_context
from sqlalchemy import func
from sqlalchemy.orm import aliased, object_session

auth = HTTPTokenAuth(scheme="Bearer")

user_following = db.Table(
    "user_following",
    db.Column("user_id", db.Integer, db.ForeignKey("accounts.id"), primary_key=True),
    db.Column(
        "following_id", db.Integer, db.ForeignKey("accounts.id"), primary_key=True
    ),
)


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

    posts = db.relationship("PostsModel", back_populates="account", cascade="all, delete-orphan")

    following = db.relationship(
        "AccountsModel",
        lambda: user_following,
        primaryjoin=lambda: AccountsModel.id == user_following.c.user_id,
        secondaryjoin=lambda: AccountsModel.id == user_following.c.following_id,
        backref="followers",
    )

    def __init__(self, username, email, nom, cognom, birth, is_admin=0):
        self.username = username
        self.email = email
        self.nom = nom
        self.cognom = cognom
        self.birth = birth
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
            "followers": [t.username for t in self.followers],
            "following": [t.username for t in self.following],
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def rollback(self):
        db.session.rollback(self)
        db.session.commit()

    def followed_posts_and_self(self, number, off):
        user_id = self.id
        Poster = aliased(AccountsModel, name="poster")
        return (
            (
                object_session(self)
                .query(PostsModel).filter_by(archived=0)
                .join(Poster, AccountsModel.query.filter_by(id=PostsModel.account_id))
                .filter(Poster.followers.any(AccountsModel.id == user_id))
            )
            .union(PostsModel.query.filter_by(account_id=user_id,archived=0,parent_id=None))
            .order_by(PostsModel.time.desc())
            .limit(number)
            .offset(off)
        )

    @classmethod
    def get_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def get_like_username(cls, username, number, off):
        q = cls.query.filter(cls.username.like(f"%{username}%"))
        return q.order_by(func.lower(cls.username)).limit(number).offset(off).all()

    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

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


@auth.verify_token
def verify_token(token):
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

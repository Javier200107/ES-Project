import os
import shutil
import time
import uuid
from pathlib import Path

from azure.storage.blob import BlobServiceClient
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
    db.Column("following_id", db.Integer, db.ForeignKey("accounts.id"), primary_key=True),
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
    description = db.Column(db.String(200), nullable=False)
    avatar = db.Column(db.String(), nullable=False, default="")
    banner = db.Column(db.String(), nullable=False, default="")

    posts = db.relationship("PostsModel", back_populates="account", cascade="all, delete-orphan")
    notifications = db.relationship(
        "NotificationsModel",
        cascade="all, delete-orphan",
        foreign_keys="NotificationsModel.account_id",
    )

    following = db.relationship(
        "AccountsModel",
        lambda: user_following,
        primaryjoin=lambda: AccountsModel.id == user_following.c.user_id,
        secondaryjoin=lambda: AccountsModel.id == user_following.c.following_id,
        backref="followers",
    )

    def __init__(self, username, email, nom, cognom, birth, is_admin, description):
        self.username = username
        self.email = email
        self.nom = nom
        self.cognom = cognom
        self.birth = birth
        self.is_admin = is_admin
        self.description = description

    def json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "nom": self.nom,
            "cognom": self.cognom,
            "birthdate": self.birth.isoformat().split("T")[0],
            "is_admin": self.is_admin,
            "description": self.description,
            "avatar": self.avatar,
            "banner": self.banner,
            "followers": [t.username for t in self.followers],
            "following": [t.username for t in self.following],
            "Num_notificacions": len(self.notifications),
        }

    def json2(self):
        return {"username": self.username, "avatar": self.avatar, "banner": self.banner}

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def rollback(self):
        db.session.rollback(self)
        db.session.commit()

    def getFilesFolder(self):
        account_folder = current_app.config["STATIC_FOLDER"] + f"/api/accounts/{self.id}"
        os.makedirs(account_folder, exist_ok=True)
        return account_folder

    def getUniqueFilePath(self, extension):
        return self.getFilesFolder() + f"/{uuid.uuid4()}.{extension}"

    def deleteFilesFolder(self):
        shutil.rmtree(self.getFilesFolder(), ignore_errors=True)
        AzureBlobStorage.deleteFiles(self.id)

    def deleteFile(self, file):
        if file and self.getFilesFolder() in file:
            Path(file).unlink(missing_ok=True)
            AzureBlobStorage.deleteFile(self.id, file)

    def saveFileToStorage(self, file):
        if file and self.getFilesFolder() in file and Path(file).exists():
            AzureBlobStorage.uploadFile(self.id, file)

    def loadFileFromStorage(self, file):
        if file and self.getFilesFolder() in file and not Path(file).exists():
            AzureBlobStorage.downloadFile(self.id, file)

    def followed_posts_and_self(self, number, off):
        user_id = self.id
        Poster = aliased(AccountsModel, name="poster")
        return (
            (
                object_session(self)
                .query(PostsModel)
                .filter_by(archived=0)
                .join(Poster, AccountsModel.query.filter_by(id=PostsModel.account_id))
                .filter(Poster.followers.any(AccountsModel.id == user_id))
            )
            .union(PostsModel.query.filter_by(account_id=user_id, archived=0, parent_id=None))
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

    def generate_auth_token(self, expiration=6000):
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


class AzureBlobStorage(object):
    @staticmethod
    def _get_bsc():
        try:
            connect_str = current_app.config["AZURE_STORAGE_CONNECTION_STRING"]
            return BlobServiceClient.from_connection_string(connect_str)
        except Exception:
            pass

    @staticmethod
    def _createContainer(bsc, name):
        try:
            bsc.create_container(name)
        except Exception:
            pass

    @classmethod
    def uploadFile(cls, account_id, filePath):
        try:
            blob_service_client = cls._get_bsc()
            container_name = f"account-{account_id}"
            cls._createContainer(blob_service_client, container_name)
            blob_client = blob_service_client.get_blob_client(container=container_name, blob=filePath.split("/")[-1])
            with open(file=filePath, mode="rb") as data:
                blob_client.upload_blob(data)
            blob_service_client.close()
        except Exception:
            pass

    @classmethod
    def downloadFile(cls, account_id, filePath):
        try:
            blob_service_client = cls._get_bsc()
            container_client = blob_service_client.get_container_client(container=f"account-{account_id}")
            with open(file=filePath, mode="wb") as file:
                file.write(container_client.download_blob(filePath.split("/")[-1]).readall())
            blob_service_client.close()
        except Exception:
            pass

    @classmethod
    def deleteFile(cls, account_id, filePath):
        try:
            blob_service_client = cls._get_bsc()
            container_client = blob_service_client.get_container_client(container=f"account-{account_id}")
            container_client.delete_blob(filePath.split("/")[-1])
            blob_service_client.close()
        except Exception:
            pass

    @classmethod
    def deleteFiles(cls, account_id):
        try:
            blob_service_client = cls._get_bsc()
            container_client = blob_service_client.get_container_client(container=f"account-{account_id}")
            container_client.delete_container()
            blob_service_client.close()
        except Exception:
            pass

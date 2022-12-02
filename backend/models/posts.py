from datetime import datetime

from backend.db import db

taula_likes = db.Table(
    "taula_likes",
    db.Column("id", db.Integer, primary_key=True),
    db.Column("post_id", db.Integer, db.ForeignKey("posts.id")),
    db.Column("account_id", db.Integer, db.ForeignKey("accounts.id")),
)


class PostsModel(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(280), unique=False, nullable=False)
    time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    archived = db.Column(db.Integer, nullable=False, default=0)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("posts.id"))
    community = db.Column(db.Integer, nullable=False, default=0)

    # usuari que publica el post
    account = db.relationship(
        "AccountsModel", foreign_keys=[account_id], back_populates="posts"
    )
    # llista de comentaris
    parent = db.relationship(
        "PostsModel", remote_side=[id], backref=db.backref("comments")
    )

    accounts_like = db.relationship(
        "AccountsModel", secondary=taula_likes, backref=db.backref("posts_like")
    )

    def __init__(self, text):
        self.text = text

    def json(self):
        return {
            "id": self.id,
            "text": self.text,
            "time": self.time.isoformat(),
            "archived": self.archived,
            "account_id": self.account_id,
            "account_name": self.account.username,
            "parent_id": self.parent_id,
            "accounts_like": [t.json() for t in self.accounts_like],
            "num_likes": len(self.accounts_like),
            "community": self.community
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

    @classmethod
    def get_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_groups(cls, number, off):
        return cls.query.filter_by(archived=0,community=0).order_by(cls.time.desc()).limit(number).offset(off).all()
    @classmethod
    def get_groups_by_account(cls, account_id, number, off, archived):
        if archived is None:
            q = cls.query.filter_by(account_id=account_id)
        else:
            q = cls.query.filter_by(account_id=account_id, archived=archived)
        return q.order_by(cls.time.desc()).limit(number).offset(off).all()

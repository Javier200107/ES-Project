from datetime import datetime

from backend.db import db


class NotificationsModel(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Integer, unique=False, nullable=False)
    time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)
    account_id2 = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)

    account2 = db.relationship("AccountsModel", foreign_keys=[account_id2])

    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=True)

    post = db.relationship("PostsModel")

    def __init__(self, type):
        self.type = type

    def json(self):
        return {
            "id": self.id,
            "type": self.type,
            "time": self.time.isoformat(),
            "account_id": self.account_id,
            "account_id2": self.account_id2,
            "account2": self.account2.username,
            "post": self.post.json() if self.post else None,
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
    def get_groups(cls, number, off, id):
        return (
            cls.query.filter_by(account_id=id)
            .order_by(cls.time.desc())
            .limit(number)
            .offset(off)
            .all()
        )

    @classmethod
    def delete_by_acc_id(cls, id):
        db.session.query(cls).filter_by(account_id=id).delete()

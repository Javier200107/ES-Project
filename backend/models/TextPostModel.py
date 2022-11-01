from datetime import datetime

from backend.db import db


class TextPostModel(db.Model):
    __tablename__ = "textpost"

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(280), primary_key=False, unique=False, nullable=False)
    time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    archived = db.Column(db.Boolean, nullable=False, default=False)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("textpost.id"))
    # TODO: m'agrada, ubicacio

    account = db.relationship(
        "AccountsModel", foreign_keys=[account_id], back_populates="textposts"
    )
    parent = db.relationship(
        "TextPostModel", remote_side=[id], backref=db.backref('comments')
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
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_by_id(cls, id):
        return TextPostModel.query.filter_by(id=id).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()

    @classmethod
    def get_groups(cls, number, off):
        return TextPostModel.query.order_by(cls.time).limit(number).offset(off)

    @classmethod
    def get_groups_by_account(cls, account_id, number, off):
        return (
            TextPostModel.query.filter_by(account_id=account_id)
            .order_by(cls.time)
            .limit(number)
            .offset(off)
        )

import datetime

from backend.db import db

class TextPostModel(db.Model):
    __tablename__ = "textpost_table"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(280), primary_key=False, unique=False, nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)
    account = db.relationship("AccountsModel", foreign_keys=[account_id], back_populates="textpost")
    time = db.Column(db.DateTime, nullable=False, default = datetime.datetime.utcnow())
    archived = db.Column(db.Boolean,nullable=False,default = False)
    parent_id = db.Column(db.Integer, foreign_keys="textpost_table.id")
    comments = db.relationship("TextPostModel",lazy="joined", join_depth=2)
    # m'agrada
    # ubicacio


    def __init__(self, text):
        self.text = text

    def json(self):
        formatted_datetime = self.date.isoformat()
        return {'id': self.id, 'name': self.text,'account_id': self.account_id,'account': self.account.username,'time': formatted_datetime}

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def rollback(self):
        db.session.rollback()


    @classmethod
    def get_by_id(self, id):
        return TextPostModel.query.filter_by(id = id).first()

    @classmethod
    def get_all(cls):
        return cls.query.all()
    @classmethod
    def get_groups(self,number,off):
        return TextPostModel.query.order_by(self.time).limit(number).offset(off)

    @classmethod
    def get_groups_by_account(self,number,off,id):
        return TextPostModel.query.where(id = id).order_by(self.time).limit(number).offset(off)
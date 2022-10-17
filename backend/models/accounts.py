from backend.db import db
from passlib.apps import custom_app_context as pwd_context


class AccountsModel(db.Model):
    __tablename__ = 'accounts'
    username = db.Column(db.String(30), primary_key=True, unique=True, nullable=False)
    email = db.Column(db.String(30), primary_key=True, unique=True, nullable=False)
    nom = db.Column(db.String(30), nullable=False)
    cognom = db.Column(db.String(30), nullable=False)
    birth = db.Column(db.DateTime, nullable=False)
    password = db.Column(db.String(), nullable=False)
    # 0 not admin/ 1 is admin
    is_admin = db.Column(db.Integer, nullable=False)


    def __init__(self, username, email, nom, datan, cognom="", is_admin=0):
        self.username = username
        self.email = email
        self.nom = nom
        self.cognom = cognom
        self.birth = datan
        self.is_admin = is_admin

    def json(self):
        return {'username': self.username, 'email': self.email, 'nom': self.nom, 'cognom': self.cognom,
                'birth': self.birth.isoformat(), 'is_admin': self.is_admin, }
      

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    @classmethod
    def get_by_username(self, username):
        return AccountsModel.query.filter_by(username=username).first()

    @classmethod
    def get_list(self):
        return [account.json() for account in AccountsModel.query.all()]

    def hash_password(self, password):
        self.password = pwd_context.hash(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password)


from api import db
from datetime import datetime

class Utilizatori(db.Model):
    __tablename__ = 'utilizatori'
    id = db.Column(db.String(36), primary_key = True)
    nume = db.Column(db.String(50), nullable = False,)
    prenume = db.Column(db.String(100), nullable = False,)
    email = db.Column(db.String(100), nullable = False, unique = True)
    parola = db.Column(db.String(100), nullable = False,)
    adresa_domiciliu = db.Column(db.String(100), nullable = False,)
    telefon = db.Column(db.String(10), nullable = False,)
    admin = db.Column(db.Boolean, default = False, nullable = False)

    #relatia one-to-one to tabela cos
    cos = db.relationship('Cos', backref='utilizatori', uselist=False, lazy=True)
    comenzi_personalizate = db.relationship('ComenziPersonalizate', backref='utilizatori', uselist=False, lazy=True)

    def __repr__(self):
        return f"Utilizatori('{self.nume}', '{self.prenume}', '{self.email}', '{self.parola}', '{self.adresa_domiciliu}', '{self.telefon}', '{self.admin}')"

    def to_dict(self):
        vars(self)

    def is_active(self):
        return True
    
    def get_id(self):
        return str(self.id)

class Produse(db.Model):
    __tablename__ = 'produse'
    id = db.Column(db.String(36), primary_key = True)
    nume = db.Column(db.String(50), nullable = False)
    categorie = db.Column(db.String(50), nullable = False)
    pret = db.Column(db.Float(precision = 2), nullable = False)
    descriere = db.Column(db.String(50), nullable = False)
    imagine = db.Column(db.String(50), nullable = False, unique=True) #imaginea sa fie unica
    data_lansare = db.Column(db.DateTime, default=datetime.utcnow)
    stoc = db.Column(db.Boolean, default = True, nullable = False)
    detalii_cos = db.relationship('DetaliiCos', backref = 'produse', uselist = True)

    def __repr__(self):
        return f"Produse('{self.id}', {self.nume}', '{self.categorie}', '{self.pret}', '{self.descriere}', '{self.imagine}', '{self.data_lansare}', {self.stoc}')"

class Cos(db.Model):
    __tablename__ = 'cos'
    id = db.Column(db.String(36), primary_key = True)
    data_creare = db.Column(db.DateTime, default=datetime.utcnow)
    activ = db.Column(db.Boolean, default = True, nullable = False)

    #Cheia straina cate tabela Utilizatori
    id_utilizator = db.Column(db.String(36), db.ForeignKey('utilizatori.id'), nullable = False)
    #Relatie cu DetaliiCos 
    detalii_cos = db.relationship('DetaliiCos', backref = 'cos', uselist = True)
    comenzi  = db.relationship('Comenzi', backref = 'cos', uselist = True)

    def __repr__(self):
        return f"Cos('{self.data_creare}', '{self.id_utilizator}')"

class DetaliiCos(db.Model):
    __tablename__ = 'detalii_cos'
    id = db.Column(db.String(36), primary_key = True)
    #cheie straina cos 
    id_cos = db.Column(db.String(36), db.ForeignKey('cos.id'), nullable = False)
    #cheie straina produse 
    id_produs = db.Column(db.String(36), db.ForeignKey('produse.id'), nullable = False)

    def __repr__(self):
        return f"DetaliiCos('{self.id_cos}', '{self.id_produs}')"
    
class Comenzi(db.Model):
    __tablename__ = 'comenzi'
    id = db.Column(db.String(36), primary_key = True)
    id_cos = db.Column(db.String(36), db.ForeignKey('cos.id'), nullable = False)
    total = db.Column(db.Float(precision = 2), nullable = False)

class ComenziPersonalizate(db.Model):
    __tablename__ = 'comenzi_personalizate'
    id = db.Column(db.String(36), primary_key = True)
    id_utilizator = db.Column(db.String(36), db.ForeignKey('utilizatori.id'), nullable = False)
    articol = db.Column(db.String(50), nullable=False)
    culoare = db.Column(db.String(20), nullable=False)
    descriere = db.Column(db.String(100), nullable=False)
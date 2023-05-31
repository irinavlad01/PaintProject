from api import db
from datetime import datetime

class Utilizatori(db.Model):
    __tablename__ = 'utilizatori'
    id = db.Column(db.String(36), primary_key = True)
    nume = db.Column(db.String(50), nullable = False,)
    prenume = db.Column(db.String(50), nullable = False,)
    email = db.Column(db.String(60), nullable = False, unique = True)
    parola = db.Column(db.String(100), nullable = False,)
    adresa_domiciliu = db.Column(db.String(100), nullable = False,)
    telefon = db.Column(db.String(10), nullable = False,)
    admin = db.Column(db.Boolean, default = False, nullable = False)

    #relatia one-to-one to tabela cos
    cos = db.relationship('Cos', backref='utilizatori', uselist=False, lazy=True)
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
    id = db.Column(db.Integer, primary_key = True)
    nume = db.Column(db.String(50), nullable = False)
    categorie = db.Column(db.String(50), nullable = False)
    pret = db.Column(db.Float(precision = 2), nullable = False)
    descriere = db.Column(db.String(150), nullable = False)
    data_lansare = db.Column(db.DateTime, default=datetime.utcnow)
    detalii_cos = db.relationship('DetaliiCos', backref = 'produs', uselist = True)
    imagini = db.relationship('Imagini', backref = 'produs', uselist = True)
    stocuri = db.relationship('Stocuri', backref='produs', uselist=True)

    def __repr__(self):
        return f"Produse('{self.id}', {self.nume}', '{self.categorie}', '{self.pret}', '{self.descriere}', '{self.data_lansare}')"

class Imagini(db.Model):
    __tablename__ = 'imagini'
    id = db.Column(db.Integer, primary_key = True)
    id_produs = db.Column(db.Integer, db.ForeignKey('produse.id'), nullable = False)
    nume = db.Column(db.String(50), nullable = False)

    def __repr__(self):
        return f"Imagini('{self.id}', '{self.nume}', '{self.id_produs}')"

class Stocuri(db.Model):
    __tablename__ = 'stocuri'
    id = db.Column(db.Integer, primary_key = True)
    id_produs = db.Column(db.Integer, db.ForeignKey('produse.id'), nullable = False)
    marime = db.Column(db.String(2), nullable=False)
    culoare = db.Column(db.String(20), nullable=False)
    stoc = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Stocuri('{self.id}', '{self.id_produs}', '{self.marime}', '{self.culoare}', '{self.stoc}')"

class Cos(db.Model):
    __tablename__ = 'cos'
    id = db.Column(db.Integer, primary_key = True)
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
    id = db.Column(db.Integer, primary_key = True)
    #cheie straina cos 
    id_cos = db.Column(db.Integer, db.ForeignKey('cos.id'), nullable = False)
    #cheie straina produse 
    id_produs = db.Column(db.Integer, db.ForeignKey('produse.id'), nullable = False)
    descriere = db.Column(db.String(200), nullable=False)
    marime = db.Column(db.String(2), nullable=False)
    culoare = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"DetaliiCos('{self.id}', '{self.id_cos}', '{self.id_produs}', '{self.marime}', '{self.culoare}')"
    
class Comenzi(db.Model):
    __tablename__ = 'comenzi'
    id = db.Column(db.Integer, primary_key = True)
    id_cos = db.Column(db.Integer, db.ForeignKey('cos.id'), nullable = False)
    total = db.Column(db.Float(precision = 2), nullable = False)

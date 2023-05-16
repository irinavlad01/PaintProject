from api import app, db
from flask import request, jsonify, make_response
from api.models import Utilizatori, Produse, Cos, DetaliiCos, Comenzi, ComenziPersonalizate
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
import datetime
from functools import wraps 
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        #args = positional argument; kwargs = keyword arguments 
        token = None 

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        
        if not token:
            return jsonify({'message' : 'Token lipsa din header!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms = ['HS256'])
            current_user = Utilizatori.query.filter_by(id=data['id']).first()
        except:
            return make_response(jsonify({'message' : "Token expirat sau nu sunteti autentificat!"}), 401)
    
        return f(current_user, *args, **kwargs)
    
    return decorated


#Endpoints utilizatori
@app.route('/users', methods = ['GET'])
@token_required
def get_all_users(current_user):

    if not current_user.admin:
        return jsonify({'message' : 'Must be an admin to perform that function'})
    
    users = Utilizatori.query.all()

    output = []

    for user in users:
        user_data = {} #creaza un dictionar python. Cheie si valori
        user_data['id'] = user.id
        user_data['nume'] = user.nume
        user_data['prenume'] = user.prenume
        user_data['email'] = user.email
        user_data['parola'] = user.parola
        user_data['adresa_domiciliu'] = user.adresa_domiciliu
        user_data['telefon'] = user.telefon
        output.append(user_data)

    return jsonify({'users' : output})

@app.route('/users/<id_utilizator>', methods = ['GET'])
@token_required
def one_user(current_user, id_utilizator):

    if not current_user.admin:
        return jsonify({'message' : 'Must be an admin to perform that function'})
    
    user = Utilizatori.query.get(id_utilizator)
    if not user:
        return jsonify({'message' : 'User does not exist'})
    
    user_data = {}
    user_data['id'] = user.id
    user_data['nume'] = user.nume
    user_data['prenume'] = user.prenume
    user_data['email'] = user.email
    user_data['parola'] = user.parola
    user_data['adresa_domiciliu'] = user.adresa_domiciliu
    user_data['telefon'] = user.telefon

    return jsonify({'user' : user_data})

@app.route('/logged_user', methods=['GET'])
@token_required
def get_logged_user(current_user):
    user_data = {}
    user_data['id'] = current_user.id
    user_data['nume'] = current_user.nume
    user_data['prenume'] = current_user.prenume
    user_data['email'] = current_user.email
    user_data['parola'] = current_user.parola
    user_data['adresa_domiciliu'] = current_user.adresa_domiciliu
    user_data['telefon'] = current_user.telefon

    return jsonify({'user' : user_data})

@app.route('/users/add', methods = ['POST'])
@token_required
def create_user(current_user):
    if not current_user.admin:
       return jsonify({'message' : 'Must be an admin to perform that function'})
    
    data = request.get_json()

    hashed_pwd = generate_password_hash(data['parola'], method="sha256")

    utilizator =  Utilizatori(id = str(uuid.uuid4()), nume = data['nume'], prenume = data['prenume'], email = data['email'],
                              parola = hashed_pwd, adresa_domiciliu = data['adresa_domiciliu'], telefon = data['telefon'])
    db.session.add(utilizator)
    db.session.commit()

    return jsonify({'mesaj' : 'Utilizator adaugat cu succes!'})


@app.route('/users/<id_utilizator>', methods = ['PUT'])
@token_required
def promote_user(current_user, id_utilizator):
    if not current_user.admin:
        return jsonify({'message' : 'Must be an admin to perform that function'})

    user = Utilizatori.query.get(id_utilizator)
    if not user:
        return jsonify({'message' : 'User does not exist'})
    
    user.admin = True
    db.session.commit()

    return jsonify({'message' : 'The user has been promoted!'})


@app.route('/users/<id_utilizator>', methods = ['DELETE'])
@token_required
def delete_user(current_user, id_utilizator):
    if not current_user.admin:
        return jsonify({'message' : 'Must be an admin to perform that function'})
    
    user = Utilizatori.query.get(id_utilizator)
    if not user:
        return jsonify({'message' : 'User does not exist'})
    
    Cos.query.filter_by(id_utilizator=id_utilizator).delete()
    
    db.session.delete(user)
    db.session.commit()

    return jsonify({'message' : 'This user has been deleted!'})

@app.route('/login', methods=['GET'])
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('Could not verify. No data provided.', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
        #cand nu primim date de autentificare
    user = Utilizatori.query.filter_by(email = auth.username).first()

    if not user:
        return make_response('Could not verify. User does not exist.', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
        #cand nu exista un anumit user
    if check_password_hash(user.parola, auth.password):
        token = jwt.encode({'id' : user.id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes = 15)}, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({'token' : token})
    else: 
        return make_response('Could not verify. Password incorrect.', 401, {'WWW-Authenticate' : 'Basic realm="Login required!"'})
   #cand parola este incorecta 


#Endpoints cos de cumparaturi (pentru admin)

#Creaza un cos pentru utilizator
@app.route('/cart', methods=['POST'])
@token_required
def create_cart(current_user):
    cos = Cos.query.filter_by(id_utilizator = current_user.id, activ=True).first()
    if not cos: 
        cos_nou = Cos(id_utilizator = current_user.id)
    else: 
        return jsonify({'message' : f'Utilizatorul are deja un cos activ. Inactivati acel cos pentru a adauga unul nou, sau folositi cosul {cos.id}'})

    db.session.add(cos_nou)
    db.session.commit()

    return jsonify({'message' : 'Cart created'})

#Returneaza datele unui cos al utilizatorului curent
@app.route('/cart', methods=['GET'])
@token_required
def all_carts(current_user):

    carts = Cos.query.filter_by(id_utilizator = current_user.id).all()

    output = []
    
    for cart in carts: 
        cart_data = {} #creaza un dictionar python. Cheie si valori
        cart_data['id'] = cart.id
        cart_data['data_creare'] = cart.data_creare
        cart_data['id_utilizator'] = cart.id_utilizator
        cart_data['activ'] = cart.activ
        output.append(cart_data)

    return jsonify({'cart' : output})

#Returneaza id-ul cosului activ
@app.route('/cart/activ', methods=['GET'])
@token_required
def active_cart(current_user):

    cos = Cos.query.filter_by(id_utilizator=current_user.id, activ=True).first()
    return jsonify({'Cos activ' : cos.id})

#Stergerea unui cos al utilizatorului pe baza id-ului cosului
@app.route('/cart/<id_cos>', methods=['DELETE'])
@token_required
def delete_cart(current_user, id_cos):
    
    cos = Cos.query.filter_by(id=id_cos, id_utilizator = current_user.id).first()

    if not cos:
        return jsonify({'message' : 'Utilizatorul nu are un cos de cumparaturi sau cosul specificat.'})
    
    Comenzi.query.filter_by(id_cos = cos.id).delete()
    DetaliiCos.query.filter_by(id_cos = cos.id).delete()
    
    db.session.delete(cos)
    db.session.commit()

    return jsonify({'message' : 'Cos sters'})

#Modifica starea cosului din activ in inactiv
@app.route('/cart/update', methods = ['PUT'])
@token_required
def update_cart(current_user):

    cos = Cos.query.filter_by(id_utilizator = current_user.id, activ=True).first()
    if not cos:
        return jsonify({'message' : f'Utilizatorul {current_user.prenume} nu are un cos activ.'})
    
    cos.activ = False
    db.session.commit()

    return jsonify({'message' : f'Cosul utilizatorului {current_user.prenume} a devenit inactiv.'})

#-->ENDPOINTS PRODUSE
#get_all_products() si get_one_product() nu au nevoie de log in pentru a returna date
@app.route('/products', methods=['GET'])
def get_all_products():

    produse = Produse.query.all()

    output = []

    for produs in produse:
        produs_data = {}
        produs_data['id'] = produs.id
        produs_data['nume'] = produs.nume
        produs_data['categorie'] = produs.categorie
        produs_data['pret'] = produs.pret 
        produs_data['descriere'] = produs.descriere
        produs_data['imagine'] = produs.imagine
        produs_data['stoc'] = produs.stoc
        produs_data['data_lansare'] = produs.data_lansare
        output.append(produs_data)

    return jsonify({'produse' : output})
    

@app.route('/products/<id_prod>', methods=['GET'])
def get_one_product(id_prod):

    product = Produse.query.get(id_prod)
    if not product:
        return jsonify({'message' : 'Product does not exist'})
    

    product_data = {}
    product_data['id'] = product.id
    product_data['nume'] = product.nume
    product_data['categorie'] = product.categorie
    product_data['pret'] = product.pret 
    product_data['descriere'] = product.descriere
    product_data['imagine'] = product.imagine
    product_data['stoc'] = product.stoc
    product_data['data_lansare'] = product.data_lansare

    return jsonify({'produs' : product_data})


@app.route('/products/create', methods=['POST'])
@token_required
def create_products(current_user):
    if not current_user.admin:
        return jsonify({'message' : 'Acces restrictionat! Nu puteti crea produse daca nu sunteti administrator'})
    
    data = request.get_json()
    product = Produse(nume = data['nume'], categorie = data['categorie'], pret = data['pret'], descriere = data['descriere'], imagine = data['imagine'])

    db.session.add(product)
    db.session.commit()

    return jsonify({'message' : f'Produs adaugat cu succes!'})

#Update al stocului pe un anumit produs
@app.route('/products/<id_prod>', methods = ['OPTIONS', 'PUT'])
@token_required
def update_product(current_user, id_prod):
    if not current_user.admin:
        return jsonify({'message' : 'Acces restrictionat! Nu puteti actualiza produse daca nu sunteti administrator!'})
    product = Produse.query.get(id_prod)
    if not product:
        return jsonify({'message' : 'Produsul nu exista!'})

    product.stoc = True
    db.session.commit()

    response = jsonify({'message' : 'Stocul produsului a fost readus la 1'})
    return response

#
@app.route('/products/<id_prod>', methods = ['DELETE'])
@token_required
def delete_product(current_user, id_prod):
    if not current_user.admin:
        return jsonify({'message' : 'Acces restrictionat! Nu puteti sterge un produs daca nu sunteti administrator!'})
    product = Produse.query.get(id_prod)
    if not product: 
        return jsonify({'message' : 'Produsul nu exista!'})

    DetaliiCos.query.filter_by(id_produs = id_prod).delete()

    db.session.delete(product)
    db.session.commit()

    return jsonify({'message' : 'Produs sters!'})    

#-->ENDPOINTS DETALII COS, PRODUSELE ADUAGATE IN COS SI GESTIONAREA ACESTORA

@app.route('/cart/add_product/<id_produs>', methods = ['POST'])
@token_required
def add_to_cart(current_user, id_produs):
    produs = Produse.query.get(id_produs)

    cos = Cos.query.filter_by(id_utilizator=current_user.id, activ=True).first()

    if not cos:
        cos = Cos(id_utilizator=current_user.id)
        db.session.add(cos)
        db.session.commit()

    if not produs or produs.stoc == False:
        return jsonify({'message' : 'Produsul nu (mai) este disponibil'}), 404
    
    if DetaliiCos.query.filter_by(id_cos = cos.id, id_produs = id_produs).first() and cos.activ == True:
        return jsonify({'message' : f'Produsul {produs.nume} a fost adaugat deja in cosul utilizatorului {current_user.prenume}'})
    
    detalii_cos = DetaliiCos(id_cos = cos.id, id_produs = produs.id)
    db.session.add(detalii_cos)
    db.session.commit()
    return jsonify({'message' : f'Produsul {produs.nume} adaugat cu succes in cosul {cos.id}!'})


@app.route('/cart/products', methods = ['GET'])
@token_required
def added_products(current_user):
    products = db.session.query(Produse).join(DetaliiCos).join(Cos).filter(Cos.id_utilizator == current_user.id, Cos.activ == True).all()

    output = []

    for product in products:
        product_data = {}
        product_data['id'] = product.id
        product_data['nume'] = product.nume
        product_data['categorie'] = product.categorie
        product_data['pret'] = product.pret 
        product_data['descriere'] = product.descriere
        product_data['imagine'] = product.imagine
        product_data['stoc'] = product.stoc
        product_data['data_lansare'] = product.data_lansare
        output.append(product_data)
    
    return jsonify({'produse' : output})

@app.route('/cart/delete_product/<id_produs>', methods = ['DELETE'])
@token_required
def delete_from_cart(current_user, id_produs):
    cos = Cos.query.filter_by(id_utilizator=current_user.id, activ=True).first()

    if not cos: 
        return jsonify({'message' : f'Utilizatorul {current_user.prenume} nu are un cos activ'})
    
    produs = DetaliiCos.query.filter_by(id_produs = id_produs, id_cos=cos.id).first()

    if not produs: 
        return jsonify({'message' : 'Posibila eroare sau produsul a fost deja sters'})

    db.session.delete(produs)
    db.session.commit()

    return jsonify({'message' : f'Produs sters din cosul {cos.id} al utilizatorului {current_user.prenume}'})

#-->ENDPOITNS PLASARE COMANDA SI GESTIONAREA ACESTEIA
@app.route('/order/create', methods = ['POST'])
@token_required
def place_order(current_user):
    cos = Cos.query.filter_by(id_utilizator = current_user.id, activ=True).first()
    produse = db.session.query(Produse).join(DetaliiCos).join(Cos).filter(Cos.id_utilizator == current_user.id, DetaliiCos.cos.has(activ=True)).all()

    if not produse: 
        return jsonify({'message' : f'Nu exista produse in cosul {cos.id} pentru a plasa o comanda'})
    
    total = 19.99 #costul standard de livrare
    for produs in produse:
        total += produs.pret
        produs.stoc = False

    comanda = Comenzi(id_cos = cos.id, total = total)
    db.session.add(comanda)
    cos.activ = False
    db.session.commit()
    return jsonify({'message' : 'Comanda a fost plasata cu succes'})

@app.route('/orders/show', methods=['GET'])
@token_required
def show_orders(current_user):
    comenzi = db.session.query(Comenzi).join(Cos).filter(Cos.id_utilizator == current_user.id).all()

    output = []
    for comanda in comenzi:
        comanda_data = {}
        comanda_data['id_comanda'] = comanda.id
        comanda_data['id_cos'] = comanda.cos.id

        produse_comanda = []
        for detaliu_cos in comanda.cos.detalii_cos:
            produs = detaliu_cos.produs
            produs_data = {
                'id_produs': produs.id,
                'nume_produs': produs.nume,
                'pret_produs': produs.pret,
                'imagine_produs' : produs.imagine
            }
            produse_comanda.append(produs_data)

        comanda_data['produse_comanda'] = produse_comanda
        output.append(comanda_data)

    return jsonify({'Comenzi': output})




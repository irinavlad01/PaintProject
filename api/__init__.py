from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:3000", 
        "supports_credentials": True,
        "methods": ["GET", "POST", "PUT", "OPTIONS", "DELETE", "HEAD", "CONNECT", "PATCH", "TRACE"] 
    }
})

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/paintproject'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '9a1f529564d0ba085b081e2719f272f7'

db = SQLAlchemy(app)

from api import routes
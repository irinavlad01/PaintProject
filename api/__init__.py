from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost:3306/online_shop'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

from api import routes
import os

from dotenv import load_dotenv
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
jwt = JWTManager(app)
ma = Marshmallow(app)
CORS(app)


@app.route("/")
def index():
    return "Flask server is running."


if __name__ == "__main__":
    app.run(port=5555, debug=True)

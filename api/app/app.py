# app/app.py
from flask import Flask
from werkzeug.exceptions import HTTPException

from app.config import Config
from app.extensions import bcrypt, cors, db, jwt, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)

    
    from app.models.case import Case 
    from app.models.case_share import CaseShare 
    from app.models.item import Item
    from app.models.user import User

    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return {"error": error.description}, error.code

    @app.route("/")
    def index():
        return "Flask server is running."

    return app

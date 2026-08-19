# app/app.py
from flask import Flask
from werkzeug.exceptions import HTTPException

from app.config import Config
from app.extensions import bcrypt, cors, db, jwt, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # initialize extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)

    # import models
    from app.models.case import Case
    from app.models.case_share import CaseShare
    from app.models.item import Item
    from app.models.user import User

    # import and register blueprints
    from app.routes.auth import auth_bp
    from app.routes.cases import cases_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(cases_bp, url_prefix="/api/cases")

    # error handler for HTTPExceptions raised by abort() or other code
    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return {"error": error.description}, error.code

    # simple liveness check at the root
    @app.route("/")
    def index():
        return "Flask server is running."

    return app

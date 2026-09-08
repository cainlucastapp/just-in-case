# app/app.py
from flask import Flask
from werkzeug.exceptions import HTTPException

from app.config import Config
from app.extensions import bcrypt, cors, db, jwt, limiter, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # initialize extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)
    limiter.init_app(app)

    # import models
    from app.models.case import Case
    from app.models.case_item import CaseItem
    from app.models.case_share import CaseShare
    from app.models.item import Item
    from app.models.user import User

    # import and register blueprints
    from app.routes.auth import auth_bp
    from app.routes.case_items import case_items_bp
    from app.routes.case_shares import case_shares_bp
    from app.routes.cases import cases_bp
    from app.routes.items import items_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(cases_bp, url_prefix="/api/cases")
    app.register_blueprint(items_bp, url_prefix="/api/items")
    app.register_blueprint(case_items_bp, url_prefix="/api/cases/<case_id>/items")
    app.register_blueprint(case_shares_bp, url_prefix="/api/cases/<case_id>/shares")

    # error handler for HTTPExceptions raised by abort() or other code
    @app.errorhandler(HTTPException)
    def handle_http_exception(error):
        return {"error": error.description}, error.code

    # normalize JWT error responses to always return JSON with an "error" key
    @jwt.unauthorized_loader
    def handle_missing_token(reason):
        return {"error": reason}, 401

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        return {"error": "token has expired"}, 401

    @jwt.invalid_token_loader
    def handle_invalid_token(reason):
        return {"error": reason}, 422

    # simple liveness check at the root
    @app.route("/")
    def index():
        return "Flask server is running."

    return app

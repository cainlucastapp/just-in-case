# app/routes/auth.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models.user import User
from app.services.auth_service import authenticate_user, register_user

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    # parse the request body, default to empty dict if missing/invalid
    data = request.get_json() or {}

    # build and validate the new user
    try:
        user = register_user(
            email=data.get("email"),
            password=data.get("password"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    # persist the user
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "an account with that email already exists"}), 409

    # issue a jwt keyed on the public_id
    token = create_access_token(identity=user.public_id)
    return jsonify({"access_token": token, "user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
    # parse the request body, default to empty dict if missing/invalid
    data = request.get_json() or {}

    # look up the user and verify the password
    try:
        user = authenticate_user(data.get("email"), data.get("password"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 401

    # issue a jwt keyed on the public_id
    token = create_access_token(identity=user.public_id)
    return jsonify({"access_token": token, "user": user.to_dict()}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    # resolve the current user from the jwt
    user = User.query.filter_by(public_id=get_jwt_identity()).first_or_404()
    return jsonify(user.to_dict()), 200

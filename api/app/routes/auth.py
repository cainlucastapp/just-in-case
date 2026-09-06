# app/routes/auth.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    set_refresh_cookies,
    unset_refresh_cookies,
)
from sqlalchemy.exc import IntegrityError

from app.extensions import db, limiter
from app.models.user import User
from app.services.auth_service import authenticate_user, register_user
from app.services.db_helpers import commit_or_409
from app.services.user_service import change_password, delete_account, update_profile
from app.utils.auth import get_current_user

auth_bp = Blueprint("auth", __name__)


# issue a new session - access token in the body, refresh token as a cookie
def _issue_session(user, status_code):
    access_token = create_access_token(identity=user.public_id)
    refresh_token = create_refresh_token(identity=user.public_id)
    response = jsonify({"access_token": access_token, "user": user.to_dict()})
    set_refresh_cookies(response, refresh_token)
    return response, status_code


@auth_bp.post("/register")
@limiter.limit("10 per hour")
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

    return _issue_session(user, 201)


@auth_bp.post("/login")
@limiter.limit("5 per minute")
def login():
    # parse the request body, default to empty dict if missing/invalid
    data = request.get_json() or {}

    # look up the user and verify the password
    try:
        user = authenticate_user(data.get("email"), data.get("password"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 401

    return _issue_session(user, 200)


@auth_bp.post("/refresh")
@jwt_required(refresh=True, locations=["cookies"])
def refresh():
    # mint a new access token from the refresh cookie
    access_token = create_access_token(identity=get_jwt_identity())
    return jsonify({"access_token": access_token}), 200


@auth_bp.post("/logout")
def logout():
    # clear the refresh cookie
    response = jsonify({"message": "logged out"})
    unset_refresh_cookies(response)
    return response, 200


@auth_bp.get("/me")
@jwt_required()
def me():
    # resolve the current user from the jwt
    user = User.query.filter_by(public_id=get_jwt_identity()).first_or_404()
    return jsonify(user.to_dict()), 200


@auth_bp.put("/me")
@jwt_required()
def update_me():
    user = get_current_user()
    data = request.get_json() or {}

    try:
        update_profile(
            user,
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            email=data.get("email"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    conflict = commit_or_409("an account with that email already exists")
    if conflict:
        return jsonify({"error": conflict}), 409

    return jsonify(user.to_dict()), 200


@auth_bp.put("/me/password")
@jwt_required()
def update_password():
    user = get_current_user()
    data = request.get_json() or {}

    try:
        change_password(
            user,
            current_password=data.get("current_password"),
            new_password=data.get("new_password"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    db.session.commit()
    return "", 204


@auth_bp.delete("/me")
@jwt_required()
def delete_me():
    user = get_current_user()
    data = request.get_json() or {}

    try:
        delete_account(user, current_password=data.get("current_password"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    db.session.commit()
    return "", 204

# app/utils/auth.py
from flask_jwt_extended import get_jwt_identity

from app.models.user import User


def get_current_user():
    # resolve the authenticated user from the jwt subject claim
    return User.query.filter_by(public_id=get_jwt_identity()).first_or_404()

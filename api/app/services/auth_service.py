# app/services/auth_service.py
from app.extensions import db
from app.models.user import User


def register_user(email, password, first_name, last_name):
    # validate the password length
    if not password or len(password) < 8:
        raise ValueError("password must be at least 8 characters")
    # model validators normalize/check email and name
    user = User(email=email, first_name=first_name, last_name=last_name)
    # hash the password
    user.set_password(password)
    db.session.add(user)
    return user


def authenticate_user(email, password):
    # normalize to match how the model stores emails
    normalized_email = (email or "").strip().lower()
    user = User.query.filter_by(email=normalized_email).first()
    # error for unknown email vs wrong passworde
    if not user or not user.check_password(password):
        raise ValueError("invalid email or password")
    return user

# app/services/auth_service.py
from app.extensions import db
from app.models.user import User


# register user
def register_user(email, password, first_name, last_name):
    if not password or len(password) < 8:
        raise ValueError("password must be at least 8 characters")
    user = User(email=email, first_name=first_name, last_name=last_name)
    user.set_password(password)
    db.session.add(user)
    return user


# find user by email
def find_user_by_email(email):
    normalized_email = (email or "").strip().lower()
    return User.query.filter_by(email=normalized_email).first()


# authenticate user
def authenticate_user(email, password):
    user = find_user_by_email(email)
    if not user or not user.check_password(password):
        raise ValueError("invalid email or password")
    return user

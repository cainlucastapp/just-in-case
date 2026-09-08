# app/services/auth_service.py
from datetime import datetime, timezone

from app.extensions import db
from app.models.user import User


# shared by registration and password changes
def validate_password_strength(password):
    if not isinstance(password, str) or len(password) < 8:
        raise ValueError("password must be at least 8 characters")


# reject a refresh token minted before the user's last password change
def ensure_token_after_password_change(user, token_issued_at):
    if not user.password_changed_at:
        return
    # jwt "iat" is a whole-second unix timestamp, matched against the
    # second-truncated password_changed_at set in User.set_password
    issued_at = datetime.fromtimestamp(token_issued_at, tz=timezone.utc).replace(
        tzinfo=None
    )
    if issued_at < user.password_changed_at:
        raise ValueError("session invalidated by a password change")


# register user
def register_user(email, password, first_name, last_name):
    validate_password_strength(password)
    user = User(email=email, first_name=first_name, last_name=last_name)
    user.set_password(password)
    db.session.add(user)
    return user


# find user by email
def find_user_by_email(email):
    normalized_email = email.strip().lower() if isinstance(email, str) else ""
    return User.query.filter_by(email=normalized_email).first()


# authenticate user
def authenticate_user(email, password):
    user = find_user_by_email(email)
    if not user or not isinstance(password, str) or not user.check_password(password):
        raise ValueError("invalid email or password")
    return user

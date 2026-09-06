# app/services/user_service.py
from app.extensions import db
from app.services.auth_service import validate_password_strength


# validate current password
def verify_current_password(user, current_password):
    # bcrypt errors on a non-string
    if not isinstance(current_password, str) or not user.check_password(current_password):
        raise ValueError("current password is incorrect")


# update profile
def update_profile(user, first_name, last_name, email):
    if first_name is not None:
        user.first_name = first_name
    if last_name is not None:
        user.last_name = last_name
    if email is not None:
        user.email = email
    return user


# change password
def change_password(user, current_password, new_password):
    verify_current_password(user, current_password)
    validate_password_strength(new_password)
    user.set_password(new_password)
    return user


# delete account
def delete_account(user, current_password):
    verify_current_password(user, current_password)
    db.session.delete(user)

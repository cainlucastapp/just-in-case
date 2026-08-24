# app/services/case_share_service.py
from app.extensions import db
from app.models.case_share import CaseShare
from app.models.user import User
from app.services.auth_service import find_user_by_email


# list shares
def list_shares(case):
    return case.shares


# create share
def create_share(case, email):
    user = find_user_by_email(email)
    if not user:
        raise ValueError("no account found with that email")

    if user.id == case.owner_id:
        raise ValueError("the owner already has access to this case")

    share = CaseShare(case_id=case.id, user_id=user.id)
    db.session.add(share)
    return share


# get case share
def get_case_share(case, user_public_id):
    user = User.query.filter_by(public_id=user_public_id).first_or_404()
    return CaseShare.query.filter_by(case_id=case.id, user_id=user.id).first_or_404()


# delete share
def delete_share(share):
    db.session.delete(share)

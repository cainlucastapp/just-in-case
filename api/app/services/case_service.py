# app/services/case_service.py
from flask import abort

from app.extensions import db
from app.models.case import Case


def list_accessible_cases(user):
    # cases the user owns, plus cases shared with them, newest first
    owned = list(user.owned_cases)
    shared = [share.case for share in user.case_shares]
    cases = {case.id: case for case in owned + shared}.values()
    return sorted(cases, key=lambda case: case.created_at, reverse=True)


def get_owned_case(public_id, user):
    # 404 if missing, 403 if the current user isn't the owner
    case = Case.query.filter_by(public_id=public_id).first_or_404()
    if case.owner_id != user.id:
        abort(403, description="you do not own this case")
    return case


def get_readable_case(public_id, user):
    # 404 if missing, 403 unless the current user owns or is shared on it
    case = Case.query.filter_by(public_id=public_id).first_or_404()
    is_owner = case.owner_id == user.id
    is_shared = any(share.user_id == user.id for share in case.shares)
    if not (is_owner or is_shared):
        abort(403, description="you do not have access to this case")
    return case


def create_case(owner, title, description):
    # title is validated/normalized by the model on assignment
    case = Case(owner_id=owner.id, title=title, description=description)
    db.session.add(case)
    return case


def update_case(case, title, description):
    # only touch fields that were actually sent
    if title is not None:
        case.title = title
    if description is not None:
        case.description = description
    return case


def delete_case(case):
    db.session.delete(case)

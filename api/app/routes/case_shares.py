# app/routes/case_shares.py
from flask import Blueprint, abort, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.case_service import get_owned_case, get_readable_case
from app.services.case_share_service import (
    create_share,
    delete_share,
    get_case_share,
    list_shares,
)
from app.services.db_helpers import commit_or_409
from app.utils.auth import get_current_user

case_shares_bp = Blueprint("case_shares", __name__)


# list case shares
@case_shares_bp.get("")
@jwt_required()
def list_case_shares(case_id):
    user = get_current_user()
    case = get_owned_case(case_id, user)
    return jsonify([share.to_dict() for share in list_shares(case)]), 200


# create case share
@case_shares_bp.post("")
@jwt_required()
def create_case_share(case_id):
    user = get_current_user()
    case = get_owned_case(case_id, user)
    data = request.get_json() or {}

    try:
        share = create_share(case, data.get("email"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    conflict = commit_or_409("this case is already shared with that user")
    if conflict:
        return jsonify({"error": conflict}), 409

    return jsonify(share.to_dict()), 201


# delete case share - the owner can revoke anyone, a shared user can remove themselves
@case_shares_bp.delete("/<user_public_id>")
@jwt_required()
def delete_case_share(case_id, user_public_id):
    user = get_current_user()
    case = get_readable_case(case_id, user)

    is_owner = case.owner_id == user.id
    is_self = user.public_id == user_public_id
    if not (is_owner or is_self):
        abort(403, description="you do not have permission to remove this share")

    share = get_case_share(case, user_public_id)
    delete_share(share)

    conflict = commit_or_409("unable to revoke access")
    if conflict:
        return jsonify({"error": conflict}), 409

    return "", 204

# app/routes/cases.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.case_service import (
    create_case,
    delete_case,
    get_owned_case,
    get_readable_case,
    list_accessible_cases,
    update_case,
)
from app.services.db_helpers import commit_or_409
from app.utils.auth import get_current_user

cases_bp = Blueprint("cases", __name__)


@cases_bp.get("")
@jwt_required()
def list_cases():
    # cases the current user owns or has been given access to
    user = get_current_user()
    cases = list_accessible_cases(user)
    return jsonify([case.to_dict() for case in cases]), 200


@cases_bp.post("")
@jwt_required()
def create():
    user = get_current_user()
    data = request.get_json() or {}

    # build and validate the new case
    try:
        case = create_case(
            owner=user,
            title=data.get("title"),
            description=data.get("description"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    # persist the case
    conflict = commit_or_409("unable to create case")
    if conflict:
        return jsonify({"error": conflict}), 409

    return jsonify(case.to_dict()), 201


@cases_bp.get("/<public_id>")
@jwt_required()
def get_case(public_id):
    # owner or a user the case is shared with can read it
    user = get_current_user()
    case = get_readable_case(public_id, user)
    return jsonify(case.to_dict()), 200


@cases_bp.put("/<public_id>")
@jwt_required()
def update(public_id):
    # only the owner can edit a case
    user = get_current_user()
    case = get_owned_case(public_id, user)
    data = request.get_json() or {}

    try:
        update_case(case, title=data.get("title"), description=data.get("description"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    conflict = commit_or_409("unable to update case")
    if conflict:
        return jsonify({"error": conflict}), 409

    return jsonify(case.to_dict()), 200


@cases_bp.delete("/<public_id>")
@jwt_required()
def delete(public_id):
    # only the owner can delete a case
    user = get_current_user()
    case = get_owned_case(public_id, user)
    delete_case(case)

    conflict = commit_or_409("unable to delete case")
    if conflict:
        return jsonify({"error": conflict}), 409

    return "", 204

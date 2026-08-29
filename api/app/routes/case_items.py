# app/routes/case_items.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.case_service import get_owned_case, get_readable_case
from app.services.db_helpers import commit_or_409
from app.services.item_service import (
    attach_item_to_case,
    detach_item_from_case,
    get_case_attachment,
    get_owned_item,
    list_case_items,
)
from app.utils.auth import get_current_user

case_items_bp = Blueprint("case_items", __name__)


# list items attached to a case
@case_items_bp.get("")
@jwt_required()
def list_items(case_id):
    # owner or a user the case is shared with can read its items
    user = get_current_user()
    case = get_readable_case(case_id, user)
    return jsonify([item.to_dict() for item in list_case_items(case)]), 200


# attach an existing item to a case
@case_items_bp.post("")
@jwt_required()
def attach(case_id):
    # only the case owner can attach items, and only items they also own
    user = get_current_user()
    case = get_owned_case(case_id, user)
    data = request.get_json() or {}
    item = get_owned_item(data.get("item_id"), user)

    attach_item_to_case(case, item)

    conflict = commit_or_409("that item is already attached to this case")
    if conflict:
        return jsonify({"error": conflict}), 409

    return jsonify(item.to_dict()), 201


# detach an item from a case
@case_items_bp.delete("/<item_id>")
@jwt_required()
def detach(case_id, item_id):
    user = get_current_user()
    case = get_owned_case(case_id, user)
    case_item = get_case_attachment(case, item_id)
    detach_item_from_case(case_item)

    conflict = commit_or_409("unable to remove item from case")
    if conflict:
        return jsonify({"error": conflict}), 409

    return "", 204

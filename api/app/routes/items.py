# app/routes/items.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.case_service import get_owned_case, get_readable_case
from app.services.db_helpers import commit_or_409
from app.services.item_service import create_item, delete_item, get_case_item, update_item
from app.utils.auth import get_current_user

items_bp = Blueprint("items", __name__)


@items_bp.get("")
@jwt_required()
def list_items(case_id):
    # owner or a user the case is shared with can read its items
    user = get_current_user()
    case = get_readable_case(case_id, user)
    return jsonify([item.to_dict() for item in case.items]), 200


@items_bp.post("")
@jwt_required()
def create(case_id):
    # only the case owner can add items
    user = get_current_user()
    case = get_owned_case(case_id, user)
    data = request.get_json() or {}

    # build and validate the new item
    try:
        item = create_item(
            case=case,
            created_by=user,
            title=data.get("title"),
            category=data.get("category"),
            content=data.get("content"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    # persist the item
    conflict = commit_or_409("unable to create item")
    if conflict:
        return jsonify({"error": conflict}), 409

    return jsonify(item.to_dict()), 201


@items_bp.get("/<item_id>")
@jwt_required()
def get_item(case_id, item_id):
    # owner or a user the case is shared with can read this item
    user = get_current_user()
    case = get_readable_case(case_id, user)
    item = get_case_item(case, item_id)
    return jsonify(item.to_dict()), 200


@items_bp.put("/<item_id>")
@jwt_required()
def update(case_id, item_id):
    # only the case owner can edit its items
    user = get_current_user()
    case = get_owned_case(case_id, user)
    item = get_case_item(case, item_id)
    data = request.get_json() or {}

    try:
        update_item(
            item,
            title=data.get("title"),
            category=data.get("category"),
            content=data.get("content"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    conflict = commit_or_409("unable to update item")
    if conflict:
        return jsonify({"error": conflict}), 409

    return jsonify(item.to_dict()), 200


@items_bp.delete("/<item_id>")
@jwt_required()
def delete(case_id, item_id):
    # only the case owner can delete its items
    user = get_current_user()
    case = get_owned_case(case_id, user)
    item = get_case_item(case, item_id)
    delete_item(item)

    conflict = commit_or_409("unable to delete item")
    if conflict:
        return jsonify({"error": conflict}), 409

    return "", 204

# app/routes/items.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from app.services.db_helpers import commit_or_409
from app.services.item_service import (
    create_item,
    delete_item,
    get_owned_item,
    list_owned_items,
    update_item,
)
from app.utils.auth import get_current_user

items_bp = Blueprint("items", __name__)


# list my items
@items_bp.get("")
@jwt_required()
def list_items():
    user = get_current_user()
    return jsonify([item.to_dict() for item in list_owned_items(user)]), 200


# create item
@items_bp.post("")
@jwt_required()
def create():
    user = get_current_user()
    data = request.get_json() or {}

    try:
        item = create_item(
            owner=user,
            title=data.get("title"),
            category=data.get("category"),
            content=data.get("content"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    conflict = commit_or_409("unable to create item")
    if conflict:
        return jsonify({"error": conflict}), 409

    return jsonify(item.to_dict()), 201


# get item
@items_bp.get("/<item_id>")
@jwt_required()
def get_item(item_id):
    user = get_current_user()
    item = get_owned_item(item_id, user)
    return jsonify(item.to_dict()), 200


# update item
@items_bp.put("/<item_id>")
@jwt_required()
def update(item_id):
    user = get_current_user()
    item = get_owned_item(item_id, user)
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


# delete item forever - cascades off every case it's attached to
@items_bp.delete("/<item_id>")
@jwt_required()
def delete(item_id):
    user = get_current_user()
    item = get_owned_item(item_id, user)
    delete_item(item)

    conflict = commit_or_409("unable to delete item")
    if conflict:
        return jsonify({"error": conflict}), 409

    return "", 204

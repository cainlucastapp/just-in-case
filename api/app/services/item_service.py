# app/services/item_service.py
from flask import abort

from app.extensions import db
from app.models.case_item import CaseItem
from app.models.item import Item


def list_owned_items(user):
    # newest first, matches list_accessible_cases's ordering convention
    return sorted(user.items, key=lambda item: item.created_at, reverse=True)


def get_owned_item(public_id, user):
    # 404 if missing, 403 if the current user isn't the owner
    item = Item.query.filter_by(public_id=public_id).first_or_404()
    if item.owner_id != user.id:
        abort(403, description="you do not own this item")
    return item


def create_item(owner, title, category, content):
    # check content isn't empty
    if not content or not content.strip():
        raise ValueError("content is required")

    item = Item(
        owner_id=owner.id,
        title=title,
        category=category,
        content=content.strip(),
    )
    db.session.add(item)
    return item


def update_item(item, title, category, content):
    # only touch fields that were actually sent
    if title is not None:
        item.title = title
    if category is not None:
        item.category = category
    if content is not None:
        if not content.strip():
            raise ValueError("content is required")
        item.content = content.strip()
    return item


def delete_item(item):
    # cascades off every case_items row - gone from every case it was in
    db.session.delete(item)


def list_case_items(case):
    # items attached to this case, newest attachment first
    case_items = sorted(case.case_items, key=lambda ci: ci.added_at, reverse=True)
    return [case_item.item for case_item in case_items]


def attach_item_to_case(case, item):
    case_item = CaseItem(case_id=case.id, item_id=item.id)
    db.session.add(case_item)
    return case_item


def get_case_attachment(case, item_public_id):
    # 404 if the item doesn't exist or isn't attached to this case
    item = Item.query.filter_by(public_id=item_public_id).first_or_404()
    return CaseItem.query.filter_by(case_id=case.id, item_id=item.id).first_or_404()


def detach_item_from_case(case_item):
    # removes it from just this case - the item itself is untouched
    db.session.delete(case_item)

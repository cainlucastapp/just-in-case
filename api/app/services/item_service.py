# app/services/item_service.py
from app.extensions import db
from app.models.item import Item


def get_case_item(case, item_public_id):
    # 404 if missing or if it belongs to a different case
    return Item.query.filter_by(public_id=item_public_id, case_id=case.id).first_or_404()


def create_item(case, created_by, title, category, content):
    # content isn't a model-level validator, so check it here
    if not content or not content.strip():
        raise ValueError("content is required")

    item = Item(
        case_id=case.id,
        created_by_id=created_by.id,
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
    db.session.delete(item)

# app/models/item.py
import uuid

from app.extensions import db


class Item(db.Model):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(
        db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4())
    )
    # get attached to more than one case without duplicating it
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    owner = db.relationship("User", back_populates="items")
    # deleting the item removes it from every case it was attached to
    case_items = db.relationship(
        "CaseItem", back_populates="item", cascade="all, delete-orphan"
    )

    @db.validates("title", "category")
    def validate_required_text(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key} is required")
        return value.strip()

    def to_dict(self):
        return {
            "id": self.public_id,
            "owner_id": self.owner.public_id,
            "title": self.title,
            "category": self.category,
            "content": self.content,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

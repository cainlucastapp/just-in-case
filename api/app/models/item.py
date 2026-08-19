# app/models/item.py
import uuid

from app.extensions import db


class Item(db.Model):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(
        db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4())
    )
    case_id = db.Column(db.Integer, db.ForeignKey("cases.id"), nullable=False)
    created_by_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    case = db.relationship("Case", back_populates="items")
    created_by = db.relationship("User", back_populates="items_created")

    @db.validates("title", "category")
    def validate_required_text(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key} is required")
        return value.strip()

    def to_dict(self):
        return {
            "id": self.public_id,
            "case_id": self.case.public_id,
            "title": self.title,
            "category": self.category,
            "content": self.content,
            "created_by": self.created_by.public_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

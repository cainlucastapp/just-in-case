# app/models/case.py
import uuid

from app.extensions import db


class Case(db.Model):
    __tablename__ = "cases"

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(
        db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4())
    )
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

    owner = db.relationship("User", back_populates="owned_cases")
    items = db.relationship(
        "Item", back_populates="case", cascade="all, delete-orphan"
    )
    shares = db.relationship(
        "CaseShare", back_populates="case", cascade="all, delete-orphan"
    )

    @db.validates("title")
    def validate_title(self, key, value):
        if not value or not value.strip():
            raise ValueError("title is required")
        return value.strip()

    def to_dict(self):
        return {
            "id": self.public_id,
            "title": self.title,
            "description": self.description,
            "owner_id": self.owner.public_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

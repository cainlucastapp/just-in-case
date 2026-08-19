# app/models/user.py
import uuid

from app.extensions import bcrypt, db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(
        db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4())
    )
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())

    owned_cases = db.relationship(
        "Case", back_populates="owner", cascade="all, delete-orphan"
    )
    case_shares = db.relationship(
        "CaseShare", back_populates="user", cascade="all, delete-orphan"
    )
    items_created = db.relationship("Item", back_populates="created_by")

    @db.validates("email")
    def validate_email(self, key, value):
        if not value or "@" not in value:
            raise ValueError("a valid email is required")
        return value.strip().lower()

    @db.validates("first_name", "last_name")
    def validate_name(self, key, value):
        if not value or not value.strip():
            raise ValueError(f"{key} is required")
        return value.strip()

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.public_id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "created_at": self.created_at.isoformat(),
        }

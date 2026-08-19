# app/models/case_share.py
from app.extensions import db


class CaseShare(db.Model):
    __tablename__ = "case_shares"
    __table_args__ = (
        db.UniqueConstraint("case_id", "user_id", name="uq_case_shares_case_user"),
    )

    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey("cases.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    shared_at = db.Column(db.DateTime, default=db.func.now())

    case = db.relationship("Case", back_populates="shares")
    user = db.relationship("User", back_populates="case_shares")

    def to_dict(self):
        return {
            "id": self.id,
            "case_id": self.case.public_id,
            "user": self.user.to_dict(),
            "shared_at": self.shared_at.isoformat(),
        }

# app/models/case_item.py
from app.extensions import db


# join table linking a case to an item
class CaseItem(db.Model):
    __tablename__ = "case_items"
    # attaching the same item to the same case twice does not create a duplicate row
    __table_args__ = (
        db.UniqueConstraint("case_id", "item_id", name="uq_case_items_case_item"),
    )

    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey("cases.id"), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    added_at = db.Column(db.DateTime, default=db.func.now())

    case = db.relationship("Case", back_populates="case_items")
    item = db.relationship("Item", back_populates="case_items")

    def to_dict(self):
        # nests the full item so a case's item list is one request, not N+1
        return {
            "case_id": self.case.public_id,
            "item": self.item.to_dict(),
            "added_at": self.added_at.isoformat(),
        }

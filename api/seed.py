# seed.py
from dotenv import load_dotenv

load_dotenv()

from app.app import create_app
from app.extensions import db
from app.models.case import Case
from app.models.case_share import CaseShare
from app.models.item import Item
from app.models.user import User 

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    alice = User(email="alice@example.com", first_name="Alice", last_name="Nguyen")
    alice.set_password("password123")

    bob = User(email="bob@example.com", first_name="Bob", last_name="Reyes")
    bob.set_password("password123")

    carol = User(email="carol@example.com", first_name="Carol", last_name="Osei")
    carol.set_password("password123")

    db.session.add_all([alice, bob, carol])
    db.session.commit()

    household = Case(
        owner_id=alice.id,
        title="Household Essentials",
        description="Bills, mortgage, and utilities Alice manages day to day.",
    )
    estate = Case(
        owner_id=bob.id,
        title="Bob's Estate Info",
        description="What Bob's family would need if something happened to him.",
    )

    db.session.add_all([household, estate])
    db.session.commit()

    db.session.add_all(
        [
            CaseShare(case_id=household.id, user_id=bob.id),
            CaseShare(case_id=household.id, user_id=carol.id),
            CaseShare(case_id=estate.id, user_id=alice.id),
        ]
    )

    db.session.add_all(
        [
            Item(
                case_id=household.id,
                created_by_id=alice.id,
                title="Chase Checking Account",
                category="bank_account",
                content=(
                    "Account #: 000123456789, Routing #: 021000021, "
                    "online banking login: alice.n"
                ),
            ),
            Item(
                case_id=household.id,
                created_by_id=alice.id,
                title="Riverbend HOA",
                category="hoa",
                content=(
                    "Dues $220/quarter, paid via HOA portal, "
                    "contact: manager@riverbendhoa.com, (555) 019-2231"
                ),
            ),
            Item(
                case_id=household.id,
                created_by_id=alice.id,
                title="Wells Fargo Mortgage",
                category="mortgage",
                content=(
                    "Loan #: 55891023, servicer: Wells Fargo Home Lending, "
                    "autopay from Chase checking on the 1st"
                ),
            ),
            Item(
                case_id=estate.id,
                created_by_id=bob.id,
                title="Life Insurance Policy",
                category="insurance",
                content="MetLife policy #MP-88213, agent: Dana Cho, (555) 048-7710",
            ),
            Item(
                case_id=estate.id,
                created_by_id=bob.id,
                title="Safe Deposit Box",
                category="document",
                content=(
                    "First National Bank, box #214, "
                    "key kept in home office desk drawer"
                ),
            ),
        ]
    )

    db.session.commit()

    print(
        f"seeded {User.query.count()} users, {Case.query.count()} cases, "
        f"{CaseShare.query.count()} shares, {Item.query.count()} items"
    )

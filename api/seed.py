# seed.py
from dotenv import load_dotenv

load_dotenv()

from app.app import create_app
from app.extensions import db
from app.models.case import Case
from app.models.case_item import CaseItem
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
    family_emergency = Case(
        owner_id=alice.id,
        title="Family Emergency Info",
        description="What Alice's family would need to act on her behalf quickly.",
    )
    estate = Case(
        owner_id=bob.id,
        title="Bob's Estate Info",
        description="What Bob's family would need if something happened to him.",
    )

    db.session.add_all([household, family_emergency, estate])
    db.session.commit()

    db.session.add_all(
        [
            CaseShare(case_id=household.id, user_id=bob.id),
            CaseShare(case_id=household.id, user_id=carol.id),
            CaseShare(case_id=family_emergency.id, user_id=carol.id),
            CaseShare(case_id=estate.id, user_id=alice.id),
        ]
    )

    # items are owned by whoever creates them, not by a case - attaching the
    # same item to more than one case (see alice_ssn below) doesn't duplicate it
    alice_checking = Item(
        owner_id=alice.id,
        title="Chase Checking Account",
        category="bank_account",
        content=(
            "Account #: 000123456789, Routing #: 021000021, "
            "online banking login: alice.n"
        ),
    )
    alice_hoa = Item(
        owner_id=alice.id,
        title="Riverbend HOA",
        category="hoa",
        content=(
            "Dues $220/quarter, paid via HOA portal, "
            "contact: manager@riverbendhoa.com, (555) 019-2231"
        ),
    )
    alice_mortgage = Item(
        owner_id=alice.id,
        title="Wells Fargo Mortgage",
        category="mortgage",
        content=(
            "Loan #: 55891023, servicer: Wells Fargo Home Lending, "
            "autopay from Chase checking on the 1st"
        ),
    )
    # attached to both of alice's cases below - the reuse case this whole
    # item/case split exists for
    alice_ssn = Item(
        owner_id=alice.id,
        title="Alice's Social Security Number",
        category="identity",
        content="000-12-3456",
    )
    bob_insurance = Item(
        owner_id=bob.id,
        title="Life Insurance Policy",
        category="insurance",
        content="MetLife policy #MP-88213, agent: Dana Cho, (555) 048-7710",
    )
    bob_safe_deposit = Item(
        owner_id=bob.id,
        title="Safe Deposit Box",
        category="document",
        content="First National Bank, box #214, key kept in home office desk drawer",
    )

    db.session.add_all(
        [
            alice_checking,
            alice_hoa,
            alice_mortgage,
            alice_ssn,
            bob_insurance,
            bob_safe_deposit,
        ]
    )
    db.session.commit()

    db.session.add_all(
        [
            CaseItem(case_id=household.id, item_id=alice_checking.id),
            CaseItem(case_id=household.id, item_id=alice_hoa.id),
            CaseItem(case_id=household.id, item_id=alice_mortgage.id),
            CaseItem(case_id=household.id, item_id=alice_ssn.id),
            CaseItem(case_id=family_emergency.id, item_id=alice_ssn.id),
            CaseItem(case_id=estate.id, item_id=bob_insurance.id),
            CaseItem(case_id=estate.id, item_id=bob_safe_deposit.id),
        ]
    )

    db.session.commit()

    print(
        f"seeded {User.query.count()} users, {Case.query.count()} cases, "
        f"{CaseShare.query.count()} shares, {Item.query.count()} items, "
        f"{CaseItem.query.count()} case-item attachments"
    )

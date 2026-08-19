# app/services/db_helpers.py
from sqlalchemy.exc import IntegrityError

from app.extensions import db


def commit_or_409(conflict_message):
    # commit the session, returning a message on a db-level constraint violation
    try:
        db.session.commit()
        return None
    except IntegrityError:
        db.session.rollback()
        return conflict_message

# app/config.py
import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

    # symmetric key for encrypting Item.content at rest, see app/services
    ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY")

    # comma-separated in .env, stripped to avoid whitespace bugs in origin matching
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "").split(",")
        if origin.strip()
    ]

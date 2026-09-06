# app/config.py
import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")

    # access token - header only
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_TOKEN_LOCATION = ["headers"]

    # refresh token - httponly cookie only
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_REFRESH_COOKIE_PATH = "/api/auth"
    # the csrf cookie has to be readable from every spa route, not just /api/auth,
    # since document.cookie is scoped to the current page's path, not the fetch target
    JWT_REFRESH_CSRF_COOKIE_PATH = "/"
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_COOKIE_SECURE = os.environ.get("JWT_COOKIE_SECURE", "false").lower() == "true"
    JWT_SESSION_COOKIE = False

    # symmetric key for encrypting Item.content
    ENCRYPTION_KEY = os.environ.get("ENCRYPTION_KEY")

    # comma-separated in .env, stripped to avoid whitespace bugs in origin matching
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "").split(",")
        if origin.strip()
    ]

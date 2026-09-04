# app/utils/crypto.py
import base64
import secrets

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from flask import current_app


# generate a per-item salt
def generate_salt():
    return secrets.token_hex(16)


# derive a fernet key from a salt and the server-wide encryption key
def derive_key(salt):
    master_key = current_app.config["ENCRYPTION_KEY"].encode("utf-8")
    derived = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt.encode("utf-8"),
        info=b"just-in-case-item-content",
    ).derive(master_key)
    return base64.urlsafe_b64encode(derived)


# encrypt plaintext with a key derived from the given salt
def encrypt(plaintext, salt):
    fernet = Fernet(derive_key(salt))
    return fernet.encrypt(plaintext.encode("utf-8")).decode("utf-8")


# decrypt ciphertext with a key derived from the given salt
def decrypt(ciphertext, salt):
    fernet = Fernet(derive_key(salt))
    return fernet.decrypt(ciphertext.encode("utf-8")).decode("utf-8")

# app/utils/request_data.py
from flask import request


# parses the json body, coercing anything that isn't an object to {}
def get_json_body():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}

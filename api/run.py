# run.py
import os

from dotenv import load_dotenv

load_dotenv()

from app.app import create_app  # noqa: E402

app = create_app()

if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(port=5555, debug=debug, threaded=True)

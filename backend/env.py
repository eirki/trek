import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(".") / ".env.local")
load_dotenv(dotenv_path=Path(".") / ".env")

graphhopper_api_key = os.environ["graphhopper_api_key"]
graphopper_url = os.environ["graphopper_url"]

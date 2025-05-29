import os
from dotenv import load_dotenv

load_dotenv()

POSTGRES_USER = os.environ.get("POSTGRES_USER", "")
POSTGRES_PASSWORD = os.environ.get("POSTGRES_PASSWORD", "")
POSTGRES_DB = os.environ.get("POSTGRES_DB", "")
POSTGRES_PORT = os.environ.get("POSTGRES_PORT", "5432")
POSTGRES_SERVER = os.environ.get("POSTGRES_SERVER", "localhost")

DATABASE_URL = "postgresql+asyncpg://postgres:admin@localhost:5432/database"
# DATABASE_URL = f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@
# {POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"

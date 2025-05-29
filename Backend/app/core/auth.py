import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer


load_dotenv()

OAUTH_SECRET_KEY = os.environ.get("OAUTH_SECRET_KEY", "")
OAUTH_ALGORITHM = "HS256"


oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")

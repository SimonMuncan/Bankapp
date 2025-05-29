from typing import Annotated
from fastapi import Depends

from schemas.user import CurrentUser
from services.authentification import get_current_user


current_user = Annotated[CurrentUser, Depends(get_current_user)]

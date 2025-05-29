import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.authentification import auth_middleware
from routers.user import router_user
from routers.wallet import router_wallet
from routers.transaction import router_transaction

app = FastAPI(
    title="My Wallet",
    description="An API for managing user wallets and transactions.",
    version="1.0.0",
)

app.include_router(router_user)
app.include_router(router_wallet)
app.include_router(router_transaction)
app.middleware("http")(auth_middleware)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

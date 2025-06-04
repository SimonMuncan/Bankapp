from datetime import datetime
from enum import Enum
import io
from fastapi import APIRouter, HTTPException, Query
from app.services.transactions import PDF
from fastapi import APIRouter, HTTPException
from app.crud.transaction import get_all_transactions, log_transaction, transfer
from app.crud.wallet import get_wallet
from app.crud.user import get_user
from app.schemas.transactions import TransactionIn, TransactionName
from app.dependancies.database import db_dependancy
from app.dependancies.auth import current_user
from starlette.responses import StreamingResponse


router_transaction = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)


class TransactionTypeFilter(str, Enum):
    all = "all"
    incoming = "incoming"
    outgoing = "outgoing"


@router_transaction.get("/{user_id}")
async def get_transactions(
    db: db_dependancy,
    current_user: current_user,
    query: str = Query(
        "", description="Search query for filtering transactions by name"
    ),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    transaction_type: TransactionTypeFilter = Query(
        TransactionTypeFilter.all, description="Filter by transaction type"
    ),
) -> list[TransactionName]:
    transactions_list = await get_all_transactions(
        query=query,
        user_id=current_user.id,
        limit=limit,
        offset=offset,
        db=db,
        transaction_type_filter=transaction_type.value,
    )

    if not transactions_list:
        return []

    formatted_transactions = []
    for transaction, sender_name, receiver_name in transactions_list:
        formatted_transactions.append(
            TransactionName(
                id=transaction.id,
                timestamp=str(transaction.timestamp),
                sender_id=transaction.sender_id,
                receiver_id=transaction.receiver_id,
                amount=transaction.amount,
                status=transaction.status,
                description=transaction.description,
                sender=sender_name,
                receiver=receiver_name,
            )
        )
    return formatted_transactions


@router_transaction.patch("/transfer-money", status_code=200)
async def transfer_money(
    reciever_user_id: int, amount: float, db: db_dependancy, current_user: current_user
) -> dict[str, str]:
    reciever_user = await get_user(reciever_user_id, db)
    if not reciever_user:
        raise HTTPException(status_code=404, detail="User not found")
    sender_wallet = await get_wallet(current_user.id, db)
    trans = TransactionIn(
        sender_id=current_user.id,
        receiver_id=reciever_user_id,
        amount=amount,
        status=True,
        description="",
    )
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount!")
    if not sender_wallet:
        raise HTTPException(status_code=404, detail="Not found wallet!")
    if sender_wallet.balance < amount:
        trans.status = False
        trans.description = "Not enough balance!"
        await log_transaction(trans, db)
        raise HTTPException(status_code=409, detail="Not enough balance")
    if current_user.id == reciever_user_id:
        raise HTTPException(status_code=400, detail="Cannot transfer to self")
    transfer_result = await transfer(current_user.id, reciever_user_id, amount, db)
    if not transfer_result:
        trans.status = False
        trans.description = "Failed!"
        await log_transaction(trans, db)
        raise HTTPException(status_code=400, detail="Transaction failed")
    await log_transaction(trans, db)
    return {"detail": "Transfer successful"}


@router_transaction.get("/export/pdf/{user_id}", response_class=StreamingResponse)
async def export_transactions_pdf(
    db: db_dependancy,
    current_user: current_user,
    query: str = Query(
        "", description="Search query for filtering transactions by name"
    ),
    transaction_type: TransactionTypeFilter = Query(
        TransactionTypeFilter.all, description="Filter by transaction type"
    ),
):

    transactions_data_tuples = await get_all_transactions(
        query=query,
        user_id=current_user.id,
        limit=10000,
        offset=0,
        db=db,
        transaction_type_filter=transaction_type.value,
    )


    if not transactions_data_tuples:
        raise HTTPException(status_code=404, detail="No transactions found to export.")

    pdf_data = []
    for transaction_obj, sender_name, receiver_name in transactions_data_tuples:
        amount_str = (
            f"- ${float(transaction_obj.amount):.2f}"
            if transaction_obj.sender_id == current_user.id
            else f"+ ${float(transaction_obj.amount):.2f}"
        )
        type_str = (
            "Outgoing" if transaction_obj.sender_id == current_user.id else "Incoming"
        )
        timestamp_str = (
            str(transaction_obj.timestamp.strftime("%Y-%m-%d %H:%M:%S"))
            if transaction_obj.timestamp
            else "N/A"
        )

        pdf_data.append(
            {
                "sender": sender_name,
                "receiver": receiver_name,
                "amount_display": amount_str,
                "type": type_str,
                "timestamp_display": timestamp_str,
                "status_display": "Successful" if transaction_obj.status else "Failed",
                "description": transaction_obj.description or "-",
            }
        )


    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.chapter_title("Transaction Details")

    headers = [
        "Sender",
        "Receiver",
        "Amount",
        "Type",
        "Date & Time",
        "Status",
        "Description",
    ]
    pdf.chapter_body(pdf_data, headers, user_name=current_user.name)

    pdf_output_content = pdf.output(dest="S")

    if isinstance(pdf_output_content, str):
        pdf_bytes = pdf_output_content.encode("latin-1")
    elif isinstance(pdf_output_content, (bytes, bytearray)):
        pdf_bytes = bytes(pdf_output_content)
    else:
        raise TypeError("Unexpected PDF output type from FPDF library")

    pdf_file_like_object = io.BytesIO(pdf_bytes)

    return StreamingResponse(
        pdf_file_like_object,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=transactions_{current_user.id}.pdf"
        },
    )

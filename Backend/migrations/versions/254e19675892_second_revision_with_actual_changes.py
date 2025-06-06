"""Second revision with actual changes

Revision ID: 254e19675892
Revises: 03bb2e554cc8
Create Date: 2025-05-28 10:27:16.468732

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "254e19675892"
down_revision: Union[str, None] = "03bb2e554cc8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###

    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("users", "hashed_password")
    op.alter_column(
        "transactions",
        "timestamp",
        existing_type=postgresql.TIMESTAMP(),
        nullable=True,
        existing_server_default=sa.text("now()"),
    )
    # ### end Alembic commands ###

"""Seccond revision

Revision ID: 03bb2e554cc8
Revises: 49c720ee8f39
Create Date: 2025-05-28 10:26:05.001561

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "03bb2e554cc8"
down_revision: Union[str, None] = "49c720ee8f39"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

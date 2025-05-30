"""add data element support

Revision ID: 7f6cdb3621f7
Revises: ec2f32c25f34
Create Date: 2023-03-06 19:15:12.530138

"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "7f6cdb3621f7"
down_revision = "ec2f32c25f34"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    DescriptionText = sa.Text(length=16777215)
    conn = op.get_bind()
    if conn.dialect.name == "postgresql":
        DescriptionText = sa.Text()
    op.create_table(
        "data_element",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("created_by", sa.Integer(), nullable=True),
        sa.Column("metastore_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=4096), nullable=False),
        sa.Column("description", DescriptionText, nullable=True),
        sa.Column("properties", sa.JSON(), nullable=True),
        sa.ForeignKeyConstraint(["created_by"], ["user.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(
            ["metastore_id"], ["query_metastore.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_data_element_name"), "data_element", ["name"], unique=True)
    op.create_table(
        "data_element_association",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("column_id", sa.Integer(), nullable=False),
        sa.Column(
            "type",
            sa.Enum(
                "REF",
                "ARRAY",
                "MAP",
                "STRUCT",
                "UNION",
                name="dataelementassociationtype",
            ),
            nullable=False,
        ),
        sa.Column("property_name", sa.String(length=255), nullable=False),
        sa.Column("data_element_id", sa.Integer(), nullable=True),
        sa.Column("primitive_type", sa.String(length=4096), nullable=True),
        sa.ForeignKeyConstraint(
            ["column_id"], ["data_table_column.id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(
            ["data_element_id"], ["data_element.id"], ondelete="CASCADE"
        ),
        sa.PrimaryKeyConstraint("id"),
        mysql_charset="utf8mb4",
        mysql_engine="InnoDB",
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("data_element_association")
    op.drop_index(op.f("ix_data_element_name"), table_name="data_element")
    op.drop_table("data_element")
    # ### end Alembic commands ###

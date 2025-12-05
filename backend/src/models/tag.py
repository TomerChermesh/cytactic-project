from typing import TYPE_CHECKING, List

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base
from src.models.associations import tasks_tags, calls_tags

if TYPE_CHECKING:
    from src.models.task import Task
    from src.models.call import Call


class Tag(Base):
    __tablename__ = 'tags'

    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    color_id: Mapped[int] = mapped_column(default=0, nullable=False)

    tasks: Mapped[List['Task']] = relationship(
        'Task',
        secondary=tasks_tags,
        back_populates='tags',
    )

    calls: Mapped[List['Call']] = relationship(
        'Call',
        secondary=calls_tags,
        back_populates='tags',
    )

from typing import TYPE_CHECKING, List

from sqlalchemy import String, Boolean, Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base
from src.models.associations import tasks_tags, calls_tasks
from src.models.custom_types import TaskType

if TYPE_CHECKING:
    from src.models.tag import Tag
    from src.models.call import Call


class Task(Base):
    __tablename__ = 'tasks'

    name: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[TaskType] = mapped_column(SqlEnum(TaskType), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    tags: Mapped[List['Tag']] = relationship(
        'Tag',
        secondary=tasks_tags,
        back_populates='tasks',
    )

    calls: Mapped[List['Call']] = relationship(
        'Call',
        secondary=calls_tasks,
        back_populates='tasks',
    )

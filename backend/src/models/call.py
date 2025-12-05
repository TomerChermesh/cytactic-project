from typing import TYPE_CHECKING, List

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models.base import Base
from src.models.associations import calls_tags, calls_tasks

if TYPE_CHECKING:
    from src.models.tag import Tag
    from src.models.task import Task

class Call(Base):
    __tablename__ = 'calls'

    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(String, nullable=True)

    tags: Mapped[List['Tag']] = relationship(
        'Tag',
        secondary=calls_tags,
        back_populates='calls',
    )

    tasks: Mapped[List['Task']] = relationship(
        'Task',
        secondary=calls_tasks,
        back_populates='calls',
    )

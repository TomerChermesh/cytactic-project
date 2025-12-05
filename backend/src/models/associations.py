from sqlalchemy import Column, ForeignKey, Table, Enum as SqlEnum

from src.models.base import Base
from src.models.custom_types import TaskStatus

tasks_tags: Table = Table(
    'tasks_tags',
    Base.metadata,
    Column('task_id', ForeignKey('tasks.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
)

calls_tags: Table = Table(
    'calls_tags',
    Base.metadata,
    Column('call_id', ForeignKey('calls.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
)

calls_tasks: Table = Table(
    'calls_tasks',
    Base.metadata,
    Column('call_id', ForeignKey('calls.id', ondelete='CASCADE'), primary_key=True),
    Column('task_id', ForeignKey('tasks.id', ondelete='CASCADE'), primary_key=True),
    Column('status', SqlEnum(TaskStatus), default=TaskStatus.OPEN),
)

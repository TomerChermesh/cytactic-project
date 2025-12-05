from typing import List, TYPE_CHECKING

from pydantic import BaseModel

from src.models.custom_types import TaskType, TaskStatus
from src.schemas.base import BaseReadSchema
from src.schemas.tag import TagRead

if TYPE_CHECKING:
    from src.models.task import Task


class TaskCreateBase(BaseModel):
    name: str
    type: TaskType


class TemplateTaskCreate(TaskCreateBase):
    tag_ids: List[int] = []


class AdHocTaskCreate(TaskCreateBase):
    call_id: int


class TaskUpdateBase(BaseModel):
    name: str | None = None
    is_active: bool | None = None

class TemplateTaskUpdate(TaskUpdateBase):
    tag_ids: List[int] | None = None


class TaskAndStatusUpdate(TaskUpdateBase):
    call_id: int
    status: TaskStatus


class TaskRead(BaseReadSchema):
    is_active: bool
    type: TaskType

    class Config:
        from_attributes = True

    @classmethod
    def from_model(cls, task: 'Task') -> 'TaskRead':
        return cls(
            id=task.id,
            name=task.name,
            created_at=task.created_at,
            updated_at=task.updated_at,
            is_active=task.is_active,
            type=task.type
        )


class TemplateTaskRead(TaskRead):
    tags: List[TagRead]

    @classmethod
    def from_model(cls, task: 'Task') -> 'TemplateTaskRead':
        return cls(
            id=task.id,
            name=task.name,
            created_at=task.created_at,
            updated_at=task.updated_at,
            is_active=task.is_active,
            type=task.type,
            tags=[TagRead.from_model(tag) for tag in task.tags if tag.is_active]
        )


class CallTaskRead(TaskRead):
    call_id: int
    status: TaskStatus

    @classmethod
    def from_model(cls, task: 'Task', call_id: int, status: TaskStatus) -> 'CallTaskRead':
        return cls(
            id=task.id,
            name=task.name,
            created_at=task.created_at,
            updated_at=task.updated_at,
            is_active=task.is_active,
            type=task.type,
            call_id=call_id,
            status=status
        )
        
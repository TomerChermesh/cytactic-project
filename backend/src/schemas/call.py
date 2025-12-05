from typing import List, TYPE_CHECKING

from pydantic import BaseModel

from src.schemas.base import BaseReadSchema
from src.schemas.tag import TagRead
from src.schemas.task import TaskRead

if TYPE_CHECKING:
    from src.models.call import Call


class CallCreate(BaseModel):
    name: str
    description: str | None = None
    tag_ids: List[int] = []


class CallUpdate(CallCreate):
    pass


class CallListItem(BaseReadSchema):
    description: str | None
    tags: List[TagRead]

    @classmethod
    def from_model(cls, call: 'Call') -> 'CallListItem':
        return cls(
            id=call.id,
            name=call.name,
            created_at=call.created_at,
            updated_at=call.updated_at,
            description=call.description,
            tags=[TagRead.from_model(tag) for tag in call.tags if tag.is_active]
        )


class CallRead(BaseReadSchema):
    description: str | None
    tags: List[TagRead]
    tasks: List[TaskRead]

    @classmethod
    def from_model(cls, call: 'Call') -> 'CallRead':
        return cls(
            id=call.id,
            name=call.name,
            created_at=call.created_at,
            updated_at=call.updated_at,
            description=call.description,
            tags=[TagRead.from_model(tag) for tag in call.tags if tag.is_active],
            tasks=[TaskRead.from_model(task) for task in call.tasks if task.is_active]
        )

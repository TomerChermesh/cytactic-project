from typing import List, TYPE_CHECKING

from src.schemas.tag import TagRead
from src.schemas.task import TaskRead

if TYPE_CHECKING:
    from src.models.tag import Tag


class TagWithSuggestedTasks(TagRead):
    suggested_tasks: List[TaskRead]

    @classmethod
    def from_model(cls, tag: 'Tag', suggested_tasks: List[TaskRead]) -> 'TagWithSuggestedTasks':
        tag_read = TagRead.from_model(tag)
        return cls(
            id=tag_read.id,
            name=tag_read.name,
            created_at=tag_read.created_at,
            updated_at=tag_read.updated_at,
            is_active=tag_read.is_active,
            color_id=tag_read.color_id,
            suggested_tasks=suggested_tasks
        )

from typing import List

from src.schemas.tag import TagRead
from src.schemas.task import TaskRead


class TagWithSuggestedTasks(TagRead):
    suggested_tasks: List[TaskRead]


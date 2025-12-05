from typing import List

from sqlalchemy.orm import Session, joinedload

from src.dal.base import BaseDAL
from src.models.tag import Tag
from src.models.custom_types import TaskType
from src.schemas.tag import TagRead
from src.schemas.associations import TagWithSuggestedTasks
from src.schemas.task import TaskRead
from src.core.exceptions import ItemNotFoundError

class TagDAL(BaseDAL[Tag]):
    def __init__(self, db: Session):
        super().__init__(db, Tag)

    def list_all_tags(self) -> List[Tag]:
        return self.get_all()

    def get_tag_by_id(self, tag_id: int) -> Tag:
        tag: Tag | None = self.get_by_id(tag_id)
        if tag is None:
            raise ItemNotFoundError(f'Tag with id {tag_id} not found')
        return tag
    
    def get_tags_by_ids(self, tag_ids: List[int]) -> List[TagRead]:
        tags: List[Tag] = [
            tag for tag in self.get_all_active()
            if tag.id in tag_ids
        ]
        return [TagRead.from_model(t) for t in tags]

    def get_tag_with_suggested_tasks(self, tag_id: int) -> TagWithSuggestedTasks:
        tag: Tag | None = (
            self.db.query(Tag)
            .options(joinedload(Tag.tasks))
            .filter(Tag.id == tag_id, Tag.is_active.is_(True))
            .first()
        )
        if tag is None:
            raise ItemNotFoundError(f'Tag with id {tag_id} not found')

        template_tasks: List[TaskRead] = [TaskRead.from_model(t) for t in tag.tasks if t.type == TaskType.TEMPLATE and t.is_active]
    
        return TagWithSuggestedTasks.from_model(tag, suggested_tasks=template_tasks)

    def create_tag(self, name: str, color_id: int = 0) -> Tag:
        tag: Tag = Tag(name=name, color_id=color_id)
        return self.create(tag)
    
    def update_tag(self, tag_id: int, name: str | None = None, is_active: bool | None = None, color_id: int | None = None) -> Tag:
        tag: Tag | None = self.get_tag_by_id(tag_id)

        if name is not None:
            tag.name = name
        if is_active is not None:
            tag.is_active = is_active
        if color_id is not None:
            tag.color_id = color_id

        return self.update(tag)

    def deactivate(self, tag_id: int) -> None:
        self.update_tag(tag_id, is_active=False)

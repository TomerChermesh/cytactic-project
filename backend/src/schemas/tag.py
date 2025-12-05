from typing import TYPE_CHECKING

from pydantic import BaseModel

from src.schemas.base import BaseReadSchema

if TYPE_CHECKING:
    from src.models.tag import Tag


class TagCreate(BaseModel):
    name: str


class TagUpdate(TagCreate):
    pass


class TagRead(BaseReadSchema):
    is_active: bool

    class Config:
        from_attributes = True

    @classmethod
    def from_model(cls, tag: 'Tag') -> 'TagRead':
        return cls(
            id=tag.id,
            name=tag.name,
            created_at=tag.created_at,
            updated_at=tag.updated_at,
            is_active=tag.is_active
        )

from typing import Generic, TypeVar, Type

from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import inspect

ModelType: Type[BaseModel] = TypeVar('ModelType')

class BaseDAL(Generic[ModelType]):
    def __init__(self, db: Session, model: Type[ModelType]):
        self.db: Session = db
        self.model: Type[ModelType] = model

    def _has_is_active_field(self) -> bool:
        mapper = inspect(self.model)
        return 'is_active' in mapper.columns

    def commit_and_refresh(self, instance: ModelType) -> ModelType:
        self.db.commit()
        self.db.refresh(instance)
        return instance

    def get_by_id(self, id: int) -> ModelType | None:
        query = self.db.query(self.model).filter(self.model.id == id)
        if self._has_is_active_field():
            query = query.filter(self.model.is_active.is_(True))
        return query.first()

    def get_all(self) -> list[ModelType]:
        query = self.db.query(self.model)
        if self._has_is_active_field():
            query = query.filter(self.model.is_active.is_(True))
        return query.all()

    def get_all_active(self) -> list[ModelType]:
        if not self._has_is_active_field():
            return self.get_all()
        return self.db.query(self.model).filter(self.model.is_active.is_(True)).all()

    def create(self, instance: ModelType) -> ModelType:
        self.db.add(instance)
        return self.commit_and_refresh(instance)

    def update(self, instance: ModelType) -> ModelType:
        return self.commit_and_refresh(instance)

    def delete(self, instance: ModelType) -> None:
        self.delete(instance)

from typing import List, Optional, TYPE_CHECKING
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session, joinedload

from src.dal.base import BaseDAL
from src.models.call import Call
from src.models.tag import Tag
from src.schemas.call import CallListItem, CallRead
from src.schemas.tag import TagRead
from src.schemas.task import TaskRead
from src.core.exceptions import ItemNotFoundError
from src.utils.validations import validate_days_limit

if TYPE_CHECKING:
    from src.dal.tag_dal import TagDAL


class CallDAL(BaseDAL[Call]):
    def __init__(self, db: Session, tag_dal: Optional['TagDAL'] = None):
        super().__init__(db, Call)
        self._tag_dal = tag_dal

    def list_all_calls(self) -> List[Call]:
        return self.get_all()

    def list_all_calls_with_tags(self, days: int = 7) -> List[CallListItem]:
        validate_days_limit(days)
        threshold_date: datetime = datetime.now(timezone.utc) - timedelta(days=days)
        
        calls: List[Call] = (
            self.db.query(Call)
            .options(joinedload(Call.tags))
            .filter(Call.created_at >= threshold_date)
            .all()
        )
        
        return [CallListItem.from_model(c) for c in calls]

    def get_call_by_id(self, call_id: int) -> Call:
        call: Call | None = self.get_by_id(call_id)
        if call is None:
            raise ItemNotFoundError(f'Call with id {call_id} not found')
        return call

    def get_call_details(self, call_id: int) -> CallRead:
        call: Call | None = (
            self.db.query(Call)
            .options(joinedload(Call.tags), joinedload(Call.tasks))
            .filter(Call.id == call_id)
            .first()
        )

        if call is None:
            raise ItemNotFoundError(f'Call with id {call_id} not found')

        return CallRead.from_model(call)

    def create_call(self, name: str, tag_ids: List[int], description: str | None = None) -> CallRead:
        call: Call = Call(name=name, description=description)
        tags: List[Tag] = []

        if tag_ids and self._tag_dal:
            all_active_tags = self._tag_dal.get_all_active()
            tags = [tag for tag in all_active_tags if tag.id in tag_ids]
            call.tags = tags

        call = self.create(call)

        return CallRead(
            id=call.id,
            name=call.name,
            created_at=call.created_at,
            updated_at=call.updated_at,
            description=call.description,
            tags=[TagRead.from_model(tag) for tag in tags if tag.is_active],
            tasks=[],
        )

    def update_call(self, call_id: int, name: str | None = None, description: str | None = None) -> Call:
        call: Call = self.get_call_by_id(call_id)
        if name is not None:
            call.name = name
        # If description is empty string, set to None. Otherwise update if provided.
        if description is not None:
            call.description = description if description else None

        return self.update(call)

    def update_call_and_tags(self, call_id: int, name: str | None = None, description: str | None = None, tag_ids: List[int] | None = None) -> CallRead:
        call: Call = self.get_call_by_id(call_id)
        tags: List[Tag] = []
        if tag_ids is not None and self._tag_dal:
            all_active_tags = self._tag_dal.get_all_active()
            tags = [tag for tag in all_active_tags if tag.id in tag_ids]
            call.tags = tags
            self.db.commit()
            self.db.refresh(call)

        call = self.update_call(call_id, name=name, description=description)
        
        # Reload call with tasks for CallRead
        call_with_tasks: Call | None = (
            self.db.query(Call)
            .options(joinedload(Call.tags), joinedload(Call.tasks))
            .filter(Call.id == call_id)
            .first()
        )
        
        if call_with_tasks is None:
            raise ItemNotFoundError(f'Call with id {call_id} not found')
        
        return CallRead.from_model(call_with_tasks)

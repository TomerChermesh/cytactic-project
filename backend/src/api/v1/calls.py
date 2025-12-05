from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.core.exceptions import InvalidDaysLimitError, ItemNotFoundError
from src.dal.dependencies import get_call_dal, get_task_dal
from src.dal.call_dal import CallDAL
from src.dal.task_dal import TaskDAL
from src.schemas.call import CallCreate, CallListItem, CallRead, CallUpdate
from src.schemas.task import CallTaskRead

router: APIRouter = APIRouter(prefix='/v1/calls')


@router.get('', response_model=List[CallListItem])
def list_calls(
    days: int = 7,
    call_dal: CallDAL = Depends(get_call_dal)
) -> List[CallListItem]:
    try:
        return call_dal.list_all_calls_with_tags(days=days)
    except InvalidDaysLimitError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post('', response_model=CallRead, status_code=status.HTTP_201_CREATED)
def create_call(
    payload: CallCreate,
    call_dal: CallDAL = Depends(get_call_dal)
) -> CallRead:
    try:
        return call_dal.create_call(payload.name, payload.tag_ids, payload.description)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))



@router.get('/{call_id}', response_model=CallRead)
def get_call(
    call_id: int,
    call_dal: CallDAL = Depends(get_call_dal)
) -> CallRead:
    try:
        return call_dal.get_call_details(call_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.patch('/{call_id}', response_model=CallRead)
def update_call(
    call_id: int,
    payload: CallUpdate,
    call_dal: CallDAL = Depends(get_call_dal)
) -> CallRead:
    try:
        return call_dal.update_call_and_tags(call_id, payload.name, payload.description, payload.tag_ids)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get('/{call_id}/tasks', response_model=List[CallTaskRead])
def get_call_tasks(
    call_id: int,
    task_dal: TaskDAL = Depends(get_task_dal)
) -> List[CallTaskRead]:
    try:
        return task_dal.get_all_tasks_by_call_id(call_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

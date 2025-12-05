from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.core.exceptions import InvalidDaysLimitError, ItemNotFoundError
from src.dal.dependencies import get_call_dal, get_task_dal
from src.dal.call_dal import CallDAL
from src.dal.task_dal import TaskDAL
from src.schemas.call import CallCreate, CallListItem, CallRead, CallUpdate
from src.schemas.task import CallTaskRead
from src.utils.logger import logger

router: APIRouter = APIRouter(prefix='/v1/calls')


@router.get('', response_model=List[CallListItem])
def list_calls(
    days: int = 7,
    call_dal: CallDAL = Depends(get_call_dal)
) -> List[CallListItem]:
    try:
        logger.info(f'Listing calls with days filter: {days}')
        result = call_dal.list_all_calls_with_tags(days=days)
        logger.info(f'Successfully retrieved {len(result)} calls')
        return result
    except InvalidDaysLimitError as e:
        logger.error(f'Invalid days limit: {days}', exception=e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post('', response_model=CallRead, status_code=status.HTTP_201_CREATED)
def create_call(
    payload: CallCreate,
    call_dal: CallDAL = Depends(get_call_dal)
) -> CallRead:
    try:
        logger.info(f'Creating call: name={payload.name}, tag_ids={payload.tag_ids}, description={payload.description}')
        result = call_dal.create_call(payload.name, payload.tag_ids, payload.description)
        logger.info(f'Successfully created call with id: {result.id}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Failed to create call: {payload.name}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))



@router.get('/{call_id}', response_model=CallRead)
def get_call(
    call_id: int,
    call_dal: CallDAL = Depends(get_call_dal)
) -> CallRead:
    try:
        logger.info(f'Getting call details for id: {call_id}')
        result = call_dal.get_call_details(call_id)
        logger.info(f'Successfully retrieved call: {result.name}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Call not found: id={call_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))


@router.patch('/{call_id}', response_model=CallRead)
def update_call(
    call_id: int,
    payload: CallUpdate,
    call_dal: CallDAL = Depends(get_call_dal)
) -> CallRead:
    try:
        logger.info(f'Updating call: id={call_id}, name={payload.name}, tag_ids={payload.tag_ids}, description={payload.description}')
        result = call_dal.update_call_and_tags(call_id, payload.name, payload.description, payload.tag_ids)
        logger.info(f'Successfully updated call: {result.name}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Call not found for update: id={call_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))


@router.get('/{call_id}/tasks', response_model=List[CallTaskRead])
def get_call_tasks(
    call_id: int,
    task_dal: TaskDAL = Depends(get_task_dal)
) -> List[CallTaskRead]:
    try:
        logger.info(f'Getting tasks for call: id={call_id}')
        result = task_dal.get_all_tasks_by_call_id(call_id)
        logger.info(f'Successfully retrieved {len(result)} tasks for call: {call_id}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Call not found when getting tasks: id={call_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))

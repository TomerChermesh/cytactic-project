from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.dal.dependencies import get_call_dal, get_task_dal
from src.dal.call_dal import CallDAL
from src.dal.task_dal import TaskDAL
from src.models.task import Task
from src.schemas.task import AdHocTaskCreate, TaskRead, TaskAndStatusUpdate
from src.core.exceptions import ItemNotFoundError
from src.utils.logger import logger

router: APIRouter = APIRouter(prefix='/v1/tasks')


@router.get('', response_model=List[TaskRead])
def list_tasks(task_dal: TaskDAL = Depends(get_task_dal)) -> List[Task]:
    logger.info('Listing all tasks')
    result = task_dal.list_all_tasks()
    logger.info(f'Successfully retrieved {len(result)} tasks')
    return result


@router.post('', response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: AdHocTaskCreate,
    task_dal: TaskDAL = Depends(get_task_dal)
) -> Task:
    try:
        logger.info(f'Creating ad-hoc task: name={payload.name}, call_id={payload.call_id}, status={payload.status}')
        result = task_dal.create_ad_hoc_task(payload.name, payload.call_id, payload.status)
        logger.info(f'Successfully created task with id: {result.id}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Failed to create ad-hoc task: {payload.name}', exception=e)
        raise HTTPException(status_code=400, detail=str(e))


@router.patch('/{task_id}', response_model=TaskRead)
def update_task(
    task_id: int,
    payload: TaskAndStatusUpdate,
    task_dal: TaskDAL = Depends(get_task_dal)
) -> Task:
    try:
        logger.info(f'Updating task: id={task_id}, name={payload.name}, status={payload.status}, call_id={payload.call_id}')
        result = task_dal.update_task_and_status(task_id, payload.call_id, payload.status, payload.name)
        logger.info(f'Successfully updated task: {result.name}')
        return result
    except ItemNotFoundError as e:
        logger.error(f'Task not found for update: id={task_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))


@router.delete('/{task_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    task_dal: TaskDAL = Depends(get_task_dal)
) -> None:
    try:
        logger.info(f'Deleting task: id={task_id}')
        task_dal.deactivate(task_id)
        logger.info(f'Successfully deleted task: id={task_id}')
    except ItemNotFoundError as e:
        logger.error(f'Task not found for deletion: id={task_id}', exception=e)
        raise HTTPException(status_code=404, detail=str(e))

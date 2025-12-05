from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.dal.dependencies import get_call_dal, get_task_dal
from src.dal.call_dal import CallDAL
from src.dal.task_dal import TaskDAL
from src.models.task import Task
from src.schemas.task import AdHocTaskCreate, TaskRead, TaskAndStatusUpdate
from src.core.exceptions import ItemNotFoundError

router: APIRouter = APIRouter(prefix='/v1/tasks')


@router.get('', response_model=List[TaskRead])
def list_tasks(task_dal: TaskDAL = Depends(get_task_dal)) -> List[Task]:
    return task_dal.list_all_tasks()


@router.post('', response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: AdHocTaskCreate,
    call_dal: CallDAL = Depends(get_call_dal),
    task_dal: TaskDAL = Depends(get_task_dal),
) -> Task:
    try:
        return task_dal.create_ad_hoc_task(payload.name, payload.call_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch('/{task_id}', response_model=TaskRead)
def update_task(
    task_id: int,
    payload: TaskAndStatusUpdate,
    task_dal: TaskDAL = Depends(get_task_dal),
) -> Task:
    try:
        return task_dal.update_task_and_status(task_id, payload.call_id, payload.status, payload.name)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete('/{task_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    task_dal: TaskDAL = Depends(get_task_dal),
) -> None:
    try:
        task_dal.deactivate(task_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

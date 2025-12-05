from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.dal.dependencies import get_task_dal
from src.dal.task_dal import TaskDAL
from src.schemas.task import TemplateTaskCreate, TemplateTaskUpdate, TemplateTaskRead, CallTaskRead
from src.core.exceptions import ItemNotFoundError, InvalidTaskTypeError

router: APIRouter = APIRouter(prefix='/v1/tasks/template')


@router.get('/list', response_model=List[TemplateTaskRead])
def list_template_tasks(task_dal: TaskDAL = Depends(get_task_dal)) -> List[TemplateTaskRead]:
    try:
        return task_dal.list_all_template_tasks()
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post('', response_model=TemplateTaskRead, status_code=status.HTTP_201_CREATED)
def create_template_task(payload: TemplateTaskCreate, task_dal: TaskDAL = Depends(get_task_dal)) -> TemplateTaskRead:
    try:
        return task_dal.create_template_task(payload.name, payload.tag_ids)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch('/{task_id}', response_model=TemplateTaskRead)
def update_template_task(task_id: int, payload: TemplateTaskUpdate, task_dal: TaskDAL = Depends(get_task_dal)) -> TemplateTaskRead:
    try:
        return task_dal.update_template_task_and_tags(task_id, payload.name, payload.tag_ids)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except InvalidTaskTypeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post('/{task_id}/link', response_model=CallTaskRead)
def link_template_task_to_call(task_id: int, call_id: int, task_dal: TaskDAL = Depends(get_task_dal)) -> CallTaskRead:
    try:
        return task_dal.link_template_task_to_call(task_id, call_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post('/{task_id}/unlink', response_model=None)
def unlink_template_task_from_call(task_id: int, call_id: int, task_dal: TaskDAL = Depends(get_task_dal)) -> None:
    try:
        task_dal.unlink_template_task_from_call(task_id, call_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete('/{task_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_template_task(task_id: int, task_dal: TaskDAL = Depends(get_task_dal)) -> None:
    try:
        task_dal.deactivate(task_id)
    except ItemNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
